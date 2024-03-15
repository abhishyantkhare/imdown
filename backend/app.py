import apiclient
from flask import request, make_response
from flask import jsonify
import google.oauth2.credentials
import google_auth_oauthlib.flow

from config import Config
from init import application, scheduler
from extensions import db
from errors import HttpError, BadRequest, Unauthorized, Forbidden, NotFound
from models.user import User
from models.event_response import EventResponse
from models.event import Event
from models.event_time import EventTime
from models.squad import Squad
from models.squadmembership import SquadMembership, GetUsersBySquadId
from flask_login import login_user, login_required, logout_user, current_user
from collections import defaultdict
from sqlalchemy.orm import load_only
import requests
import json
import time
from notifications import notify_squad_members


# This must match the scope we request in login.tsx.
GOOGLE_API_SCOPE = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/calendar.events",
    "openid"
]
GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'


def validate_request_args(content: dict, *required_args):
    """Verify that all required arguments are present in the request."""
    missing_args = set(required_args) - set(content.keys())
    if missing_args:
        raise BadRequest(f"Missing args: {', '.join(missing_args)}")


@application.route("/")
def hello():
    return "Hello, World!"


@application.route("/login", methods=['POST'])
def login():
    """Sign in using Google, and create a session with Flask."""
    content = request.get_json()
    validate_request_args(content, 'googleServerCode')
    google_server_code = content['googleServerCode']

    # Obtain credentials from Google.
    credentials = fetch_google_credentials(google_server_code)
    # Use credentials to fetch user information.
    user_info_service = apiclient.discovery.build(
        serviceName="oauth2", version="v2", credentials=credentials
    )
    user_info = user_info_service.userinfo().get().execute()

    # Find or create a user with a matching email.
    email = user_info['email']
    name = user_info['name']
    photo = user_info['picture']
    user = User.query.filter_by(email=email).first()
    if user is None:
        user = User(email=email, name=name, photo=photo)
    else:
        user.name = name
        user.photo = photo

    # Ensure the user is up-to-date.
    user.google_access_token = credentials.token
    # The refresh token will be provided only upon initial authentication.
    if credentials.refresh_token:
        user.google_refresh_token = credentials.refresh_token

    # Persist this update and sign in the user.
    login_user(user)
    db.session.add(user)
    db.session.commit()
    return make_response()


@application.route("/device_token", methods=["POST", "GET"])
@login_required
def device_token():
    if request.method == "GET":
        return jsonify({'device_token': current_user.device_token})
    content = request.get_json()
    validate_request_args(content, 'deviceToken')
    device_token = content['deviceToken']
    if device_token:
        current_user.device_token = device_token
        db.session.commit()
    return "Successfully set device token!", 200


def fetch_google_credentials(auth_code) -> google.oauth2.credentials.Credentials:
    """Use the client's authorization code to obtain access tokens from Google.

    https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code
    """
    # Create the OAuth2 authentication flow.
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        Config.GOOGLE_SECRET_FILE, GOOGLE_API_SCOPE
    )
    # Complete the authentication flow to obtain access tokens.
    flow.fetch_token(code=auth_code)
    return flow.credentials


@application.route("/sign_out", methods=['POST'])
@login_required
def signout():
    logout_user()
    return "Successfully signed out user!"


@application.route("/is_signed_in", methods=["GET"])
@login_required
def is_logged_in():
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


@application.route("/squad", methods=["GET", "POST", "DELETE", "PUT"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def squad():
    if request.method == "POST":
        return create_squad(request)
    if request.method == "DELETE":
        return delete_squad(request)
    if request.method == "GET":
        return get_squad(request)
    if request.method == "PUT":
        return edit_squad(request)

def get_squad(request):
    args = request.args
    validate_request_args(args, 'squad_id')
    squad_id = args["squad_id"]
    squad = Squad.query.get(squad_id)
    if squad is None:
        raise NotFound(f"Squad {squad_id} does not exist")
    ret = jsonify(squad.squadDict(include_image=True))
    return ret


def create_squad(request):
    content = request.get_json()
    validate_request_args(content, 'name', 'emoji')
    squad = Squad(name=content['name'], admin_id=current_user.id,
                  squad_emoji=content['emoji'])
    squad.generate_code()
    db.session.add(squad)
    db.session.commit()
    addUserToSquad(squad.code, current_user.email)
    return squad.jsonifySquad()


def delete_squad(request):
    content = request.get_json()
    validate_request_args(content, 'squadId')
    squad_id = content['squadId']
    user_id = current_user.id
    squad_to_delete = Squad.query.get(squad_id)
    if not squad_to_delete:
        return "Squad is already deleted."
    # TODO: this can be done automatically by setting ON DELETE CASCADE or similar
    squad_members = SquadMembership.query.filter_by(squad_id=squad_id).all()

    # Send notification
    notify_squad_members(
        squad_to_delete.id, squad_to_delete.name,body="The squad was deleted." , users_to_exclude={squad_to_delete.admin_id})

    for squad_member in squad_members:
        db.session.delete(squad_member)
    db.session.delete(squad_to_delete)
    db.session.commit()

    # get squads
    user_squad_memberships = SquadMembership.query.filter_by(
        user_id=user_id).all()
    squads_lst = []
    for user_squad_membership in user_squad_memberships:
        squad_id = user_squad_membership.squad_id
        squad = Squad.query.get(squad_id)
        if squad is None:
            raise NotFound(f"Could not find Squad {squad_id}")
        squads_lst.append(squad)
    return jsonify(squads=[squad.squadDict() for squad in squads_lst])

def edit_squad(request):
    content = request.get_json()
    validate_request_args(content, "squad_id", "squad_name", "squad_emoji")
    squad_id = content["squad_id"]
    squad = Squad.query.get(squad_id)
    if not squad:
        raise NotFound(f"Could not find Squad {squad_id}")
    squad.name = content["squad_name"]
    squad.squad_emoji = content["squad_emoji"]
    squad.image = content.get('squad_image')
    # Send notification
    notify_squad_members(
        squad.id, squad.name, body="Squad details were updated.", users_to_exclude={squad.admin_id})
    db.session.add(squad)
    db.session.commit()
    return squad.jsonifySquad()


@application.route("/respond_to_event", methods=["POST"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def respond_to_event():
    content = request.get_json()
    validate_request_args(content, 'eventId', 'response')
    return respondToEvent(content['eventId'], content['response'])


def respondToEvent(event_id, response):
    existing_entry_exists = False
    user_id = current_user.id
    user = User.query.get(user_id)
    if not user:
        raise NotFound(f"Could not find User {user_id}")
    event = Event.query.get(event_id)
    if not event:
        raise NotFound(f"Could not find Event {event_id}")
    event_squad_id = event.squad_id
    squad_membership = SquadMembership.query.filter_by(
        squad_id=event_squad_id, user_id=user_id).first()
    if not squad_membership:
        raise NotFound(
            f"User {user_id} is not a member of Squad {event_squad_id}")

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
            if response:
                print("sending notif to others")
                push_notif_body = f"{user.name} has already accepted the event invite and is excited about the event! Notify others if you will be attending by RSVPing now."
                notify_squad_members(
                    event_squad_id, event.title, body=push_notif_body, users_to_exclude={user_id})
            return response_msg, 200
    if not existing_entry_exists:
        user_event_response = EventResponse(
            user_id=user_id, event_id=event_id, response=response, response_time=responded_at_time)
        

    # Add event time
    user_event_response.event_time_id = EventTime.get_event_time_id_for_time(user_event_response.event_id)
    db.session.add(user_event_response)
    db.session.commit()
    threshold_passed = getEventResponsesAndCheckDownThresh(event)
    if not user_event_response.response:
        removeEventFromCalendarIfExists(event, user_id)



    # send notification
    # we send a notification if the person responding is not the event creator and they are saying they're down
    if user_id != event.creator_user_id and user_event_response.response:
        notif_body = f"{current_user.name} accepted the event."
        if threshold_passed:
            notif_body = notif_body + " " + "Enough people are down! The event will automatically be scheduled on Google Calendar."
        notify_squad_members(
            event_squad_id, event.title, body=notif_body, users_to_exclude={user_id})
    return user_event_response.jsonify_eventResponse()


def getEventResponsesAndCheckDownThresh(event):
    if not event.start_time or not event.end_time:
        return
    event_responses = EventResponse.query.filter_by(
        event_id=event.id).all()
    num_accepted = 0
    num_declined = 0
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
        return True
    return False


def removeEventFromCalendarIfExists(event, user_id):
    if not event.start_time or not event.end_time:
        return
    user = User.query.get(user_id)
    access_token = user.getToken(GOOGLE_TOKEN_URL)
    headers = {'Authorization': 'Bearer {}'.format(
        access_token)}
    event_url = '{}/{}'.format(GOOGLE_CALENDAR_API, event.get_event_UUID())
    requests.delete(event_url, headers=headers)


def addEventToCalendars(accepted_responses):
    event = Event.query.get(accepted_responses[0].event_id)
    gcal_event = event.get_google_calendar_event_body()
    users = [User.query.get(resp.user_id) for resp in accepted_responses]
    attendees = [{'email': user.email} for user in users]
    gcal_event['attendees'] = attendees
    for user in users:
        req_type = 'POST'
        if eventExistsOnCalendar(event, user):
            req_type = 'PUT'
        sendGoogleCalendarRequest(gcal_event, user, req_type)


def sendGoogleCalendarRequest(gcal_event, user, req_type):
    access_token = user.getToken(GOOGLE_TOKEN_URL)
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
    access_token = user.getToken(GOOGLE_TOKEN_URL)
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
        # Send notification
        notify_squad_members(
            squad_obj.id, squad_obj.name,body=f"{user_obj.name} joined the squad!", users_to_exclude={user_obj.id})
        response = {
            "status_code": 200,
            "message": "Sucessfully added squad.",
            "squad_name": squad_obj.name
        }
        return jsonify(response)


@application.route("/create_event", methods=["POST"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def create_event():
    content = request.get_json()
    validate_request_args(content, 'title', 'emoji', 'description',
                          'startTime', 'endTime', 'squadId', 'eventUrl',
                          'imageUrl', 'downThreshold')
    squad_id = content['squadId']
    event_squad = Squad.query.get(squad_id)
    if not event_squad:
        raise NotFound(f"Could not find Squad {squad_id}")
    membership = SquadMembership.query.filter_by(
        user_id=current_user.id, squad_id=squad_id
    ).first()
    if membership is None:
        raise NotFound("User is not a member of squad")
    title = content["title"]
    desc = content["description"]
    event_emoji = content["emoji"]
    start_time = content['startTime']
    end_time = content['endTime']
    # TODO: When address + lat/lng is implemented in mobile, uncomment
    # address = content["address"]
    lat = 0.0
    lng = 0.0
    if "lat" in content and "lng" in content:
        lat = content["lat"]
        lng = content["lng"]
    event_url = content['eventUrl']
    image_url = content['imageUrl']
    down_threshold = content['downThreshold']

    e = Event(title=title, event_emoji=event_emoji, description=desc,
              start_time=start_time, end_time=end_time,
              squad_id=event_squad.id, event_url=event_url,
              image_url=image_url, down_threshold=down_threshold,
              creator_user_id=current_user.id)
    db.session.add(e)
    db.session.commit()
    # Also add to event time table
    db.session.add(
        EventTime(
            event_id=e.id,
            start_time=e.start_time,
            end_time=e.end_time
        )
    )
    db.session.commit()
    respondToEvent(e.id, True)

    # send notification
    notify_squad_members(event_squad.id, event_squad.name, body="New event!",
                         users_to_exclude={current_user.id})
    # schedule reminder
    e.schedule_reminder(scheduler)
    return e.jsonify_event()


@application.route("/edit_event", methods=["PUT"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def edit_event():
    content = request.get_json()
    validate_request_args(content, 'eventId', 'title', 'emoji', 'description',
                          'downThreshold', 'startTime', 'endTime', 'eventUrl',
                          'imageUrl', 'squadId')
    event_id = content['eventId']
    event = Event.query.get(event_id)
    if event is None:
        raise NotFound(f"Could not find Event {event_id}")

    event.title = content['title']
    event.description = content['description']
    event.down_threshold = content['downThreshold']
    event.event_emoji = content['emoji']
    event.event_url = content['eventUrl']
    event.image_url = content['imageUrl']
    event.start_time = content['startTime']
    event.end_time = content['endTime']
    db.session.add(event)
    db.session.commit()
    # Also update event time
    event_time = EventTime.query.filter_by(event_id=event.id).first()
    if not event_time:
        raise NotFound(f"Could not find event time for event {event_id}")
    event_time.start_time = event.start_time
    event_time.end_time = event.end_time
    db.session.add(event_time)

    db.session.commit()
    getEventResponsesAndCheckDownThresh(event)

    event_squad = Squad.query.get(content['squadId'])
    if not event_squad:
        return "Squad does not exist!", 400
    # Send notification
    notify_squad_members(event_squad.id, event.title,
                         body="Event details were updated.",
                         users_to_exclude={current_user.id})
    # Schedule reminder
    event.schedule_reminder(scheduler)
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
    event = Event.query.get(e_id)
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
    event = Event.query.get(e_id)
    if event is None:
        raise NotFound(f"Could not find Event {e_id}")
    EventResponse.query.filter_by(event_id=e_id).delete()
    db.session.delete(event)
    # Also delete event time
    EventTime.query.filter_by(event_id=e_id).delete()
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
            {"user_id": event_resp.user_id, "email": user.email, "name": user.name, "photo": user.photo})
    return resp_dict


@application.route("/get_squads", methods=["GET"])
# If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
@login_required
def get_squads():
    user_id = current_user.id
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
        # Send notification
        squad = Squad.query.get(squad_id)
        user = User.query.get(user_id)
        notify_squad_members(
            squad_id, squad.name, body=f"{user.name} was removed.")
        # delete user
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
    if not user:
        raise NotFound(f"Could not find User {email}")
    user_id = user.id
    return jsonify(user_id=user_id)
