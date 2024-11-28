import RabbitMQConnection from '../rabbitConexion';

export class RabbitPaymentProducer {
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
            console.log('userUuid', userUuid);
            console.log('userUuid', typeof userUuid);
    
            // Generar la cola temporal para recibir la respuesta
            const replyQueue = await this.channel.assertQueue('', { exclusive: true });
    
            // Enviar el mensaje a la cola principal antes de consumir la respuesta
            const message = JSON.stringify({ userUuid });
            this.channel.sendToQueue(
                process.env.RABBITMQ_QUEUE || 'payment-supplier-queue',
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
    
            // Aquí es seguro acceder a 'response' ya que la promesa ha sido resuelta
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
