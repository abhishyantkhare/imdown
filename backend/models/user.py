from extensions import db
from flask import jsonify
from flask_login import UserMixin


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), index=True,
                      unique=True, nullable=False)
    photo = db.Column(db.String(256), index=False,
                      unique=False, nullable=False)
    name = db.Column(db.String(64), index=False,
                      unique=False, nullable=False)

    def userDict(self):
        return {
            'id': self.id,
            'email': self.email,
            'photo': self.photo,
            'name': self.name
        }

    def __repr__(self):
        return 'User {}'.format(self.email)

    def jsonifyUser(self):
        return jsonify(email=self.email, photo=self.photo, name=self.name)
