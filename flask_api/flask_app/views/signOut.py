from . import *
from flask import session

signOut = Blueprint('signOut',__name__,url_prefix='')

@signOut.route("/sign_out",methods=["GET"])
def sign_out():
    session.clear()
    return jsonify(msg="success")