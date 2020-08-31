from init import db
from flask import jsonify
from models.user import User


class SquadMembership(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    squad_id = db.Column(db.Integer, index=True, unique=False)
    user_id = db.Column(db.Integer, index=True, unique=False)

    def __repr__(self):
        return 'SquadMembership for user {} and squad {}'.format(self.user_id, self.squad_id)

    def jsonifySquadMembership(self):
        return jsonify(id=self.id, squad_id=self.squad_id, user_id=self.user_id)


def GetUsersBySquadId(squad_id):
    user_squad_memberships = SquadMembership.query.filter_by(
        squad_id=squad_id).all()
    users_lst = []
    for user_squad_membership in user_squad_memberships:
        user_id = user_squad_membership.user_id
        user = User.query.get(user_id)
        users_lst.append(user)
    return [user.userDict() for user in users_lst]
