from flask import Blueprint
from src.controllers.raiting_controller import create_comment, obtener_comentarios_por_id

raiting_bp = Blueprint('raiting', __name__)

# Ruta POST para crear un comentario
@raiting_bp.route('/create/commet', methods=['POST'])
def create_comment_route():
    return create_comment()

@raiting_bp.route('/comments/<userUuid>', methods=['GET'])
def get_comments(userUuid):
    return obtener_comentarios_por_id(userUuid)