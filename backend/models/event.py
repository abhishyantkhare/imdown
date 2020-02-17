from init import db
from flask import jsonify
import json


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), index=False, unique=False)
    description = db.Column(db.String(64), index=False, unique=False)
    start_time = db.Column(db.Integer, index=False, unique=False)
    end_time = db.Column(db.Integer, index=False, unique=False)
    address = db.Column(db.String(256), index=False, unique=False)
    lat = db.Column(db.Float, index=True, unique=False)
    lng = db.Column(db.Float, index=True, unique=False)
    squad_id = db.Column(db.Integer, index=True, unique=False)

    def __repr__(self):
        return 'Event id {} with title {} and squad {}'.format(self.id, self.title, self.squad_id)

    def eventDict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'address': self.address,
            'lat': self.lat,
            'lng': self.lng,
        }

    def jsonifyEvent(self):
        return jsonify(id=self.id, title=self.title, description=self.description, start_time=self.start_time, end_time=self.end_time, address=self.address, lat=self.lat, lng=self.lng)
