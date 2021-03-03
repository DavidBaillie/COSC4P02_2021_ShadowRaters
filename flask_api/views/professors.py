from flask import Blueprint,request,jsonify
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


professors = Blueprint('professors',__name__,url_prefix='')

@app.route("/Professors/",methods=["GET"])
def getProfessorsInfo():
    curs.execute("select * from professor")
    info = curs.fetchall()
    if info is None:
        return jsonify(msg="empty table")
    professors = []
    for i in info:
        content = {'pid':i[0],'uid':i[1],'did':i[2],'name':i[3],'info':i[4]}
        professors.append(content)
    data = {'msg':"success",'professors':professors}
    return jsonify(data)