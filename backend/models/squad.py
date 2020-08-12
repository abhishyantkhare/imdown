from init import db
from flask import jsonify
import time
import shortuuid



class Squad(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=False, unique=False)
    squad_emoji = db.Column(db.String(64), index=False, unique=False)
    invite_link = db.Column(db.String(64), index=False, unique=True)
    code = db.Column(db.String(64), index=False, unique=True)
    admin_id = db.Column(db.Integer, index=False, unique=False)

    def squadDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'squad_emoji': self.squad_emoji,
            'invite_link': self.invite_link,
            'code': self.code,
            'admin_id': self.admin_id
        }

    def __repr__(self):
        return 'Squad {}'.format(self.name)

    def generate_code(self):
        code = shortuuid.uuid()[:7]
        squad = Squad.query.filter_by(code=code).first()
        while squad is not None:
            code = shortuuid.uuid()[:7]
            squad = Squad.query.filter_by(code=code).first()
        self.code = code

    def jsonifySquad(self):
        return jsonify(id=self.id, squad_name=self.name, squad_emoji=self.squad_emoji, invite_link=self.invite_link, squad_id=self.id, admin_id=self.admin_id)

def get_squad_by_id(id):
    return Squad.query.filter_by(id=id).first()
