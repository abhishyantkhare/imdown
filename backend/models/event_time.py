from init import db



class EventTime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer,  index=False, unique=False)
    start_time = db.Column(db.BigInteger, index=False, unique=False)
    end_time = db.Column(db.BigInteger, index=False, unique=False)

    
