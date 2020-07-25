from flask import Flask
from config import Config
from flask_login import LoginManager
from models.user import User
from extensions import db, migrate
import os


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
