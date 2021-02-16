from flask import Flask,jsonify,request
from sshtunnel import SSHTunnelForwarder
import psycopg2
import os,binascii
app = Flask(__name__)

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
    curs.execute("select version()")
    data = curs.fetchone()
    print(data)
    return "%s" % data

@app.route("/sign_up",methods=["POST"])
def createNewUser():
    newUser = request.get_json()
    uuid = binascii.b2a_hex(os.urandom(15))
    uuid = str(uuid,encoding="utf-8")
    admin = newUser.get("admin")
    username = newUser.get("username")
    email = newUser.get("email")
    password = newUser.get("password")
    salt = "ABCDEFGHIJ"
    school = newUser.get("school")
    program = newUser.get("program")
    if(admin is None or username is None or password is None):
        return jsonify(code=400,msg="missing admin, username or password")
    curs.execute("select * from \"user\" where username = '%s'" % username)
    data = curs.fetchall()
    #print(data)
    if(data is not None):
        return jsonify(code=400,msg="username already exist")
    curs.execute("insert into \"user\" "
                 "values('%s','%s','%s','%s','%s','%s','%s','%s')" % (uuid,admin,username,email,password,salt,school,program))
    curs.execute("select * from \"user\"")
    #print(curs.fetchall())
    conn.commit()
    return jsonify(code=200,msg="sign up success")

@app.route("/Professors",methods=["GET"])
def getProfessorsInfo():
    curs.execute("select * from professor")
    info = curs.fetchall()
    if info is None:
        return jsonify(code=400,msg="empty table")
    data = []
    content = {}
    for i in info:
        content = {'pid':i[0],'uid':i[1],'did':i[2],'name':i[3],'info':i[4]}
        data.append(content)
        content={}
    return jsonify(data)



if __name__ == '__main__':
    app.run()
