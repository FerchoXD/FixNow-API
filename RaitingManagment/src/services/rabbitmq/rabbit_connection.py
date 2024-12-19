import pika
import os

class RabbitMQConnection:
    _instance = None  # Singleton instance

    def __init__(self):
        self.connection = None
        self.channel = None
        self.rabbitmq_url = os.getenv("RABBITMQ_URL", "amqp://localhost:5672")
        if not (self.rabbitmq_url.startswith("amqp://") or self.rabbitmq_url.startswith("amqps://")):
            raise ValueError(f"La URL de RabbitMQ debe comenzar con 'amqp://' o 'amqps://'. URL actual: {self.rabbitmq_url}")

    @classmethod
    def get_instance(cls):
        """Singleton para asegurar una única conexión."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def connect(self):
        """Establecer conexión con RabbitMQ."""
        try:
            if not self.connection:
                self.connection = pika.BlockingConnection(pika.URLParameters(self.rabbitmq_url))
                print("Conexión a RabbitMQ establecida.")

            if not self.channel:
                self.channel = self.connection.channel()
                print("Canal de RabbitMQ creado.")

            return self.channel
        except Exception as e:
            print(f"Error al conectar a RabbitMQ: {e}")
            raise

    def close(self):
        """Cerrar conexión y canal de RabbitMQ."""
        try:
            if self.channel:
                self.channel.close()
                self.channel = None
            if self.connection:
                self.connection.close()
                self.connection = None
            print("Conexión a RabbitMQ cerrada.")
        except Exception as e:
            print(f"Error al cerrar la conexión a RabbitMQ: {e}")

# Ejemplo de uso
if __name__ == "__main__":
    try:
        rabbit_instance = RabbitMQConnection.get_instance()
        channel = rabbit_instance.connect()
        
        # Ejemplo de declaración de cola
        channel.queue_declare(queue="example_queue", durable=True)
        print("Cola 'example_queue' declarada con éxito.")
        
        # Cerrar conexión
        rabbit_instance.close()
    except Exception as e:
        print(f"Error general: {e}")
