import os
import json
from flask import Flask
from flask_login import LoginManager
import boto3
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from imdown_backend.config import Config
from imdown_backend.models.user import User
from imdown_backend.extensions import db, migrate


login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


def download_secret(secret_file):
    """Download secrets from AWS Secrets Manager into self-titled files."""
    secrets_manager = boto3.client("secretsmanager")
    secret_value = secrets_manager.get_secret_value(SecretId=secret_file)
    with open(secret_file, "w") as fp:
        fp.write(secret_value['SecretString'])


application = Flask(__name__)
application.config.from_object(Config)


# Update secrets on disk.
download_secret(Config.FLASK_SECRET_FILE)
download_secret(Config.GOOGLE_SECRET_FILE)
download_secret(Config.FIREBASE_SECRET_FILE)

with open(Config.FLASK_SECRET_FILE, "r") as fp:
    application.secret_key = json.load(fp)['secret_key']


login_manager.init_app(application)
db.init_app(application)
migrate.init_app(application, db)

# Scheduler

scheduler = BackgroundScheduler(jobstores={
        'default': SQLAlchemyJobStore(url=Config.SQLALCHEMY_DATABASE_URI)
        })
scheduler.start()

import imdown_backend.app