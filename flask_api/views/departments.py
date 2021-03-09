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


departments = Blueprint('departments',__name__,url_prefix='')

@departments.route("/Departments",methods=["GET"])
def getDepartmentsInfo():
    curs.execute("select * from department")
    info = curs.fetchall()
    if info is None:
        return jsonify(msg="empty table")
    departments = []
    for i in info:
        content = {'did':i[0],'uid':i[1],'name':i[2],'info':i[3],'equipement':i[4],'education_support':i[5]}
        departments.append(content)
    data = {'msg':"success",'departments':departments}
    return jsonify(data)