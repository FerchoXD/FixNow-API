from flask import Flask
from src.routes.raiting_routes import raiting_bp
from src.database.configdb import Config
from src.models.comments import db

from flask_mongoengine import MongoEngine

db = MongoEngine()


app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
app.register_blueprint(raiting_bp)

if __name__ == '__main__':
    app.run(debug=True)

from app import controllers
