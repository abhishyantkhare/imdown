from extensions import db
from flask import jsonify
from flask_login import UserMixin
import requests


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), index=True,
                      unique=True, nullable=False)
    name = db.Column(db.String(64), index=False, unique=False, nullable=False)
    photo = db.Column(db.String(256), index=False,
                      unique=False, nullable=False)
    google_access_token = db.Column(db.String(255))
    google_refresh_token = db.Column(db.String(255))
    device_token = db.Column(db.String(256))

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

    def getToken(self, secrets, oauth_url):
        # always refresh the token for now. Eventually we only need to refresh when the token actually expires
        refresh_body = {
            'client_id': secrets["GOOGLE_CLIENT_ID"],
            'client_secret': secrets["GOOGLE_CLIENT_SECRET"],
            'refresh_token': self.google_refresh_token,
            'grant_type': 'refresh_token'
        }
        r = requests.post(oauth_url, data=refresh_body)
        resp = r.json()
        return resp['access_token']


def get_user_by_id(id):
    return User.query.filter_by(id=id).first()
