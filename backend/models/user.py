from app import db


class User(db.Model):
    # id is the hash sent by Apple sign in
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    auth_hash = db.Column(db.String(128), index=True, unique=True)

  def __repr__(self):
    return 'User {}'.format(self.username)
