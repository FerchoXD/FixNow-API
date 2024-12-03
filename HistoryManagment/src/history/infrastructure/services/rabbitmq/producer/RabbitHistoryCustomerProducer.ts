import RabbitMQConnection from '../rabbitConexion';

export class ProducerHistoryCustomer {
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

    async send(userUuid: string): Promise<any> {
        try {

            console.log('customer id', userUuid);
            console.log('useruyudi', typeof userUuid);

            // Generar la cola temporal para recibir la respuesta
            const replyQueue = await this.channel.assertQueue('', { exclusive: true });
    
            const response = await new Promise<any>((resolve, reject) => {
                this.channel.consume(replyQueue.queue, (msg: any) => {
                    if (msg && msg.properties.correlationId === this.correlationId) {
                        const responseMessage = JSON.parse(msg.content.toString());
                        resolve(responseMessage);
                        this.channel.ack(msg);
                    }
                }, { noAck: false });

                const message = JSON.stringify({ userUuid });
    
                // Enviar el mensaje a la cola principal
                this.channel.sendToQueue(
                    process.env.RABBITMQ_QUEUE || 'history-customer-queue',
                    Buffer.from(message), // Asegúrate de que el mensaje sea un JSON string válido
                    {
                        replyTo: replyQueue.queue,
                        correlationId: this.correlationId
                    }
                );
            });
    
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
