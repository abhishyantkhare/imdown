from flask import request
from flask import jsonify
from init import application, SECRETS
from extensions import db
from models.user import User, GetUserById
from errors import HttpError, BadRequest, Unauthorized, Forbidden, NotFound
from models.event_response import EventResponse
from models.event import Event, get_event_by_id
from models.squad import Squad, get_squad_by_id
from models.squadmembership import SquadMembership, GetUsersBySquadId
from flask_login import login_user, login_required, logout_user, current_user
from collections import defaultdict
from sqlalchemy.orm import load_only
import requests
import json
import time
import firebase_admin
from firebase_admin import messaging


GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
firebase_app = firebase_admin.initialize_app()


def validate_request_args(content: dict, *required_args):
    """Verify that all required arguments are present in the request."""
    missing_args = set(content.keys()).symmetric_difference(set(required_args))
    if missing_args:
        raise BadRequest(f"Missing args: {', '.join(missing_args)}")


@application.route("/")
def hello():
    return "Hello, World!"


@application.route("/sign_in", methods=['POST'])
def signIn():
    content = request.get_json()
    validate_request_args(content, 'email', 'name', 'photo', 'googleServerCode', 'deviceToken')
    email = content["email"]
    photo = content["photo"]
    name = content["name"]
    device_token = content["deviceToken"]
    auth_code = content["googleServerCode"]
    u = User.query.filter_by(email=email).first()
    if u is None:
        u = User(email=email, name=name, photo=photo)
        db.session.add(u)
    elif u.name != name or u.photo != photo:
        u.name = name
        u.photo = photo
    db.session.commit()
    login_user(u)
    update_user_tokens(u, auth_code, device_token)
    return u.jsonifyUser()


def update_user_tokens(user, auth_code, device_token):
    access_token, refresh_token = fetch_google_access_tokens(auth_code)
    if access_token:
        user.google_access_token = access_token
    if refresh_token:
        user.google_refresh_token = refresh_token
    if device_token:
        user.device_token = device_token
    db.session.commit()


def fetch_google_access_tokens(auth_code):
    data = {'code': auth_code,
            'client_id': SECRETS["GOOGLE_CLIENT_ID"],
            'client_secret': SECRETS["GOOGLE_CLIENT_SECRET"],
            'grant_type': 'authorization_code',
            'access_type': 'offline'
            }
    r = requests.post('https://oauth2.googleapis.com/token', data=data)
    resp = r.json()
    refresh_token = ""
    if 'refresh_token' in resp:
        refresh_token = resp['refresh_token']
    access_token = ""
    if 'access_token' in resp:
        access_token = resp['access_token']
    return access_token, refresh_token


@application.route("/sign_out", methods=['POST'])
@login_required
def signout():
    logout_user()
    return "Successfully signed out user!"


@application.route("/is_signed_in", methods=["GET"])
@login_required
def is_logged_in():
    args = request.args
    validate_request_args(args, "email")
    if current_user.email != args['email']:
        raise Unauthorized("Incorrect email")
    return "Signed in!", 200


@application.route("/add_to_squad", methods=['POST'])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def add_to_squad():
    content = request.get_json()
    validate_request_args(content, 'email', 'squad_code')
    email = content['email']
    squad_code = content['squad_code']
    return addUserToSquad(squad_code, email)


@application.route("/create_squad", methods=["POST"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def createSquad():
    content = request.get_json()
    validate_request_args(content, 'email', 'squad_name', 'squad_emoji')
    email = content["email"]
    user = User.query.filter_by(email=email).first()
    if not user:
        raise NotFound(f"Could not find User {email}")
    squad = Squad(name=content['squad_name'], admin_id=user.id, squad_emoji=content['squad_emoji'])
    squad.generate_code()
    db.session.add(squad)
    db.session.commit()
    addUserToSquad(squad.code, email)
    return squad.jsonifySquad()


@application.route("/edit_squad", methods=["PUT"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def edit_squad():
    content = request.get_json()
    validate_request_args(content, "squad_id", "squad_name", "squad_emoji")
    squad_id = content["squad_id"]
    squad = get_squad_by_id(squad_id)
    if not squad:
        raise NotFound(f"Could not find Squad {squad_id}")
    squad.name = content["squad_name"]
    squad.squad_emoji = content["squad_emoji"]
    db.session.add(squad)
    db.session.commit()
    return squad.jsonifySquad()


@application.route("/respond_to_event", methods=["POST"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def respond_to_event():
    content = request.get_json()
    validate_request_args(content, "email", "event_id", "response")
    email = content["email"]
    event_id = content["event_id"]
    response = content["response"]
    user = User.query.filter_by(email=email).first()
    if not user:
        raise NotFound(f"Could not find User {email}")
    return respondToEvent(user.id, event_id, response)


def respondToEvent(user_id, event_id, response):
    existing_entry_exists = False
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise NotFound(f"Could not find User {user_id}")
    event = get_event_by_id(event_id)
    if not event:
        raise NotFound(f"Could not find Event {event_id}")
    event_squad_id = event.squad_id
    squad_membership = SquadMembership.query.filter_by(squad_id=event_squad_id, user_id=user_id).first()
    if not squad_membership:
        raise NotFound(f"User {user_id} is not a member of Squad {event_squad_id}")

    # Calculate current unix time in ms
    responded_at_time = int(round(time.time() * 1000))
    user_event_response = EventResponse.query.filter_by(
        event_id=event.id, user_id=user_id).first()

    if user_event_response is not None:
        if user_event_response.response is not response:
            response_msg = "User {} already responded to event {} with response of {}." \
                " Overwriting it with response of {}".format(
                    user_id, event_id, user_event_response.response, response)
            print(response_msg)
            user_event_response.response = response
            user_event_response.response_time = responded_at_time
            existing_entry_exists = True
        elif user_event_response.response is response:
            response_msg = "User {} already responded to event {} with response of {}. User gave same response.".format(
                user_id, event_id, user_event_response.response)
            print(response_msg)
            return response_msg, 200
    if not existing_entry_exists:
        user_event_response = EventResponse(
            user_id=user_id, event_id=event_id, response=response, response_time=responded_at_time)
        db.session.add(user_event_response)
    db.session.commit()
    getEventResponsesAndCheckDownThresh(event)
    if not user_event_response.response:
        removeEventFromCalendarIfExists(event, user_id)
    return user_event_response.jsonify_eventResponse()


def getEventResponsesAndCheckDownThresh(event):
    if not event.start_time or not event.end_time:
        return
    event_responses = EventResponse.query.filter_by(
        event_id=event.id).all()
    num_accepted = 0
    num_declined = 0
    down_threshold = event.down_threshold
    accepted_responses = []
    for resp in event_responses:
        if resp.response:
            num_accepted += 1
            accepted_responses.append(resp)
        else:
            num_declined += 1
    if num_accepted >= event.down_threshold:
        print("Enough people are down to create an event on calender!")
        addEventToCalendars(accepted_responses)


def removeEventFromCalendarIfExists(event, user_id):
    if not event.start_time or not event.end_time:
        return
    user = GetUserById(user_id)
    access_token = user.getToken(SECRETS, GOOGLE_TOKEN_URL)
    headers = {'Authorization': 'Bearer {}'.format(
        access_token)}
    event_url = '{}/{}'.format(GOOGLE_CALENDAR_API, event.get_event_UUID())
    requests.delete(event_url, headers=headers)


def addEventToCalendars(accepted_responses):
    event = get_event_by_id(accepted_responses[0].event_id)
    gcal_event = event.get_google_calendar_event_body()
    users = [GetUserById(resp.user_id) for resp in accepted_responses]
    attendees = [{'email': user.email} for user in users]
    gcal_event['attendees'] = attendees
    for user in users:
        req_type = 'POST'
        if eventExistsOnCalendar(event, user):
            req_type = 'PUT'
        sendGoogleCalendarRequest(gcal_event, user, req_type)


def sendGoogleCalendarRequest(gcal_event, user, req_type):
    access_token = user.getToken(SECRETS, GOOGLE_TOKEN_URL)
    headers = {'Authorization': 'Bearer {}'.format(
        access_token), 'content-type': 'application/json'}
    if req_type == 'POST':
        r = requests.post(GOOGLE_CALENDAR_API, data=json.dumps(
            gcal_event), headers=headers)
    else:
        event_url = "{}/{}".format(GOOGLE_CALENDAR_API, gcal_event['id'])
        r = requests.put(event_url, data=json.dumps(
            gcal_event), headers=headers)


def eventExistsOnCalendar(event, user):
    access_token = user.getToken(SECRETS, GOOGLE_TOKEN_URL)
    headers = {'Authorization': 'Bearer {}'.format(
        access_token)}
    event_url = '{}/{}'.format(GOOGLE_CALENDAR_API, event.get_event_UUID())
    r = requests.get(event_url, headers=headers)
    resp_json = r.json()
    return 'error' not in resp_json


def addUserToSquad(squad_code, email):
    squad_obj = Squad.query.filter_by(code=squad_code).first()
    if not squad_obj:
        print("Failure adding to squad. Squad code is not valid")
        response = {
            "status_code": 400,
            "message": "Invalid Squad Code",
            "description": "Please enter a valid squad code"
        }
        return jsonify(response)
    user_obj = User.query.filter_by(email=email).first()
    if not user_obj:
        print(
            f"Failure adding to squad. User with user email {email} does not exist")
        response = {
            "status_code": 400,
            "message": "Invalid Email",
            "description": "This email is invalid"
        }
        return jsonify(response)
    user_squad_existing_membership = SquadMembership.query.filter_by(
        user_id=user_obj.id, squad_id=squad_obj.id).first()
    if user_squad_existing_membership:
        response = {
            "status_code": 400,
            "message": f"You are already a part of {squad_obj.name}.",
            "description": "Please enter a new squad code."
        }
        return jsonify(response)
    else:
        to_insert = SquadMembership(squad_id=squad_obj.id, user_id=user_obj.id)
        db.session.add(to_insert)
        db.session.commit()
        response = {
            "status_code": 200,
            "message": "Sucessfully added squad."
        }
        return jsonify(response)


@application.route("/create_event", methods=["POST"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def createEvent():
    content = request.get_json()
    validate_request_args(content, 'email', 'title', 'emoji', 'description',
                          'start_time', 'end_time', 'squad_id', 'event_url',
                          'image_url', 'down_threshold')
    user_email = content['email']
    u = User.query.filter_by(email=user_email).first()
    if not u:
        raise NotFound(f"Could not find User {user_email}")
    squad_id = content['squad_id']
    if not get_squad_by_id(squad_id):
        raise NotFound(f"Could not find Squad {squad_id}")
    membership = SquadMembership.query.filter_by(user_id=u.id, squad_id=squad_id).first()
    if membership is None:
        raise NotFound("User is not a member of squad")
    title = content["title"]
    desc = content["description"]
    event_emoji = content["emoji"]
    start_time = content["start_time"]
    end_time = content["end_time"]
    # TODO: When address + lat/lng is implemented in mobile, uncomment
    # address = content["address"]
    lat = 0.0
    lng = 0.0
    if "lat" in content and "lng" in content:
        lat = content["lat"]
        lng = content["lng"]
    squad_id = content["squad_id"]
    event_url = content["event_url"]
    image_url = content["image_url"]
    down_threshold = content["down_threshold"]

    e = Event(title=title, event_emoji=event_emoji, description=desc, start_time=start_time,
              end_time=end_time, squad_id=squad_id, event_url=event_url, image_url=image_url, down_threshold=down_threshold, creator_user_id=u.id)
    db.session.add(e)
    db.session.commit()
    respondToEvent(u.id, e.id, True)
    # set every other user in squad to false
    squadMemberships = SquadMembership.query.filter_by(
        squad_id=squad_id).all()

    for squadMembership in squadMemberships:
        if (squadMembership.user_id != u.id):
            respondToEvent(squadMembership.user_id, e.id, False)
    send_event_notification(squadMemberships, u.id, e.title)
    return e.jsonify_event()


def send_event_notification(squadMemberships, user_id, event_title):
    device_tokens = []
    for sqm in squadMemberships:
        if sqm.user_id != user_id:
            device_tokens.append(GetUserById(sqm.user_id).device_token)
    squad = get_squad_by_id(squadMemberships[0].squad_id)
    title = f"New Event In {squad.name}!"
    body = f"{event_title}"
    notification = messaging.Notification(title=title, body=body)
    android_config = messaging.AndroidConfig(priority="high")

    message = messaging.MulticastMessage(
        notification=notification,
        tokens=device_tokens,
        android=android_config,
    )
    response = messaging.send_multicast(message)


@application.route("/edit_event", methods=["PUT"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def editEvent():
    content = request.get_json()
    validate_request_args(content, 'event_id', 'email', 'title', 'emoji',
                          'description', 'down_threshold', 'start_time',
                          'end_time', 'event_url', 'image_url')
    u = User.query.filter_by(email=content['email']).first()
    if not u:
        raise NotFound(f"Could not find User {content['email']}")
    event_id = content['event_id']
    event = get_event_by_id(event_id)
    if event is None:
        raise NotFound(f"Could not find Event {event_id}")

    event.title = content["title"]
    event.description = content["description"]
    event.down_threshold = content["down_threshold"]
    event.event_emoji = content["emoji"]
    event.event_url = content["event_url"]
    event.image_url = content["image_url"]
    event.start_time = content["start_time"]
    event.end_time = content["end_time"]

    db.session.add(event)
    db.session.commit()
    getEventResponsesAndCheckDownThresh(event)
    return event.jsonify_event()


@application.route("/get_events", methods=["GET"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def getEvents():
    args = request.args
    validate_request_args(args, 'squad_id')
    g_id = args["squad_id"]
    events = Event.query.filter_by(squad_id=g_id).options(load_only(
        'id', 'title', 'description', 'event_emoji', 'start_time', 'end_time', 'down_threshold')).all()
    event_ids = [e.id for e in events]
    event_responses = getEventResponsesBatch(event_ids)
    ret_list = [e.eventLiteDict() for e in events]
    for event in ret_list:
        event["event_responses"] = {}
        event["event_responses"]["accepted"] = event_responses[event["id"]][True]
        event["event_responses"]["declined"] = event_responses[event["id"]][False]
    return jsonify(ret_list)


@application.route("/get_event", methods=["GET"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def getEvent():
    args = request.args
    validate_request_args(args, 'event_id')
    e_id = args["event_id"]
    event = get_event_by_id(e_id)
    if event is None:
        raise NotFound(f"Event {e_id} does not exist")
    event_responses = getEventResponsesBatch([event.id])
    ret = event.eventDict()
    ret["event_responses"] = {}
    ret["event_responses"]["accepted"] = event_responses[ret["id"]][True]
    ret["event_responses"]["declined"] = event_responses[ret["id"]][False]
    return jsonify(ret)


@application.route("/event", methods=["DELETE"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def deleteEvent():
    args = request.args
    validate_request_args(args, 'event_id')
    e_id = args["event_id"]
    event = get_event_by_id(e_id)
    if event is None:
        raise NotFound(f"Could not find Event {e_id}")
    EventResponse.query.filter_by(event_id=e_id).delete()
    db.session.delete(event)
    db.session.commit()
    return "Safely deleted event", 200


@application.route("/get_event_responses", methods=["GET"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def getEventResponses():
    args = request.args
    validate_request_args(args, 'event_id')
    return getEventResponses(args["event_id"])


def getEventResponses(event_id):
    eventResponses = EventResponse.query.filter_by(
        event_id=event_id).all()
    return jsonify(event_responses=[er.eventResponseDict() for er in eventResponses])


def getEventResponsesBatch(event_id_list):
    eventResponses = db.session.query(User, EventResponse).filter(
        User.id == EventResponse.user_id).filter(EventResponse.event_id.in_(event_id_list)).all()
    resp_dict = defaultdict(lambda: defaultdict(list))
    # sort responses by response time (in ascending order/earlier responses first), and all null response times at end
    responses_sorted_by_response_time = sorted(eventResponses,
                                               key=lambda resp: float('inf') if resp[1].response_time is None else resp[1].response_time)
    for resp in responses_sorted_by_response_time:
        user = resp[0]
        event_resp = resp[1]
        resp_dict[event_resp.event_id][event_resp.response].append(
            {"user_id": event_resp.user_id, "email": user.email})
    return resp_dict


@application.route("/get_squads", methods=["GET"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def get_squads():
    args = request.args
    validate_request_args(args, 'email')
    email = args["email"]
    user = User.query.filter_by(email=email).first()
    if not user:
        raise NotFound(f"Could not find User {email}")
    user_id = user.id
    user_squad_memberships = SquadMembership.query.filter_by(
        user_id=user_id).all()
    squads_lst = []
    for user_squad_membership in user_squad_memberships:
        squad_id = user_squad_membership.squad_id
        squad = Squad.query.filter_by(id=squad_id).first()
        if squad is None:
            raise NotFound(f"Could not find Squad {squad_id}")
        squads_lst.append(squad)
    return jsonify(squads=[squad.squadDict() for squad in squads_lst])


@application.route("/get_users", methods=["GET"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def get_users():
    args = request.args
    validate_request_args(args, 'squadId')
    squad_id = args["squadId"]
    users = GetUsersBySquadId(squad_id)
    return jsonify(user_info=users)


@application.route("/delete_user", methods=["DELETE"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def delete_user():
    content = request.get_json()
    validate_request_args(content, 'user_id', 'squad_id')
    user_id = content["user_id"]
    squad_id = content["squad_id"]
    to_delete = SquadMembership.query.filter_by(
        user_id=user_id, squad_id=squad_id).first()
    if to_delete == None:
        print("User is already deleted from squad.")
        return "User is already deleted from squad."
    else:
        db.session.delete(to_delete)
        db.session.commit()
    users = GetUsersBySquadId(squad_id)
    return jsonify(user_info=users)


@application.route("/get_user_id", methods=["GET"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def get_user_id():
    args = request.args
    validate_request_args(args, 'email')
    email = args["email"]
    user = User.query.filter_by(email=email).first()
    if user:
        raise NotFound(f"Could not find User {email}")
    user_id = user.id
    return jsonify(user_id=user_id)


@application.route("/delete_squad", methods=["DELETE"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def delete_squad():
    content = request.get_json()
    validate_request_args(content, 'squad_id', 'user_id')
    squad_id = content["squad_id"]
    user_id = content["user_id"]
    squad_to_delete = Squad.query.filter_by(id=squad_id).first()
    if squad_to_delete == None:
        print("Squad is already deleted.")
        return "Squad is already deleted."
    else:
        db.session.delete(squad_to_delete)
        db.session.commit()
    squad_members = SquadMembership.query.filter_by(squad_id=squad_id).all()
    for squad_member in squad_members:
        db.session.delete(squad_member)
        db.session.commit()
    # get squads
    user_squad_memberships = SquadMembership.query.filter_by(
        user_id=user_id).all()
    squads_lst = []
    for user_squad_membership in user_squad_memberships:
        squad_id = user_squad_membership.squad_id
        squad = Squad.query.filter_by(id=squad_id).first()
        if squad is None:
            raise NotFound(f"Could not find Squad {squad_id}")
        squads_lst.append(squad)
    return jsonify(squads=[squad.squadDict() for squad in squads_lst])
