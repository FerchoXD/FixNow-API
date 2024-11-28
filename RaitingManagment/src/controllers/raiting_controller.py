from flask import request, jsonify
from src.models.comments import Comment
from src.services.AI.raiting import enviar_mensaje
from src.services.rabbitmq.Raiting_producer import Producer
import json

def calcular_rating(user_uuid, polaridad_actual=None):
    try:
        # Obtener todos los comentarios activos, relevantes y con categoría 'relevante' para el usuario
        comentarios = Comment.objects(
            userUuid=user_uuid,
            status="active",
            isRelevant=True,
            category="relevante"
        )

        # Verificar si hay comentarios válidos
        if not comentarios and polaridad_actual is None:
            return {"rating": 0, "total_comentarios": 0, "mensaje": "No hay comentarios válidos para calcular el rating."}

        # Calcular la suma de polaridades existentes
        suma_polaridad = sum(comentario.polarity for comentario in comentarios)

        # Añadir la polaridad del comentario actual si se proporciona
        if polaridad_actual is not None:
            suma_polaridad += polaridad_actual

        # Calcular el total de comentarios válidos
        total_comentarios = len(comentarios) + (1 if polaridad_actual is not None else 0)

        rating = round(suma_polaridad / total_comentarios, 2)

        return rating
    except Exception as e:
        return {"error": str(e), "mensaje": "Error al calcular el rating."}


def crear_comentario(polaridad, userUuid, contenido,fullname):
    try:

        if polaridad == 0:
            status = 'active'
            is_relevant = False
            category = 'irrelevante'
        elif polaridad == -1:
            status = 'deleted'
            is_relevant = False
            category = 'grosero'
        elif 1 <= polaridad <= 5:
            status = 'active'
            is_relevant = True
            category = 'relevante'
        else:
            return jsonify({"error": "La polaridad debe ser 0, -1 o entre 1 y 5"}), 400

        # Crear un nuevo comentario
        nuevo_comentario = Comment(
            userUuid=userUuid,
            fullname=fullname,
            content=contenido,
            polarity=polaridad,
            status=status,
            isRelevant=is_relevant,
            category=category,
        )

        nuevo_comentario.save()

        return jsonify({"message": "Comentario creado correctamente", "comentario": nuevo_comentario.to_json()}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def create_comment():
    try:
        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()

        if not data or 'userUuid' not in data or not data['userUuid']:
            return jsonify({"error": "El identificador del usuario es requerido"}), 400

        # Validar que el contenido exista
        if not data or 'content' not in data or not data['content']:
            return jsonify({"error": "El contenido del comentario es requerido"}), 400

        print("Esto es data:", json.dumps(data['content'], indent=4))

        polaridad = enviar_mensaje(data['content'])

        print("Esto es la polaridad:", polaridad)
        
        relevance = calcular_rating(data['userUuid'], polaridad)
        
        producer = Producer(queue_name=None)  # La cola se obtiene automáticamente desde el entorno
        data_rabbit = producer.send_message_with_reply(data['userUuid'], relevance)
        print("Esto es data_rabbit:", data_rabbit)

        if isinstance(data_rabbit, dict):
            user_data = data_rabbit.get("userData")
            if user_data and isinstance(user_data, dict):
                fullname = user_data.get("fullname")
                crear_comentario(polaridad, data['userUuid'], data['content'], fullname)
        
        return jsonify({"message": "Comentario procesado correctamente", "resultado": data}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
