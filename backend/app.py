from flask import request
from flask import jsonify
from init import application
from extensions import db, migrate
from models.user import User
from models.event_response import EventResponse
from models.event import Event
from models.squad import Squad
from models.squadmembership import SquadMembership
from flask_login import login_user, login_required
from collections import defaultdict


def validateArgsInRequest(content, *args):
    for arg in args:
        if arg not in content:
            print('{} not in request!'.format(arg))
            return False, '{} not in request!'.format(arg)
    return True, None


@application.route("/")
def hello():
    return "Hello, World!"


@application.route("/sign_in", methods=['POST'])
def signIn():
    content = request.get_json()
    ok, err = validateArgsInRequest(content, 'email', 'name', 'photo')
    if not ok:
        return err, 400
    email = content["email"]
    photo = content["photo"]
    name = content["name"]
    u = User.query.filter_by(email=email).first()
    if u is None:
        u = User(email=email, name=name, photo=photo)
        db.session.add(u)
        db.session.commit()
    login_user(u)
    return u.jsonifyUser()


@application.route("/add_to_squad", methods=['POST'])
@login_required # If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
def add_to_squad():
    content = request.get_json()
    ok, err = validateArgsInRequest(content, 'email', 'squad_code')
    if not ok:
        return err, 400
    email = content['email']
    squad_code = content['squad_code']
    return addUserToSquad(squad_code, email)


@application.route("/create_squad", methods=["POST"])
@login_required # If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
def createSquad():
    content = request.get_json()
    ok, err = validateArgsInRequest(
        content, "email", "squad_name", "squad_emoji")
    if not ok:
        return err, 400
    email = content["email"]
    user = User.query.filter_by(email=email).first()
    if user is None:
        return 'User does not exist!', 400
    squad = Squad(name=content["squad_name"], squad_emoji=content["squad_emoji"])
    squad.generate_code()
    db.session.add(squad)
    db.session.commit()
    addUserToSquad(squad.code, email)
    return squad.jsonifySquad()


@application.route("/respond_to_event", methods=["POST"])
@login_required # If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
def respond_to_event():
    content = request.get_json()
    ok, err = validateArgsInRequest(
        content, "email", "event_id", "response")
    if not ok:
        return err, 400
    email = content["email"]
    event_id = content["event_id"]
    response = content["response"]
    user = User.query.filter_by(email=email).first()
    if user is None:
            return "Can't find user with email {}, so can't respond to event {}".format(email, event_id), 400
    return respondToEvent(user.id, event_id, response)

def respondToEvent(user_id, event_id, response):
    existing_entry_exists = False
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return "Can't find user with user_id {}, so can't respond to event {}".format(user_id, event_id), 400
    user_id = user.id
    event = Event.query.filter_by(id=event_id).first()
    if event == None:
        response_msg = "No event found for event {}. Erroring".format(event_id)
        print(response_msg)
        return response_msg, 400
    event_squad_id = event.squad_id
    squad_membership = SquadMembership.query.filter_by(
        squad_id=event_squad_id, user_id=user_id).first()
    if squad_membership == None:
        response_msg = "User {} is not part of squad {} that event {} was made for. Erroring".format(
            user_id, event_squad_id, event_id)
        print(response_msg)
        return response_msg, 400
    event_response = EventResponse.query.filter_by(
        event_id=event_id, user_id=user_id).first()
    if event_response is not None:
        if event_response.response is not response:
            response_msg = "User {} already responded to event {} with response of {}." \
                " Overwriting it with response of {}".format(
                    user_id, event_id, event_response.response, response)
            print(response_msg)
            event_response.response = response
            existing_entry_exists = True
        elif event_response.response is response:
            response_msg = "User {} already responded to event {} with response of {}. User gave same response.".format(
                user_id, event_id, event_response.response)
            print(response_msg)
            return response_msg, 200
    if not existing_entry_exists:
        event_response = EventResponse(
            user_id=user_id, event_id=event_id, response=response)
        db.session.add(event_response)
    db.session.commit()
    return event_response.jsonifyEventResponse()


def addUserToSquad(squad_code, email):
    squad_obj = Squad.query.filter_by(code=squad_code).first()
    if squad_obj is None:
        print("Failure adding to squad. Invite link is not valid")
        return "Invite link not valid. It is {}".format(invite_link), 400
    user_obj = User.query.filter_by(email=email).first()
    if user_obj is None:
        print("Failure adding to squad. User with user auth hash {} does not exist".format(
            email))
        return "User hash is not valid. It is {}".format(auth_hash), 400
    user_squad_existing_membership = SquadMembership.query.filter_by(
        user_id=user_obj.id, squad_id=squad_obj.id).first()
    if (user_squad_existing_membership != None):
        print("User is already in squad, not adding")
        return "User is already in squad, not adding"
    else:
        to_insert = SquadMembership(squad_id=squad_obj.id, user_id=user_obj.id)
        db.session.add(to_insert)
        db.session.commit()
        return to_insert.jsonifySquadMembership()
    return to_insert.jsonifySquadMembership()


@application.route("/create_event", methods=["POST"])
@login_required # If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
def createEvent():
    content = request.get_json()
    ok, err = validateArgsInRequest(content, "email", "title", "emoji",
                                    "description", "start_time", "end_time", "squad_id", "event_url", "image_url")
    if not ok:
        return err, 400
    u = User.query.filter_by(email=content["email"]).first()
    if u is None:
        return "User does not exist!", 400
    g = Squad.query.filter_by(id=content["squad_id"]).first()
    if g is None:
        return "Squad does not exist!", 400
    membership = SquadMembership.query.filter_by(
        user_id=u.id, squad_id=g.id).first()
    if membership is None:
        return "User is not a member of squad!", 400
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

    e = Event(title=title, event_emoji=event_emoji, description=desc, start_time=start_time,
              end_time=end_time, squad_id=squad_id, event_url=event_url, image_url=image_url)
    db.session.add(e)
    db.session.commit()
    respondToEvent(u.id, e.id, True)
    # set every other user in squad to false
    squadMemberships = SquadMembership.query.filter_by(
        squad_id=squad_id).all()
    for squadMembership in squadMemberships:
        if (squadMembership.user_id != u.id):
            respondToEvent(squadMembership.user_id, e.id, False)
    return e.jsonifyEvent()


@application.route("/get_events", methods=["GET"])
@login_required # If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
def getEvents():
    args = request.args
    ok, err = validateArgsInRequest(args, "squad_id")
    if not ok:
        return err, 400
    g_id = args["squad_id"]
    events = Event.query.filter_by(squad_id=g_id).all()
    event_ids = [e.id for e in events]
    event_responses = getEventResponsesBatch(event_ids)
    ret_list = [e.eventDict() for e in events]
    for event in ret_list:
        event["event_responses"] = {}
        event["event_responses"]["accepted"] = event_responses[event["id"]][True]
        event["event_responses"]["declined"] = event_responses[event["id"]][False]
    return jsonify(ret_list)

@application.route("/get_event", methods=["GET"])
@login_required # If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
def getEvent():
    args = request.args
    ok, err = validateArgsInRequest(args, "event_id")
    if not ok:
        print("validation error")
        return err, 400
    e_id = args["event_id"]
    event = Event.query.filter_by(id=e_id).first()
    if event is None:
        response_msg = "Event {} not found in DB. Erroring".format(
            event_id)
        print(response_msg)
        return response_msg, 400
    event_responses = getEventResponsesBatch([event.id])
    ret = event.eventDict() 
    ret["event_responses"] = {}
    ret["event_responses"]["accepted"] = event_responses[ret["id"]][True]
    ret["event_responses"]["declined"] = event_responses[ret["id"]][False]
    return jsonify(ret)


@application.route("/get_event_responses", methods=["GET"])
@login_required # If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
def getEventResponses():
    args = request.args
    ok, err = validateArgsInRequest(args, "event_id")
    if not ok:
        return err, 400
    return getEventResponses(args["event_id"])

def getEventResponses(event_id):
    eventResponses = EventResponse.query.filter_by(
        event_id=event_id).all()
    return jsonify(event_responses=[er.eventResponseDict() for er in eventResponses])

def getEventResponsesBatch(event_id_list):
    eventResponses = db.session.query(User, EventResponse).filter(User.id == EventResponse.user_id).filter(EventResponse.event_id.in_(event_id_list)).all()
    resp_dict = defaultdict(lambda: defaultdict(list))
    for resp in eventResponses:
        user = resp[0]
        event_resp = resp[1]
        resp_dict[event_resp.event_id][event_resp.response].append({"user_id": event_resp.user_id, "email": user.email})
    return resp_dict

@application.route("/get_squads", methods=["GET"])
@login_required # If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
def get_squads():
    args = request.args
    ok, err = validateArgsInRequest(
        args, "email")
    if not ok:
        return err, 400
    email = args["email"]
    user = User.query.filter_by(email=email).first()
    if user is None:
        return 'User with email of {} does not exist!'.format(email), 400
    user_id = user.id
    user_squad_memberships = SquadMembership.query.filter_by(
        user_id=user_id).all()
    squads_lst = []
    for user_squad_membership in user_squad_memberships:
        squad_id = user_squad_membership.squad_id
        squad = Squad.query.filter_by(id=squad_id).first()
        if squad is None:
            return "User {} is a member of squad {}, but squad could not be retrieved".format(user_id, squad_id), 400
        squads_lst.append(squad)
    return jsonify(squads=[squad.squadDict() for squad in squads_lst])


@application.route("/get_users", methods=["GET"])
@login_required # If you want to test this endpoint w/o requiring auth (i.e. Postman) comment this out
def get_users():
    args = request.args
    ok, err = validateArgsInRequest(
        args, "squadId")
    if not ok:
        return err, 400
    squad_id = args["squadId"]
    user_squad_memberships = SquadMembership.query.filter_by(
        squad_id=squad_id).all()
    users_lst = []
    for user_squad_membership in user_squad_memberships:
        user_id = user_squad_membership.user_id
        user = User.query.filter_by(id=user_id).first()
        if user is None:
            return "User {} is a member of squad {}, but user could not be retrieved".format(user_id, squad_id), 400
        users_lst.append(user)
    return jsonify(user_info=[user.userDict() for user in users_lst])