from init import db
from flask import jsonify


class SquadMembership(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    squad_id = db.Column(db.Integer, index=True, unique=False)
    user_id = db.Column(db.Integer, index=True, unique=False)

    def __repr__(self):
        return 'SquadMembership for user {} and squad {}'.format(self.user_id, self.squad_id)

    def jsonifySquadMembership(self):
        return jsonify(id=self.id, squad_id=self.squad_id, user_id=self.user_id)
