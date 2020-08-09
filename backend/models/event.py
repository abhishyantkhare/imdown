from init import db
from flask import jsonify
import json
from datetime import datetime


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), index=False, unique=False)
    description = db.Column(db.String(256), index=False, unique=False)
    event_emoji = db.Column(db.String(64), index=False, unique=False)
    event_url = db.Column(db.String(256), index=False, unique=False)
    image_url = db.Column(db.String(256), index=False, unique=False)
    start_time = db.Column(db.BigInteger, index=False, unique=False)
    end_time = db.Column(db.BigInteger, index=False, unique=False)
    address = db.Column(db.String(256), index=False, unique=False)
    lat = db.Column(db.Float, index=True, unique=False)
    lng = db.Column(db.Float, index=True, unique=False)
    squad_id = db.Column(db.Integer, index=True, unique=False)
    down_threshold = db.Column(db.Integer, index=False, unique=False)

    def __repr__(self):
        return 'Event id {} with title {} and squad {}'.format(self.id, self.title, self.squad_id)

    def eventDict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'event_emoji': self.event_emoji,
            'event_url': self.event_url,
            'image_url': self.image_url,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'address': self.address,
            'lat': self.lat,
            'lng': self.lng,
            'squad_id': self.squad_id,
            'down_threshold': self.down_threshold
        }

    def jsonifyEvent(self):
        return jsonify(id=self.id, title=self.title, description=self.description, start_time=self.start_time, end_time=self.end_time, address=self.address, lat=self.lat, lng=self.lng)

    def getGoogleCalendarEventBody(self):
        return {
            'start': {
                # Keep everything in UTC timezone on the backend for simplicity
                # The event will appear correctly on the calendar since Google will handle
                # timezone conversions from UTC to the user timezone for us
                'dateTime': datetime.utcfromtimestamp(self.start_time / 1000).isoformat(),
                'timeZone': 'UTC'
            },
            'end': {
                'dateTime': datetime.utcfromtimestamp(self.end_time / 1000).isoformat(),
                'timeZone': 'UTC'
            },
            'description': self.description,
            'summary': self.title,
            'status': 'confirmed',
        }

def GetEventById(id):
    return Event.query.filter_by(id=id).first()
