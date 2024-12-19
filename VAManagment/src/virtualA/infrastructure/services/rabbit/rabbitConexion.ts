import * as amqp from 'amqplib';
import { Connection, Channel } from 'amqplib';

class RabbitMQConnection {
    private static instance: RabbitMQConnection | null = null;
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    private constructor() {}

    // Singleton para asegurar una única conexión
    static getInstance(): RabbitMQConnection {
        if (!this.instance) {
            this.instance = new RabbitMQConnection();
        }
        return this.instance;
    }

    // Conexión a RabbitMQ
    async connect(): Promise<Channel> {
        const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
        if (!url.startsWith('amqp://') && !url.startsWith('amqps://')) {
            throw new Error(`La URL de RabbitMQ debe comenzar con 'amqp://' o 'amqps://'. URL actual: ${url}`);
        }

        try {
            if (!this.connection) {
                this.connection = await amqp.connect(url);
                console.log('Conexión a RabbitMQ establecida.');
            }

            if (!this.channel) {
                this.channel = await this.connection.createChannel();
                console.log('Canal de RabbitMQ creado.');
            }

            return this.channel;
        } catch (error) {
            console.error('Error al conectar a RabbitMQ:', error);
            throw error;
        }
    }

    // Cerrar conexión
    async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
            console.log('Conexión a RabbitMQ cerrada.');
        } catch (error) {
            console.error('Error al cerrar conexión a RabbitMQ:', error);
        }
    }
}

export default RabbitMQConnection;
