from flask import Flask,jsonify,request,session,g
from flask_httpauth import HTTPBasicAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
from sshtunnel import SSHTunnelForwarder
import psycopg2
import os,binascii
from hashlib import sha256
import random, string


from views.createUser import createUser
from views.signIn import signIn
from views.signOut import signOut
from views.courses import courses
from views.professors import professors
from views.session import session
from views.departments import departments
from views.reviewCourses import reviewCourses
from views.reviewDepartment import reviewDepartment
from views.reviewProfessors import reviewProfessors
from views.reviewUniversity import reviewUniversity

app = Flask(__name__)

app.register_blueprint(createUser,url_prefix='')
app.register_blueprint(signIn,url_prefix='')
app.register_blueprint(signOut,url_prefix='')
app.register_blueprint(professors,url_prefix='')
app.register_blueprint(session,url_prefix='')
app.register_blueprint(courses,url_prefix='')
app.register_blueprint(departments,url_prefix='')
app.register_blueprint(reviewCourses,url_prefix='/reviews')
app.register_blueprint(reviewDepartment,url_prefix='/reviews')
app.register_blueprint(reviewProfessors,url_prefix='/reviews')
app.register_blueprint(reviewUniversity,url_prefix='/reviews')



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






if __name__ == '__main__':
    app.run()
