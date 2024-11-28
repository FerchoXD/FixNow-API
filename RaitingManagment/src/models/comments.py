import uuid as uuid_lib
from flask_mongoengine import MongoEngine
from datetime import datetime

db = MongoEngine()

class Comment(db.Document):
    uuid = db.UUIDField(default=uuid_lib.uuid4, required=True, unique=True)
    userUuid = db.StringField(required=True)
    fullname = db.StringField()
    content = db.StringField(required=True)
    polarity = db.FloatField()
    timestamp = db.DateTimeField(default=datetime.utcnow)  # Fecha y hora del comentario
    status = db.StringField(default="active", choices=["active", "deleted"])  # Estado
    isRelevant = db.BooleanField(default=True)  # Indica relevancia
    category = db.StringField(choices=["relevante", "irrelevante", "grosero"]) 