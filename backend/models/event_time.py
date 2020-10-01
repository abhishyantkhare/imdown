from init import db
from errors import NotFound 


class EventTime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, index=False, unique=False)
    start_time = db.Column(db.BigInteger, index=False, unique=False)
    end_time = db.Column(db.BigInteger, index=False, unique=False)

    
    def get_event_time_id_for_time(event_id):
        event_time = EventTime.query.filter_by(event_id=event_id).first()
        if event_time is None:
            raise NotFound(f"event {event_id} does not exist!")
        return event_time.id