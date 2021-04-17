from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from flask_mail import Mail

app = Flask(__name__)
# server = SSHTunnelForwarder(
#     ('51.222.151.27',22),
#     ssh_private_key = "C:\\Users\\wsh41\\.ssh\\id_rsa",
#     ssh_username='root',
#     remote_bind_address=('localhost',5432))
# server.start()
# print("server connected")

#app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:123456@localhost:5432/testDB'

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:COSC4P02Raters@localhost:5432/postgres'

mail_settings={
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": "cosc4p02ShadowRaters@gmail.com",
    "MAIL_PASSWORD": "sr_123456"
}

app.config.update(mail_settings)

mail = Mail(app)

db = SQLAlchemy(app)

Base = automap_base()
Base.prepare(db.engine,reflect=True)
user_table = Base.classes.user
course_table = Base.classes.course
rating_course_table = Base.classes.rating_course
vote_course_table = Base.classes.vote_course
department_table = Base.classes.department
rating_department_table = Base.classes.rating_department
vote_department_table = Base.classes.vote_department
professor_table = Base.classes.professor
rating_professor_table = Base.classes.rating_professor
vote_professor_table = Base.classes.vote_professor
university_table = Base.classes.university
rating_university_table = Base.classes.rating_university
vote_university_table = Base.classes.vote_university
