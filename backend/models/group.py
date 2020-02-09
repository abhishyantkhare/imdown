from app import db


class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=False)
    invite_link = db.Column(db.String(64), index=True, unique=False)

  def __repr__(self):
    return 'Group {}'.format(self.name)
