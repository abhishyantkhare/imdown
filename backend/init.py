from flask import Flask
from config import Config
from flask_login import LoginManager
from models.user import User
from extensions import db, migrate
import os
import json
import boto3


login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


application = Flask(__name__)
application.secret_key = os.urandom(16)
application.config.from_object(Config)

login_manager.init_app(application)
db.init_app(application)
migrate.init_app(application, db)


def read_secrets():
    secrets = dict()
    secrets_manager = boto3.client('secretsmanager')
    google_secrets_json = secrets_manager.get_secret_value(
        SecretId='google_client')['SecretString']

    google_secrets = json.loads(google_secrets_json)
    secrets["GOOGLE_CLIENT_ID"] = google_secrets["web"]["client_id"]
    secrets["GOOGLE_CLIENT_SECRET"] = google_secrets["web"]["client_secret"]
    return secrets


SECRETS = read_secrets()
