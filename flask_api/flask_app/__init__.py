from flask import Flask
from flask_httpauth import HTTPBasicAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
from sshtunnel import SSHTunnelForwarder
import psycopg2
from flask_cors import *
from .views import createUser,signIn,signOut,professors,session,courses,departments,reviewCourses,reviewDepartment,reviewProfessors,reviewUniversity
app = Flask(__name__)
app.secret_key = "adaslccadw"
auth = HTTPBasicAuth()
SECRET_KEY = "qbsacasd"
CORS(app,supports_credentials=True)
app.register_blueprint(createUser.createUser)
app.register_blueprint(signIn.signIn)
app.register_blueprint(signOut.signOut)
app.register_blueprint(professors.professors)
#app.register_blueprint(session.session)
app.register_blueprint(courses.courses)
app.register_blueprint(departments.departments)
app.register_blueprint(reviewCourses.reviewCourses)
app.register_blueprint(reviewDepartment.reviewDepartment)
app.register_blueprint(reviewProfessors.reviewProfessors)
app.register_blueprint(reviewUniversity.reviewUniversity)