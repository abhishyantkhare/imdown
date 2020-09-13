from init import db, application
from flask import jsonify
import json
from datetime import datetime
import shortuuid
from models.event_response import EventResponse
from notifications import notify_squad_members

EVENT_UUID_ALPHABET = 'abcdefghijklmnopqrstuv0123456789'


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), index=False, unique=False)
    description = db.Column(db.String(512), index=False, unique=False)
    event_emoji = db.Column(db.String(64), index=False, unique=False)
    event_url = db.Column(db.String(1024), index=False, unique=False)
    image_url = db.Column(db.Text(), index=False, unique=False)
    start_time = db.Column(db.BigInteger, index=False, unique=False)
    end_time = db.Column(db.BigInteger, index=False, unique=False)
    address = db.Column(db.String(256), index=False, unique=False)
    lat = db.Column(db.Float, index=True, unique=False)
    lng = db.Column(db.Float, index=True, unique=False)
    squad_id = db.Column(db.Integer, index=True, unique=False)
    down_threshold = db.Column(db.Integer, index=False, unique=False)
    calendar_event_uuid = db.Column(db.String(256), index=False, unique=True)
    creator_user_id = db.Column(db.Integer, index=False, unique=False)

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
            'down_threshold': self.down_threshold,
            'creator_user_id': self.creator_user_id
        }

    def eventLiteDict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'event_emoji': self.event_emoji,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'down_threshold': self.down_threshold
        }

    def jsonify_event(self):
        return jsonify(id=self.id, title=self.title, description=self.description, start_time=self.start_time, end_time=self.end_time, address=self.address, lat=self.lat, lng=self.lng)

    def get_google_calendar_event_body(self):
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
            'id': self.get_event_UUID(),
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {
                        'method': 'popup',
                        'minutes': 60  # reminder for an hour before
                    },
                    {
                        'method': 'popup',
                        'minutes': 1440  # reminder for a day before
                    }
                ]
            }
        }

    def get_event_UUID(self):
        shortuuid.set_alphabet(EVENT_UUID_ALPHABET)
        if not self.calendar_event_uuid:
            self.calendar_event_uuid = shortuuid.uuid()
            db.session.commit()
        return self.calendar_event_uuid

    def get_responses_for_event(self):
        return EventResponse.query.filter_by(
        event_id=self.id).all()
        

    def schedule_reminder(self, scheduler):
        if not self.start_time:
            return
        job_id = f'reminder_event_{self.id}_squad_{self.squad_id}'
        job_ms = self.start_time - 24*60*60*1000 # Set to 24 hours before start time
        job_date = datetime.utcfromtimestamp(job_ms / 1000)

        scheduler.add_job(
            send_respond_reminder, 
            args=[self.id, self.squad_id, self.title],
            trigger='date', 
            run_date=job_date, 
            timezone="UTC",
            id=job_id,
            replace_existing=True
            )

def send_respond_reminder(event_id, squad_id, event_title):
    with application.app_context():
        responses = EventResponse.query.filter_by(
        event_id=event_id).all()
        accepted_users = set([r.user_id for r in responses if r.response])
        notify_squad_members(
            squad_id, 
            f"Reminder: RSVP For {event_title}", 
            body="Starts in 24 hours!",
            users_to_exclude=accepted_users
        )