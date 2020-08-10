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


def gen_secret_key(application, secrets_manager):
    if "FLASK_ENV" in application.config and application.config["FLASK_ENV"] == "development":
        return os.urandom(16)
    key_json = secrets_manager.get_secret_value(
        SecretId="flask_secret_key")["SecretString"]
    key = json.loads(key_json)["flask_secret_key"]
    return key


application = Flask(__name__)
application.config.from_object(Config)
secrets_manager = boto3.client('secretsmanager')

application.secret_key = gen_secret_key(application, secrets_manager)


login_manager.init_app(application)
db.init_app(application)
migrate.init_app(application, db)


def read_secrets():
    secrets = dict()
    google_secrets_json = secrets_manager.get_secret_value(
        SecretId='google_client')['SecretString']

    google_secrets = json.loads(google_secrets_json)
    secrets["GOOGLE_CLIENT_ID"] = google_secrets["web"]["client_id"]
    secrets["GOOGLE_CLIENT_SECRET"] = google_secrets["web"]["client_secret"]
    return secrets


SECRETS = read_secrets()
