from init import db
from flask import jsonify


class EventResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer,  index=True, unique=False)
    user_id = db.Column(db.Integer,  index=True, unique=False)
    response = db.Column(db.Boolean,  index=False, unique=False)
    response_time = db.Column(db.BigInteger, index=False, unique=False)

    def __repr__(self):
        return 'EventResponse event_id: {} user_id:{} response: {} response_time: {}'.format(self.event_id, self.user_id, self.response, self.response_time)

    def eventResponseDict(self):
        return {
            'user_id': self.user_id,
            'response': self.response,
            'event_id': self.event_id,
            'response_time': self.response_time
        }

    def jsonify_eventResponse(self):
        return jsonify(id=self.id, event_id=self.event_id, user_id=self.user_id, response=self.response, response_time=self.response_time)
