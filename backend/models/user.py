from app import db
from flask import jsonify


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    auth_hash = db.Column(db.String(128), index=True, unique=True)

    def __repr__(self):
        return 'User {}'.format(self.username)

    def jsonifyUser(self):
        return jsonify(username=self.username, auth_hash=self.auth_hash)

