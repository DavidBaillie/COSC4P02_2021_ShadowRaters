from flask import Blueprint,request,jsonify,session
# from sshtunnel import SSHTunnelForwarder
import psycopg2
import os,binascii
from hashlib import sha256
import random, string

# server = SSHTunnelForwarder(
    # ('51.222.151.27',22),
    # ssh_private_key = "C:\\Users\\wsh41\\.ssh\\id_rsa",
    # ssh_username='root',
    # remote_bind_address=('localhost',5432))

# server.start()
# print("server connected")

conn = psycopg2.connect(
    database='postgres',
    user='postgres',
    password='COSC4P02Raters',
    host='localhost',
    # port=server.local_bind_port,
    port=5432,

)
curs = conn.cursor()


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