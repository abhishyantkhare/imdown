from app import db
from flask import jsonify

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=False, unique=False)
    invite_link = db.Column(db.String(64), index=False, unique=True)

    def __repr__(self):
      return 'Group {}'.format(self.name)

    def generate_invite_link(self):
      invite_link = "invite_link"
      self.invite_link = invite_link

    def jsonifyGroup(self):
      return jsonify(group_name=self.name, invite_link=self.invite_link)