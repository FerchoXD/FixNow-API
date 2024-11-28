from dotenv import load_dotenv
import os
load_dotenv()
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'clave_secreta'
    MONGODB_SETTINGS = {
        'host': f"mongodb+srv://{os.environ.get('MONGO_USER', 'user')}:{os.environ.get('MONGO_PASSWORD', 'password')}@{os.environ.get('MONGO_CLUSTER', 'cluster0.7zv8v')}.faonfdg.mongodb.net/{os.environ.get('MONGO_DATABASE', 'ratingdb')}?retryWrites=true&w=majority&appName={os.environ.get('MONGO_CLUSTER', 'cluster0.7zv8v')}"
    }
