import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    FLASK_ENV = os.getenv("FLASK_ENV")
    # Flask uses this key to sign user sessions.
    FLASK_SECRET_FILE = "flask_secret.json"
    # Google OAuth client information.
    GOOGLE_SECRET_FILE = "google_client_secret.json"
    # Firebase service account key.
    FIREBASE_SECRET_FILE = "firebase_secret.json"
