from models.user import User
from models.squadmembership import SquadMembership
import firebase_admin
from firebase_admin import messaging
import os
from errors import HttpError

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./imdown_firebase_cert.json"
firebase_app = firebase_admin.initialize_app()


def send_notification(device_tokens, title, body=""):
    notification = messaging.Notification(title=title, body=body)
    android_config = messaging.AndroidConfig(priority="high")

    message = messaging.MulticastMessage(
        notification=notification,
        tokens=device_tokens,
        android=android_config,
    )
    response = messaging.send_multicast(message)


def notify_squad_members(squad_id, title, body="", users_to_exclude={}):
    squad_memberships = SquadMembership.query.filter_by(
        squad_id=squad_id).all()
    if not squad_memberships:
        raise HttpError("Could not find squad memberships")
    device_tokens = []
    for sqm in squad_memberships:
        if sqm.user_id not in users_to_exclude:
            device_tokens.append(User.query.get(sqm.user_id).device_token)
    send_notification(device_tokens, title, body=body)
