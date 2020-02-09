from app import db


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), index=False, unique=False)
    description = db.Column(db.String(64), index=False, unique=False)
    start_time = db.Column(db.DateTime, index=False, unique=False)
    end_time = db.Column(db.DateTime, index=False, unique=False)
    address = db.Column(db.String(256), index=False, unique=False)
    lat = db.Column(db.Float, index=True, unique=False)
    lng = db.Column(db.Float, index=True, unique=False)
    group_id = db.Column(db.Integer, index=True, unique=False)


    def __repr__(self):
      return 'Event id {} with title {} and group {}'.format(self.id, self.title, self.group_id)
