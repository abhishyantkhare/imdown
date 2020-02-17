from init import db
from flask import jsonify
import time


class Squad(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=False, unique=False)
    invite_link = db.Column(db.String(64), index=False, unique=True)

    def squadDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'invite_link': self.invite_link
        }

    def __repr__(self):
        return 'Squad {}'.format(self.name)

    def generate_invite_link(self):
        invite_link = "invite_link_{}".format(time.time())
        self.invite_link = invite_link

    def jsonifySquad(self):
        return jsonify(id=self.id, squad_name=self.name, invite_link=self.invite_link, squad_id=self.id)
