import RabbitMQConnection from '../rabbitConexion';
import { rabbitmqgetSuppliersUsecase } from '../../../dependencies';

export class ConsumerChatBotSupplier {
    private channel: any;
    private queue: string;

    constructor() {
        this.queue = process.env.RABBITMQ_QUEUE || 'gemini-suppliers-queue';
    }

    async setup(): Promise<void> {
        try {
            const connection = RabbitMQConnection.getInstance();
            this.channel = await connection.connect();
            this.channel.prefetch(1); // Procesar un mensaje a la vez

            // Asegurar que la cola existe
            await this.channel.assertQueue(this.queue, { durable: true });

            console.log(`RabbitMQ Consumer configurado para la cola: ${this.queue}`);
        } catch (error) {
            console.error('Error configurando RabbitMQ Consumer:', error);
            throw new Error('No se pudo establecer conexión con RabbitMQ.');
        }
    }

    async consume(onMessage: (data: any) => void): Promise<void> {
        console.log(`Esperando mensajes en la cola: ${this.queue}`);
        if (!this.channel) {
            throw new Error('RabbitMQ no está configurado. Llama a `setup()` primero.');
        }

        this.channel.consume(this.queue, async (msg: any) => {
            if (msg !== null) {
                try {
                    const rawMessage = msg.content.toString();
                    console.log('Mensaje recibido:', rawMessage);

                    const message = JSON.parse(rawMessage);

                    // Validar que el mensaje incluye `userUuid`
                    if (!message.prompt) {
                        console.error('El mensaje no contiene `userUuid`:', message);
                        this.nackWithError(msg, 'Mensaje inválido: falta `userUuid`');
                        return;
                    }

                    // Obtener la lista de proveedores desde el caso de uso
                    const suppliers = await rabbitmqgetSuppliersUsecase.execute(message.prompt);
                    console.log('Proveedores obtenidos:', suppliers);

                    // Crear el objeto con la lista de proveedores
                    const responseObject = { suppliers };
                    console.log('Objeto de respuesta creado:', responseObject);

                    // Procesar el mensaje con el callback
                    onMessage(responseObject);

                    // Responder si existe una cola de respuesta
                    if (msg.properties.replyTo) {
                        this.channel.sendToQueue(
                            msg.properties.replyTo,
                            Buffer.from(JSON.stringify(responseObject)),
                            { correlationId: msg.properties.correlationId }
                        );
                    }

                    // Confirmar el mensaje como procesado correctamente
                    this.channel.ack(msg);
                } catch (error) {
                    console.error('Error procesando el mensaje:', error);
                    this.nackWithError(msg, 'Error interno procesando el mensaje');
                }
            }
        });
    }

    /**
     * NACK un mensaje y enviar un error a la cola de respuesta.
     */
    private nackWithError(msg: any, errorMessage: string): void {
        console.error(errorMessage);

        if (msg.properties.replyTo) {
            this.channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify({ error: errorMessage })),
                { correlationId: msg.properties.correlationId }
            );
        }

        this.channel.nack(msg, false, false);
    }

    async close(): Promise<void> {
        try {
            const connection = RabbitMQConnection.getInstance();
            await connection.close();
            console.log('Conexión de RabbitMQ cerrada.');
        } catch (error) {
            console.error('Error cerrando conexión de RabbitMQ Consumer:', error);
        }
    }
}
