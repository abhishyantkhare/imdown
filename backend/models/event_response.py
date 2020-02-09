from app import db

class EventResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer,  index=True, unique=True)
    user_id = db.Column(db.Integer,  index=True, unique=True)
    response = db.Column(db.Boolean,  index=False, unique=True)

    def __repr__(self):
      return 'EventResponse event_id: {} user_id:{} response: {}'.format(self.event_id, self.user_id, self.response)