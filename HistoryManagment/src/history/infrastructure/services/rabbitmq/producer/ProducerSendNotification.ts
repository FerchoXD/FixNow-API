import { on } from 'events';
import RabbitMQConnection from '../rabbitConexion';

export class ProducerSendNotification {
    private channel: any;
    private correlationId: string;

    constructor() {
        this.correlationId = this.generateCorrelationId();
    }

    private generateCorrelationId(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    async setup(): Promise<void> {
        try {
            const connection = RabbitMQConnection.getInstance();
            this.channel = await connection.connect();
            console.log("Producer para obtener el token conectado y listo.");
        } catch (error) {
            console.error("Error configurando el productor:", error);
            throw new Error('No se pudo configurar el productor RabbitMQ.');
        }
    }

    

    async send(tokenfcm: string, title:string, body:string): Promise<any> {
        try {
            console.log('Enviando mensaje al productor...', tokenfcm, title, body);
            const replyQueue = await this.channel.assertQueue('', { exclusive: true });
    
            const response = await new Promise<any>((resolve, reject) => {
                this.channel.consume(replyQueue.queue, (msg: any) => {
                    if (msg && msg.properties.correlationId === this.correlationId) {
                        const responseMessage = JSON.parse(msg.content.toString());
                        resolve(responseMessage);
                        this.channel.ack(msg);
                    }
                }, { noAck: false });

                const message = JSON.stringify({ tokenfcm, title, body });
    
                this.channel.sendToQueue(
                    process.env.RABBITMQ_QUEUE || 'history-tokenfcm-queue',
                    Buffer.from(message),
                    {
                        replyTo: replyQueue.queue,
                        correlationId: this.correlationId
                    }
                );
            });

            console.log('Respuesta de rabbit notificacion:', response);
            return response;
        } catch (error) {
            console.error('Error enviando el mensaje al productor:', error);
            throw new Error('No se pudo enviar el mensaje a RabbitMQ.');
        }
    }
    
    async close(): Promise<void> {
        try {
            const connection = RabbitMQConnection.getInstance();
            await connection.close();
        } catch (error) {
            console.error('Error cerrando la conexión del productor RabbitMQ:', error);
        }
    }
}
