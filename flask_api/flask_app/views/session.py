from . import *
from flask import session

session = Blueprint('session',__name__,url_prefix='')

@session.route("/session",methods=["GET"])
def check_session():
    username = session.get("username")
    if username is not None:
        return jsonify(username=username)
    else:
        return jsonify(msg="not yet sign in")