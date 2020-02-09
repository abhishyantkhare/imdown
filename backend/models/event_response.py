from app import db

class EventResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, primary_key=True)
    response = db.Column(db.Boolean, primary_key=True)

    def __repr__(self):
      return 'EventResponse event_id: {} user_id:{} response: {}'.format(event_id, user_id, response)