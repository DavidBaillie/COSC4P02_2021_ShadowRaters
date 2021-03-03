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


reviewUniversity = Blueprint('reviewUniversity',__name__,url_prefix='/reviews')

@app.route("/university",methods=["GET","POST"])
def SchoolReviews():
    if request.method == 'POST':
        newReview = request.get_json()
        ruid = binascii.b2a_hex(os.urandom(15))
        ruid = str(ruid,encoding="utf-8")
        uuid = newReview.get('uuid')
        uid = newReview.get('uid')
        curs.execute("select * from rating_university where uuid = '%s' and uid = '%s'" % (uuid, uid))
        info = curs.fetchall()
        if info is not None:
            return jsonify(msg="already rated")
        score = newReview.get('score')
        comment = newReview.get('comment')
        num_agree = 0
        num_disagree = 0
        if not all([uuid,uid,score]):
            return jsonify(msg="not enough data")
        curs.execute("insert into rating_university "
                     "values('%s','%s','%s','%s','%s','%s','%s')" % (ruid,uuid,uid,score,comment,num_agree,num_disagree))
        conn.commit()
        return jsonify(msg="success")
    else:
        curs.execute("select * from rating_university")
        info = curs.fetchall()
        if info is None:
            return jsonify(msg="empty table")
        reviews=[]
        for i in info:
            content = {'rpid':i[0],'uuid':i[1],'uid':i[2],'score':i[3],'comment':i[4],'num_agree':i[5],'num_disagree':i[6]}
            reviews.append(content)
        data = {'msg':"success",'reviews':reviews}
        return jsonify(data)