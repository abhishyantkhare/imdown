from dotenv import load_dotenv
import os

load_dotenv()


class Config(object):
    DATABASE_URL = os.getenv("DATABASE_URL")
