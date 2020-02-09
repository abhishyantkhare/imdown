from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models.user import User
from models.event_response import EventResponse
from models.event import Event
from models.group import Group
from models.groupmembership import GroupMembership

@app.route("/")
def hello():
    return "Hello, World!"
