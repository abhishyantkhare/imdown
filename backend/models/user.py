from extensions import db
from flask import jsonify
from flask_login import UserMixin


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), index=True,
                      unique=True, nullable=False)
    name = db.Column(db.String(64), index=False, unique=False, nullable=False)
    photo = db.Column(db.String(256), index=False,
                      unique=False, nullable=False)
    google_access_token = db.Column(db.String(255))
    google_refresh_token = db.Column(db.String(255))

    def userDict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'photo': self.photo
        }

    def __repr__(self):
        return 'User {}'.format(self.email)

    def jsonifyUser(self):
        return jsonify(email=self.email, name=self.name, photo=self.photo)
