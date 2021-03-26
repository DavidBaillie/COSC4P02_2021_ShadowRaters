from flask import Blueprint,jsonify,request,current_app,session
from . import db,user_table
import os,binascii
import random, string
from hashlib import sha256
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature,SignatureExpired

user = Blueprint('user',__name__,url_prefix='/user')

def generate_token(uuid):
    expiration = 3600
    s = Serializer(current_app.config['SECRET_KEY'],expires_in=expiration)
    token = s.dumps({'uuid': uuid}).decode('ascii')
    return token

def verify_auth_token(token):
    s =Serializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except SignatureExpired:
        return None
    except BadSignature:
        return None
    return data['uuid']


@user.route('/createAccount',methods=["POST"])
def createNewUser():
    newUser = request.get_json()
    uuid = binascii.b2a_hex(os.urandom(15))
    #uuid = str(uuid, encoding="utf-8")
    admin = newUser.get("admin")
    username = newUser.get("username")
    email = newUser.get("email")
    password = newUser.get("password")
    salt = ''.join(random.sample(string.ascii_letters + string.digits, 10))
    password = sha256(salt.encode() + password.encode()).hexdigest()
    school = newUser.get("school")
    program = newUser.get("program")

    try:
        db.session.add(user_table(uuid=uuid,admin=admin,username=username,email=email,password=password,salt=salt,school=school,program=program))
        db.session.commit()
        return jsonify({'msg':'success'})
    except:
        db.session.rollback()
        return jsonify({'msg':'error'})

@user.route('/login',methods=["POST"])
def login():
    if session.get('uuid'):
        return jsonify(msg="already login")
    info = request.get_json()
    token = info.get('token')
    if token:
        data = verify_auth_token(token)
        if data:
            u = db.session.query(user_table).filter_by(uuid=data).first()
            if u:
                session['uuid'] = u.uuid
                return jsonify(uuid=u.uuid,msg="login success")
            else:
                return jsonify(msg="user not exist")
        else:
            return jsonify(msg="invalid or expired token")
    else:
        username = info.get('username')
        password = info.get('password')
        if not all([username,password]):
            return jsonify(msg="missing username or password")
        try:
            data = db.session.query(user_table).filter_by(username=username).first()
            if data:
                salt = data.salt
                if data.password == sha256(salt.encode()+password.encode()).hexdigest():
                    new_token = generate_token(data.uuid)
                    session['uuid'] = data.uuid
                    return jsonify(uuid=data.uuid,msg="login success",token=new_token)
                else:
                    return jsonify(msg="wrong password")
            else:
                return jsonify(msg="username not exist")
        except:
            db.session.rollback()
            return jsonify(msg="error")

@user.route('/logout',methods=["GET"])
def logout():
    if session.get('uuid') is None:
        return jsonify(msg="not login yet")
    session.clear()
    return jsonify(msg="logout success")