from flask import Flask
from sshtunnel import SSHTunnelForwarder
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base


app = Flask(__name__)
server = SSHTunnelForwarder(
    ('51.222.151.27',22),
    ssh_private_key = "C:\\Users\\wsh41\\.ssh\\id_rsa",
    ssh_username='root',
    remote_bind_address=('localhost',5432))
server.start()
print("server connected")

#app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:123456@localhost:5432/testDB'

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:COSC4P02Raters@localhost:5432/postgres'
db = SQLAlchemy(app)

Base = automap_base()
Base.prepare(db.engine,reflect=True)
user_table = Base.classes.user
course_table = Base.classes.courses
rating_course_table = Base.classes.rating_course
department_table = Base.classes.departments
rating_department_table = Base.classes.rating_department
professor_table = Base.classes.professor
rating_professor_table = Base.classes.rating_professor
university_table = Base.classes.university
rating_university_table = Base.classes.rating_university

