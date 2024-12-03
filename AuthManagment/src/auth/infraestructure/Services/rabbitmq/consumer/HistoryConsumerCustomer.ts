import RabbitMQConnection from '../rabbitConexion';
import { rabbitMQHistoryCustomerUseCase } from '../../../dependencies';
import CustomError  from '../../../../application/errors/CustomError';

export class ConsumerHistoryCustomer{
    private channel: any;
    private queue: string;

    constructor() {
        this.queue = process.env.RABBITMQ_QUEUE || 'history-customer-queue';
    }

    async setup(): Promise<void> {
        try {
            const connection = RabbitMQConnection.getInstance();
            this.channel = await connection.connect();
            this.channel.prefetch(1); // Procesa un mensaje a la vez por consumidor

            // Asegurarse de que la cola exista
            await this.channel.assertQueue(this.queue, { durable: true });

            console.log(`RabbitMQ Consumer configurado para la cola: ${this.queue}`);
        } catch (error) {
            console.error('Error configurando RabbitMQ Consumer:', error);
            throw new Error('No se pudo establecer conexión con RabbitMQ.');
        }
    }

    
    async consume(onMessage: (data: any) => void): Promise<void> {
        console.log('Iniciando RabbitMQ Consumer...');
        if (!this.channel) {
            throw new Error('RabbitMQ no está configurado. Llama a `setup()` primero.');
        }

        try {
            console.log(`Esperando mensajes en la cola: ${this.queue}`);

            // Consumir mensajes de la cola
            this.channel.consume(this.queue, async (msg: any) => {
                console.log('Mensaje recibido:', msg.content.toString());
                if (msg !== null) {
                    try {
                        const rawMessage = msg.content.toString();
                        console.log('Contenido bruto del mensaje recibido:', rawMessage);
            
                        let message;
                        try {
                            message = JSON.parse(rawMessage);
                        } catch (error) {
                            console.error('Error al parsear el mensaje:', rawMessage);
                            this.channel.nack(msg, false, false);
                            return;
                        }
            
                        // Validar que el mensaje sea un objeto antes de continuar
                        if (typeof message !== 'object' || message === null) {
                            console.error('El mensaje recibido no es un objeto válido:', message);
                            this.channel.nack(msg, false, false);
                            return;
                        }
            
                        console.log('Mensaje recibido como objeto:', message);
            
                        // Obtener fullname
                        const fullname = await rabbitMQHistoryCustomerUseCase.execute(message.userUuid);
                        console.log('Obteniendo fullname:', fullname);
            
                        // Asignar el fullname al mensaje
                        message.fullname = fullname;
            
                        console.log('Mensaje actualizado:', message);
            
                        // Procesar el mensaje
                        onMessage(message);
            
                        // Enviar el mensaje de vuelta a la cola temporal si se requiere
                        const replyQueue = msg.properties.replyTo;
                        if (replyQueue) {
                            this.channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(message)), {
                                correlationId: msg.properties.correlationId,
                            });
                        }
            
                        // Confirmar que el mensaje fue procesado correctamente
                        this.channel.ack(msg);
                    } catch (error) {
                        if (error instanceof CustomError) {
                            // Manejar errores personalizados de manera estructurada
                            console.error('Error procesando historial:', error.message);
                            
                            // Responder al cliente con el código de estado y el mensaje de error
                            const errorMessage = {
                                statusCode: error.statusCode,
                                message: error.message
                            };

                            console.log('Enviando mensaje de error:', errorMessage);
                
                            // Aquí puedes enviar este error de vuelta al cliente
                            this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(errorMessage)), {
                                correlationId: msg.properties.correlationId,
                            });

                            this.channel.nack(msg, false, false); // Rechazar el mensaje

                        } else {
                            // Manejar errores no previstos
                            console.error('Error inesperado:', error);
                            const errorMessage = {
                                statusCode: 500,
                                message: 'Error interno del servidor.'
                            };
                            
                            // Responder con un error genérico de servidor
                            this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(errorMessage)), {
                                correlationId: msg.properties.correlationId,
                            });
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error al consumir mensajes de RabbitMQ:', error);
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
