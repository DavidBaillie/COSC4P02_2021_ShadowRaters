from flask import Blueprint,request,jsonify,session
from sshtunnel import SSHTunnelForwarder
import psycopg2
import os,binascii
from hashlib import sha256
import random, string

server = SSHTunnelForwarder(
    ('51.222.151.27',22),
    ssh_private_key = "C:\\Users\\wsh41\\.ssh\\id_rsa",
    ssh_username='root',
    remote_bind_address=('localhost',5432))

server.start()
print("server connected")

conn = psycopg2.connect(
    database='postgres',
    user='postgres',
    password='COSC4P02Raters',
    host='localhost',
    port=server.local_bind_port,
)
curs = conn.cursor()


session = Blueprint('session',__name__,url_prefix='')

@session.route("/session",methods=["GET"])
def check_session():
    username = session.get("username")
    if username is not None:
        return jsonify(username=username)
    else:
        return jsonify(msg="not yet sign in")