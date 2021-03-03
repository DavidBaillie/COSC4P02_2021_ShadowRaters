from flask import Flask,jsonify,request,session,g
from flask_httpauth import HTTPBasicAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
from sshtunnel import SSHTunnelForwarder
import psycopg2
import os,binascii
from hashlib import sha256
import random, string
from views.test import test
app = Flask(__name__)
app.register_blueprint(test,url_prefix='/test')
app.secret_key = "adaslccadw"
auth = HTTPBasicAuth()
SECRET_KEY = "qbsacasd"
def generate_auth_token(uuid, expiration=36000):
    s = Serializer(SECRET_KEY,expires_in=expiration)
    return s.dumps({'uuid':uuid})

def verify_auth_token(token):
    s = Serializer(SECRET_KEY)
    try:
        data = s.loads(token)
        return data
    except SignatureExpired:
        return None
    except BadSignature:
        return None

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
print("database connected")

@app.route('/')
def hello_world():
    return "hello world"

# @app.route("/sign_up",methods=["POST"])
# def createNewUser():
#     newUser = request.get_json()
#     uuid = binascii.b2a_hex(os.urandom(15))
#     uuid = str(uuid,encoding="utf-8")
#     admin = newUser.get("admin")
#     username = newUser.get("username")
#     email = newUser.get("email")
#     password = newUser.get("password")
#     salt = ''.join(random.sample(string.ascii_letters + string.digits,10))
#     password = sha256(salt.encode()+password.encode()).hexdigest()
#     school = newUser.get("school")
#     program = newUser.get("program")
#     if not all([username,password]):
#         return jsonify(msg="missing admin, username or password")
#     curs.execute("select * from \"user\" where username = '%s'" % username)
#     data = curs.fetchone()
#     #print(data)
#     if(data is not None):
#         return jsonify(msg="username already exist")
#     curs.execute("insert into \"user\" "
#                  "values('%s','%s','%s','%s','%s','%s','%s','%s')" % (uuid,admin,username,email,password,salt,school,program))
#     conn.commit()
#     return jsonify(msg="sign up success")

@app.route("/sign_in",methods=["POST"])
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

@app.route("/sign_out",methods=["GET"])
def sign_out():
    session.clear()
    return jsonify(msg="success")

@app.route("/session",methods=["GET"])
def check_session():
    username = session.get("username")
    if username is not None:
        return jsonify(username=username)
    else:
        return jsonify(msg="not yet sign in")

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

@app.route("/Courses",methods=["GET"])
def getCoursesInfo():
    curs.execute("select * from course")
    info = curs.fetchall()
    if info is None:
        return jsonify(msg="empty table")
    courses = []
    for i in info:
        content = {'cid':i[0],'pid':i[1],'uid':i[2],'did':i[3],'name':i[4],'info':i[5]}
        courses.append(content)
    data = {'msg':"success",'courses':courses}
    return jsonify(data)

@app.route("/Departments",methods=["GET"])
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

@app.route("/reviews/professors/<pid>",methods=["GET","POST"])
def professorReviews(pid):
    if request.method == 'POST':
        newReview = request.get_json()
        rpid = binascii.b2a_hex(os.urandom(15))
        rpid = str(rpid,encoding="utf-8")
        uuid = newReview.get('uuid')
        pid = newReview.get('pid')
        curs.execute("select * from rating_professor where uuid = '%s' and pid = '%s'" % (uuid,pid))
        info = curs.fetchone()
        print(info)
        if info is not None:
            return jsonify(msg="already rated")
        score = newReview.get('score')
        comment = newReview.get('comment')
        num_agree = 0
        num_disagree = 0
        if not all([uuid,pid,score]):
            return jsonify(msg="not enough data")
        curs.execute("insert into rating_professor "
                     "values('%s','%s','%s','%s','%s','%s','%s')" % (rpid,uuid,pid,score,comment,num_agree,num_disagree))
        conn.commit()
        return jsonify(msg="success")
    else:
        print(type(pid))
        curs.execute("select * from rating_professor where pid = '%s'" % pid)
        #curs.execute("select * from rating_professor")
        info = curs.fetchall()
        if info is None:
            return jsonify(msg="empty table")
        reviews=[]
        for i in info:
            content = {'rpid':i[0],'uuid':i[1],'pid':i[2],'score':i[3],'comment':i[4],'num_agree':i[5],'num_disagree':i[6]}
            reviews.append(content)
        data = {'msg':"success",'reviews':reviews}
        return jsonify(data)

@app.route("/reviews/courses",methods=["GET","POST"])
def courseReviews():
    if request.method == 'POST':
        newReview = request.get_json()
        rcid = binascii.b2a_hex(os.urandom(15))
        rcid = str(rcid,encoding="utf-8")
        uuid = newReview.get('uuid')
        cid = newReview.get('cid')
        curs.execute("select * from rating_professor where uuid = '%s' and cid = '%s'" % (uuid, cid))
        info = curs.fetchall()
        if info is not None:
            return jsonify(msg="already rated")
        score = newReview.get('score')
        duration = newReview.get('duration')
        comment = newReview.get('comment')
        num_agree = 0
        num_disagree = 0
        if not all([uuid,cid,score]):
            return jsonify(msg="not enough data")
        curs.execute("insert into rating_course "
                     "values('%s','%s','%s','%s','%s','%s','%s','%s')" % (rcid,uuid,cid,score,duration,comment,num_agree,num_disagree))
        conn.commit()
        return jsonify(msg="success")
    else:
        curs.execute("select * from rating_course")
        info = curs.fetchall()
        if info is None:
            return jsonify(msg="empty table")
        reviews=[]
        for i in info:
            content = {'rpid':i[0],'uuid':i[1],'pid':i[2],'score':i[3],'duration':i[4],'comment':i[5],'num_agree':i[6],'num_disagree':i[7]}
            reviews.append(content)
        data = {'msg':"success",'reviews':reviews}
        return jsonify(data)

@app.route("/review/department",methods=["GET","POST"])
def DepartmentReviews():
    if request.method == 'POST':
        newReview = request.get_json()
        rdid = binascii.b2a_hex(os.urandom(15))
        rdid = str(rdid,encoding="utf-8")
        uuid = newReview.get('uuid')
        did = newReview.get('did')
        curs.execute("select * from rating_department where uuid = '%s' and did = '%s'" % (uuid, did))
        info = curs.fetchall()
        if info is not None:
            return jsonify(msg="already rated")
        score = newReview.get('score')
        comment = newReview.get('comment')
        num_agree = 0
        num_disagree = 0
        if not all([uuid,did,score]):
            return jsonify(msg="not enough data")
        curs.execute("insert into rating_department "
                     "values('%s','%s','%s','%s','%s','%s','%s')" % (rdid,uuid,did,score,comment,num_agree,num_disagree))
        conn.commit()
        return jsonify(msg="success")
    else:
        curs.execute("select * from rating_department")
        info = curs.fetchall()
        if info is None:
            return jsonify(msg="empty table")
        reviews=[]
        for i in info:
            content = {'rpid':i[0],'uuid':i[1],'pid':i[2],'score':i[3],'comment':i[4],'num_agree':i[5],'num_disagree':i[6]}
            reviews.append(content)
        data = {'msg':"success",'reviews':reviews}
        return jsonify(data)

@app.route("/review/university",methods=["GET","POST"])
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

if __name__ == '__main__':
    app.run()
