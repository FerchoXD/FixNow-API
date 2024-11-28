import os
import json
import pika
from dotenv import load_dotenv
from src.services.rabbitmq.rabbit_connection import RabbitMQConnection

load_dotenv()

class Producer:
    def __init__(self, queue_name):
        self.queue_name = os.environ.get("RABBITMQ_QUEUE", queue_name)
        self.rabbit = RabbitMQConnection.get_instance()
        self.correlation_id = None  # ID único para correlación de mensajes
        self.response = None  # Almacena la respuesta del consumidor

    def send_message_with_reply(self, user_uuid, polaridad):
        """Enviar un mensaje y esperar una respuesta en una cola temporal."""
        try:
            channel = self.rabbit.connect()

            # Crear una cola temporal exclusiva para recibir la respuesta
            result = channel.queue_declare(queue='', exclusive=True)
            callback_queue = result.method.queue

            # Generar un ID único para correlacionar las respuestas
            self.correlation_id = str(os.urandom(16).hex())

            # Formatear el mensaje
            message = {
                "userUuid": user_uuid,
                "polaridad": polaridad
            }

            # Publicar el mensaje con el atributo reply_to
            channel.basic_publish(
                exchange='',
                routing_key=self.queue_name,
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    reply_to=callback_queue,
                    correlation_id=self.correlation_id,
                    delivery_mode=2  # Persistencia del mensaje
                )
            )
            print(f"Mensaje enviado a la cola '{self.queue_name}': {message}")

            # Escuchar en la cola temporal para recibir la respuesta
            channel.basic_consume(
                queue=callback_queue,
                on_message_callback=self.on_response,
                auto_ack=True
            )

            print("Esperando respuesta...")
            while self.response is None:
                channel.connection.process_data_events()  # Procesar eventos de RabbitMQ

            return self.response
        except Exception as e:
            print(f"Error al enviar el mensaje con respuesta: {e}")
        finally:
            self.rabbit.close()

    def on_response(self, ch, method, props, body):
        """Callback para manejar las respuestas en la cola temporal."""
        if props.correlation_id == self.correlation_id:
            self.response = json.loads(body)
