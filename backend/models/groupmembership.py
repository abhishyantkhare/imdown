from app import db


class GroupMembership(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, index=True, unique=False)
    user_id = db.Column(db.Integer, index=True, unique=False)

    def __repr__(self):
      return 'GroupMembership for user {} and group {}'.format(self.user_id, self.group_id)
