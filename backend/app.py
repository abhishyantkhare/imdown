from flask import request
from flask import abort
from init import app, db, migrate
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


@app.route("/")
def hello():
    return "Hello, World!"


@app.route("/sign_in", methods=['POST'])
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


@app.route("/add_to_group", methods=['POST'])
def add_to_group():
  content = request.get_json()
  ok, err = validateArgsInRequest(content, 'auth_hash', 'invite_link')
  if not ok:
    return err, 400
  auth_hash = content['auth_hash']
  invite_link = content['invite_link']
  return addUserToGroup(invite_link, auth_hash)

@app.route("/create_group", methods=["POST"])
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


def addUserToGroup(invite_link, auth_hash):
  group_obj = Group.query.filter_by(invite_link=invite_link).first()
  if group_obj is None:
    print("Failure adding to group. Invite link is not valid")
    return "Invite link not valid. It is {}".format(invite_link), 400
  user_obj = User.query.filter_by(user_auth=auth_hash).first()
  if user_obj is None:
    print("Failure adding to group. User with user auth hash {} does not exist".format(auth_hash))
    return "User hash is not valid. It is {}".format(auth_hash), 400
  user_group_existing_membership = GroupMembership.query.filter_by(user_id=user_obj.id, group_id=group_obj.id).first()
  if (user_group_existing_membership != None):
      print("User is already in group, not adding")
      return None
  else:
      to_insert = GroupMembership(group_id=group_obj.id, user_id=user_obj.id)
      db.session.add(to_insert)
      db.session.commit()
      return to_insert.jsonifyGroupMembership()
