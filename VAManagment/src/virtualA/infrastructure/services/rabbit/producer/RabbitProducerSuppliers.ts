import RabbitMQConnection from '../rabbitConexion';

export class ProducerSuppliers {
    private channel: any;
    private correlationId: string;

    constructor() {
        this.correlationId = this.generateCorrelationId();
    }

    // Genera un ID de correlación único para cada mensaje
    private generateCorrelationId(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    async setup(): Promise<void> {
        try {
            const connection = RabbitMQConnection.getInstance();
            this.channel = await connection.connect();
            console.log("Producer conectado y listo.");
        } catch (error) {
            console.error("Error configurando el productor:", error);
            throw new Error('No se pudo configurar el productor RabbitMQ.');
        }
    }

    async send(prompt: string): Promise<any> {
        try {
    
            const replyQueue = await this.channel.assertQueue('', { exclusive: true });
            
            const message = JSON.stringify({ prompt });
            this.channel.sendToQueue(
                process.env.RABBITMQ_QUEUE || 'gemini-suppliers-queue',
                Buffer.from(message),
                {
                    replyTo: replyQueue.queue,
                    correlationId: this.correlationId
                }
            );
    
            // Consumir la respuesta
            const response = await new Promise<any>((resolve, reject) => {
                this.channel.consume(replyQueue.queue, (msg: any) => {
                    if (msg && msg.properties.correlationId === this.correlationId) {
                        const responseMessage = JSON.parse(msg.content.toString());
                        resolve(responseMessage);
                        this.channel.ack(msg);
                    }
                }, { noAck: false });
            });

            console.log('response', response);
    
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
