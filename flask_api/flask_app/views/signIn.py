from . import *
from flask import session
signIn = Blueprint('signIn',__name__,url_prefix='')

@signIn.route("/sign_in",methods=["POST"])
def sign_in():
    userData = request.get_json()
    username = userData.get("username")
    password = userData.get("password")
    if not all([username,password]):
        return jsonify(msg="missing username or password")
    curs.execute("select password from \"user\" where username = '%s'" % username)
    p = curs.fetchone()
    curs.execute("select salt from \"user\" where username = '%s'" % username)
    salt = curs.fetchone()[0]
    if p is None:
        return jsonify(msg="username not exist")
    if p[0] == sha256(salt.encode()+password.encode()).hexdigest():
        session["username"] = username
        return jsonify(msg="success")
    else:
        return jsonify(msg="wrong password")