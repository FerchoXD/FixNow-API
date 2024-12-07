import RabbitMQConnection from './rabbitConexion';
import CustomError  from '../utils/errors/CustomError';
import { RabbitConsumerNotificationUseCase } from '../usesCase/RabbitConsumerNotificationUseCase';

export class RabbitConsumerNotification {
    private channel: any;
    private queue: string;
    private rabbitConsumerNotificationUseCase: RabbitConsumerNotificationUseCase;

    constructor() {
        this.queue = process.env.RABBITMQ_QUEUE || 'history-tokenfcm-queue';
        this.rabbitConsumerNotificationUseCase = new RabbitConsumerNotificationUseCase();
    }

    async setup(): Promise<void> {
        try {
            const connection = RabbitMQConnection.getInstance();
            this.channel = await connection.connect();
            this.channel.prefetch(1);
            // Asegurarse de que la cola exista
            await this.channel.assertQueue(this.queue, { durable: true });
            //console.log(`RabbitMQ Consumer configurado para la cola: ${this.queue}`);
        } catch (error) {
            console.error('Error configurando RabbitMQ Consumer:', error);
            throw new Error('No se pudo establecer conexión con RabbitMQ.');
        }
    }

    
    async consume(onMessage: (data: any) => void): Promise<void> {
        if (!this.channel) {
            console.error('El canal de RabbitMQ no está configurado.');
            throw new Error('RabbitMQ no está configurado. Llama a `setup()` primero.');
        }
    
        try {
            console.log(`Esperando mensajes en la cola: ${this.queue}`);
    
            this.channel.consume(this.queue, async (msg: any) => {
                if (msg !== null) {
                    try {
                        console.log('Mensaje recibido:', msg.content.toString());
    
                        const rawMessage = msg.content.toString();
                        let message;
    
                        try {
                            message = JSON.parse(rawMessage);
                            console.log('Mensaje parseado:', message);
                        } catch (parseError) {
                            console.error('Error al parsear el mensaje:', rawMessage, parseError);
                            this.channel.nack(msg, false, false);
                            return;
                        }
    
                        if (!message.tokenfcm || !message.title || !message.body) {
                            console.error('Mensaje recibido incompleto:', message);
                            this.channel.nack(msg, false, false);
                            return;
                        }
    
                        try {
                            const response = await this.rabbitConsumerNotificationUseCase.execute(
                                message.tokenfcm,
                                message.title,
                                message.body
                            );
                        
                            if (!response) {
                                console.error('El caso de uso devolvió una respuesta vacía.');
                                this.channel.nack(msg, false, false);
                                return;
                            }
                        
                            console.log('Respuesta del caso de uso:', response);
                        
                            message.response = response;
                            onMessage(message);
                        
                            const replyQueue = msg.properties.replyTo;
                            if (replyQueue) {
                                this.channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(message)), {
                                    correlationId: msg.properties.correlationId,
                                });
                            }
                        
                            this.channel.ack(msg);
                        } catch (error) {
                            console.error('Error procesando el mensaje en el caso de uso:', error);
                        
                            const errorMessage = {
                                statusCode: 500,
                                message: 'Error interno del servidor.',
                            };
                        
                            this.channel.sendToQueue(
                                msg.properties.replyTo,
                                Buffer.from(JSON.stringify(errorMessage)),
                                { correlationId: msg.properties.correlationId },
                            );
                        
                            this.channel.nack(msg, false, false);
                        }
                        
                    } catch (processingError) {
                        console.error('Error procesando el mensaje:', processingError);
                        this.channel.nack(msg, false, false);
                    }
                }
            });
        } catch (consumeError) {
            console.error('Error al consumir mensajes de RabbitMQ:', consumeError);
            throw new Error('No se pudo consumir mensajes de RabbitMQ.');
        }
    }
    

    async close(): Promise<void> {
        try {
            const connection = RabbitMQConnection.getInstance();
            await connection.close();
        } catch (error) {
            console.error('Error cerrando conexión de RabbitMQ Consumer:', error);
        }
    }
}
