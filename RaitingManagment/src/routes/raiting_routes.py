from flask import Blueprint, request
from src.controllers.raiting_controller import create_comment, obtener_comentarios_por_id

raiting_bp = Blueprint('raiting', __name__)

# Ruta POST para crear un comentario
@raiting_bp.route('/create/comment', methods=['POST'])
def create_comment_route():
    return create_comment()

# Ruta POST para obtener comentarios por userUuid
@raiting_bp.route('/comments', methods=['POST'])
def get_comments():
    data = request.get_json()
    userUuid = data.get('userUuid')
    return obtener_comentarios_por_id(userUuid)
