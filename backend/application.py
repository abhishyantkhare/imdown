from flask import request
from flask import jsonify
from init import application, db, migrate
from models.user import User
from models.event_response import EventResponse
from models.event import Event
from models.group import Group
from models.groupmembership import GroupMembership


def validateArgsInRequest(content, *args):
    for arg in args:
        if arg not in content:
            return False, '{} not in request!'.format(arg)
    return True, None


@application.route("/")
def hello():
    return "Hello, World!"


@application.route("/sign_in", methods=['POST'])
def signIn():
    content = request.get_json()
    ok, err = validateArgsInRequest(content, 'username', 'auth_hash')
    if not ok:
        return err, 400
    username = content['username']
    auth_hash = content['auth_hash']
    u = User(username=username, auth_hash=auth_hash)
    existing_user = User.query.filter_by(auth_hash=auth_hash).first()
    if existing_user is not None:
        return existing_user.jsonifyUser()
    db.session.add(u)
    db.session.commit()
    return u.jsonifyUser()


@application.route("/add_to_group", methods=['POST'])
def add_to_group():
    content = request.get_json()
    ok, err = validateArgsInRequest(content, 'auth_hash', 'invite_link')
    if not ok:
        return err, 400
    auth_hash = content['auth_hash']
    invite_link = content['invite_link']
    return addUserToGroup(invite_link, auth_hash)


@application.route("/create_group", methods=["POST"])
def createGroup():
    content = request.get_json()
    ok, err = validateArgsInRequest(
        content, "username", "auth_hash", "group_name")
    if not ok:
        return err, 400
    auth_hash = content["auth_hash"]
    user = User.query.filter_by(auth_hash=auth_hash).first()
    if user is None:
        return 'User does not exist!', 400
    group = Group(name=content["group_name"])
    group.generate_invite_link()
    db.session.add(group)
    db.session.commit()
    err, code = addUserToGroup(group.invite_link, auth_hash)
    if code == 400:
        return err, code
    return group.jsonifyGroup()


@application.route("/respond_to_event", methods=["POST"])
def respond_to_event():
    content = request.get_json()
    ok, err = validateArgsInRequest(
        content, "auth_hash", "event_id", "response")
    if not ok:
        return err, 400
    auth_hash = content["auth_hash"]
    event_id = content["event_id"]
    response = content["response"]
    return respondToEvent(auth_hash, event_id, response)


def respondToEvent(auth_hash, event_id, response):
    existing_entry_exists = False
    user = User.query.filter_by(auth_hash=auth_hash).first()
    if user is None:
        return "Can't find user with auth hash {}, so can't respond to event {}".format(auth_hash, event_id), 400
    user_id = user.id
    event = Event.query.filter_by(id=event_id).first()
    if event == None:
        response_msg = "No event found for event {}. Erroring".format(event_id)
        print(response_msg)
        return response_msg, 400
    event_group_id = event.group_id
    group_membership = GroupMembership.query.filter_by(
        group_id=event_group_id, user_id=user_id).first()
    if group_membership == None:
        response_msg = "User {} is not part of group {} that event {} was made for. Erroring".format(
            user_id, event_group_id, event_id)
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


def addUserToGroup(invite_link, auth_hash):
    group_obj = Group.query.filter_by(invite_link=invite_link).first()
    if group_obj is None:
        print("Failure adding to group. Invite link is not valid")
        return "Invite link not valid. It is {}".format(invite_link), 400
    user_obj = User.query.filter_by(auth_hash=auth_hash).first()
    if user_obj is None:
        print("Failure adding to group. User with user auth hash {} does not exist".format(
            auth_hash))
        return "User hash is not valid. It is {}".format(auth_hash), 400
    user_group_existing_membership = GroupMembership.query.filter_by(
        user_id=user_obj.id, group_id=group_obj.id).first()
    if (user_group_existing_membership != None):
        print("User is already in group, not adding")
        return "User is already in group, not adding"
    else:
        to_insert = GroupMembership(group_id=group_obj.id, user_id=user_obj.id)
        db.session.add(to_insert)
        db.session.commit()
        return to_insert.jsonifyGroupMembership()
    return to_insert.jsonifyGroupMembership()


@application.route("/create_event", methods=["POST"])
def createEvent():
    content = request.get_json()
    ok, err = validateArgsInRequest(content, "auth_hash", "title",
                                    "description", "start_time", "end_time", "address", "group_id")
    if not ok:
        return err, 400
    u = User.query.filter_by(auth_hash=content["auth_hash"]).first()
    if u is None:
        return "User does not exist!", 400
    g = Group.query.filter_by(id=content["group_id"]).first()
    if g is None:
        return "Group does not exist!", 400
    membership = GroupMembership.query.filter_by(
        user_id=u.id, group_id=g.id).first()
    if membership is None:
        return "User is not a member of group!", 400
    title = content["title"]
    desc = content["description"]
    start_time = content["start_time"]
    end_time = content["end_time"]
    address = content["address"]
    lat = 0.0
    lng = 0.0
    if "lat" in content and "lng" in content:
        lat = content["lat"]
        lng = content["lng"]
    group_id = content["group_id"]
    e = Event(title=title, description=desc, start_time=start_time,
              end_time=end_time, address=address, lat=lat, lng=lng, group_id=group_id)
    db.session.add(e)
    db.session.commit()
    respondToEvent(u.id, e.id, True)
    # set every other user in group to false
    groupMemberships = GroupMembership.query.filter_by(
        group_id=group_id).all()
    for groupMembership in groupMemberships:
        respondToEvent(groupMembership.user_id, e.id, False)
    return e.jsonifyEvent()


@application.route("/get_events", methods=["GET"])
def getEvents():
    args = request.args
    ok, err = validateArgsInRequest(args, "group_id")
    if not ok:
        return err, 400
    g_id = args["group_id"]
    events = Event.query.filter_by(group_id=g_id).all()
    return jsonify(events=[e.eventDict() for e in events])


@application.route("/get_event_responses", methods=["GET"])
def getEventResponses():
    args = request.args
    ok, err = validateArgsInRequest(args, "event_id")
    if not ok:
        return err, 400
    eventResponses = EventResponse.query.filter_by(
        event_id=args["event_id"]).all()
    return jsonify(event_responses=[er.eventResponseDict() for er in eventResponses])


@application.route("/get_groups", methods=["GET"])
def get_groups():
    args = request.args
    ok, err = validateArgsInRequest(
        args, "auth_hash")
    if not ok:
        return err, 400
    auth_hash = args["auth_hash"]
    user = User.query.filter_by(auth_hash=auth_hash).first()
    if user is None:
        return 'User with auth hash of {} does not exist!'.format(auth_hash), 400
    user_id = user.id
    user_group_memberships = GroupMembership.query.filter_by(
        user_id=user_id).all()
    groups_lst = []
    for user_group_membership in user_group_memberships:
        group_id = user_group_membership.group_id
        group = Group.query.filter_by(id=group_id).first()
        if group is None:
            return "User {} is a member of group {}, but group could not be retrieved".format(user_id, group_id), 400
        groups_lst.append(group)
    return jsonify(groups=[group.groupDict() for group in groups_lst])
