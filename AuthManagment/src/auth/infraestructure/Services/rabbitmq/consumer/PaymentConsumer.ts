import RabbitMQConnection from '../rabbitConexion';
import { rabbitmqPaymentUsecase } from '../../../dependencies';
import CustomError  from '../../../../application/errors/CustomError';

export class ConsumerPayment {
    private channel: any;
    private queue: string;

    constructor() {
        this.queue = process.env.RABBITMQ_QUEUE || 'payment-supplier-queue';
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

    
    async consume(onMessage: (data: any) => void): Promise<any> {
        console.log('Iniciando RabbitMQ Consumer...');
    
        if (!this.channel) {
            throw new Error('RabbitMQ no está configurado. Llama a `setup()` primero.');
        }
    
        try {
            console.log(`Esperando mensajes en la cola: ${this.queue}`);
    
            this.channel.consume(this.queue, async (msg: any) => {
                if (!msg) return;
    
                try {
                    // Parsear el mensaje recibido
                    const rawMessage = msg.content.toString();
                    console.log('Contenido bruto del mensaje recibido:', rawMessage);
    
                    let message: any;
                    try {
                        message = JSON.parse(rawMessage);
                    } catch (error) {
                        console.error('Error al parsear el mensaje:', rawMessage);
                        this.channel.nack(msg, false, false); // Rechazar mensaje
                        return;
                    }
    
                    // Validar que sea un objeto válido
                    if (typeof message !== 'object' || message === null) {
                        console.error('El mensaje recibido no es un objeto válido:', message);
                        this.channel.nack(msg, false, false); // Rechazar mensaje
                        return;
                    }
    
                    console.log('Mensaje recibido como objeto:', message);
    
                    const { userUuid, ...otherProperties } = message;
    
                    if (!userUuid) {
                        console.error('userUuid no está presente en el mensaje.');
                        this.channel.nack(msg, false, false); // Rechazar mensaje
                        return;
                    }
    
                    // Obtener datos completos del usuario
                    const paymentResponse = await rabbitmqPaymentUsecase.execute(userUuid);
    
                    if (!paymentResponse || paymentResponse.status !== 200) {
                        console.error('No se encontraron datos para el usuario con UUID:', userUuid);
                        this.channel.nack(msg, false, false); // Rechazar mensaje
                        return;
                    }
    
                    const paymentData = paymentResponse.data;
    
                    // Añadir los datos al mensaje
                    message.userData = {
                        uuid: paymentData.uuid,
                        firstname: paymentData.firstname,
                        lastname: paymentData.lastname,
                        email: paymentData.email,
                        phone: paymentData.phone,
                        role: paymentData.role,
                    };
    
                    console.log('Mensaje actualizado con datos del usuario:', message);
    
                    // Procesar el mensaje actualizado
                    onMessage(message);
    
                    // Enviar respuesta si hay una cola de respuesta (replyTo)
                    const replyQueue = msg.properties.replyTo;
                    if (replyQueue) {
                        this.channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(message)), {
                            correlationId: msg.properties.correlationId,
                        });
                    }
    
                    // Confirmar que el mensaje fue procesado
                    this.channel.ack(msg);
    
                } catch (error) {
                    if (error instanceof CustomError) {
                        console.error('Error procesando el mensaje:', error.message);
    
                        const errorMessage = {
                            statusCode: error.statusCode,
                            message: error.message,
                        };
    
                        // Enviar mensaje de error a la cola de respuesta
                        if (msg.properties.replyTo) {
                            this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(errorMessage)), {
                                correlationId: msg.properties.correlationId,
                            });
                        }
    
                        this.channel.nack(msg, false, false); // Rechazar mensaje
    
                    } else {
                        console.error('Error inesperado:', error);
    
                        const errorMessage = {
                            statusCode: 500,
                            message: 'Error interno del servidor.',
                        };
    
                        // Enviar error genérico a la cola de respuesta
                        if (msg.properties.replyTo) {
                            this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(errorMessage)), {
                                correlationId: msg.properties.correlationId,
                            });
                        }
    
                        this.channel.nack(msg, false, false); // Rechazar mensaje
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
