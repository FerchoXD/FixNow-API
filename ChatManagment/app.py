from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from datetime import datetime, UTC
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


# Leer variables del entorno
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_CLUSTER = os.getenv('MONGO_CLUSTER')
MONGO_DATABASE = os.getenv('MONGO_DATABASE')

# Configurar la conexión a MongoDB
MONGO_URI = f"mongodb+srv://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_CLUSTER}.faonfdg.mongodb.net/{MONGO_DATABASE}?retryWrites=true&w=majority&appName={MONGO_CLUSTER}"

client = MongoClient(MONGO_URI)
db = client[MONGO_DATABASE]
messages_collection = db['messages']

@app.route('/')
def index():
    return "Chat Application"

@app.route('/messages', methods=['GET'])
def get_messages():
    user_uuid = request.args.get('user_uuid')
    supplier_uuid = request.args.get('supplier_uuid')
    if not user_uuid or not supplier_uuid:
        return jsonify({'error': 'Se requieren los parámetros user_uuid y supplier_uuid'}), 400

    room = f"{min(user_uuid, supplier_uuid)}_{max(user_uuid, supplier_uuid)}"
    messages = list(messages_collection.find({'room': room}, {'_id': 0}))
    return jsonify(messages), 200

@socketio.on('connect')
def handle_connect():
    print('Usuario conectado')

@socketio.on('disconnect')
def handle_disconnect():
    print('Usuario desconectado')

@socketio.on('join')
def handle_join(data):
    user_uuid = data.get('user_uuid')
    supplier_uuid = data.get('supplier_uuid')
    if user_uuid and supplier_uuid:
        room = f"{min(user_uuid, supplier_uuid)}_{max(user_uuid, supplier_uuid)}"
        join_room(room)
        emit('message', {'info': f"Usuario {user_uuid} se ha unido a la sala {room}"}, room=room)
    else:
        emit('error', {'error': 'Datos incompletos: se requieren "user_uuid" y "supplier_uuid".'})

@socketio.on('leave')
def handle_leave(data):
    user_uuid = data.get('user_uuid')
    supplier_uuid = data.get('supplier_uuid')
    if user_uuid and supplier_uuid:
        room = f"{min(user_uuid, supplier_uuid)}_{max(user_uuid, supplier_uuid)}"
        leave_room(room)
        emit('message', {'info': f"Usuario {user_uuid} ha dejado la sala {room}"}, room=room)
    else:
        emit('error', {'error': 'Datos incompletos: se requieren "user_uuid" y "supplier_uuid".'})

@socketio.on('send_message')
def handle_send_message(data):
    user_uuid = data.get('user_uuid')
    supplier_uuid = data.get('supplier_uuid')
    sender_uuid = data.get('sender_uuid')
    message = data.get('message')
    if user_uuid and supplier_uuid and message:
        room = f"{min(user_uuid, supplier_uuid)}_{max(user_uuid, supplier_uuid)}"
        message_data = {
            'room': room,
            'sender_uuid': sender_uuid,
            'message': message,
            'timestamp': datetime.now(UTC)
        }
        messages_collection.insert_one(message_data)
        emit('message', {'sender_uuid': user_uuid, 'message': message, 'timestamp': message_data['timestamp'].isoformat()}, room=room)
    else:
        emit('error', {'error': 'Datos incompletos: se requieren "user_uuid", "supplier_uuid" y "message".'})

if __name__ == '__main__':
    socketio.run(app, debug=True)