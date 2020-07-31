from extensions import db
from flask import jsonify
from flask_login import UserMixin


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), index=True,
                      unique=True, nullable=False)
    photo = db.Column(db.String(256), index=True,
                      unique=True, nullable=False)
    name = db.Column(db.String(64), index=True,
                      unique=True, nullable=False)

    def __repr__(self):
        return 'User {}'.format(self.email)

    def jsonifyUser(self):
        return jsonify(email=self.email, photo=self.photo, name=self.name)
