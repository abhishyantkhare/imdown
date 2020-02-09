from dotenv import load_dotenv
import os

load_dotenv()


class Config(object):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    script_location = "migrations/alembic.ini"
