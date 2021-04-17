from flask import Blueprint,jsonify,request,current_app,url_for
from . import db,user_table,mail
import os,binascii
import random, string
from hashlib import sha256
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature,SignatureExpired
from flask_mail import Message

user = Blueprint('user',__name__,url_prefix='/user')

def generate_token(uuid,expires):
    expiration = expires
    s = Serializer(current_app.config['SECRET_KEY'],expires_in=expiration)
    token = s.dumps({'uuid': uuid}).decode("ascii")
    return token

def verify_auth_token(token):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except SignatureExpired:
        return None
    except BadSignature:
        return None
    return data['uuid']

def send_email(token,email):
    msg = Message("Request Password Reset",
                  sender=current_app.config.get('MAIL_USERNAME'),
                  recipients=[email])
    link = url_for('user.confirm_reset_password',token=token,_external=True)
    msg.body = 'Click the link if you want to reset your password: {}'.format(link)
    mail.send(msg)
    return None


@user.route('/createAccount',methods=["POST"])
def createNewUser():
    newUser = request.get_json()
    uuid = binascii.b2a_hex(os.urandom(15))

    admin = newUser.get("admin")
    username = newUser.get("username")
    email = newUser.get("email")
    password = newUser.get("password")
    if password is None:
        return jsonify({'msg':'error'})
    salt = ''.join(random.sample(string.ascii_letters + string.digits, 10))
    password = sha256(salt.encode() + password.encode()).hexdigest()
    school = newUser.get("school")
    program = newUser.get("program")

    try:
        db.session.add(user_table(uuid=uuid,admin=admin,username=username,email=email,password=password,salt=salt,school=school,program=program))
        db.session.commit()
        return jsonify({'msg':'success'})
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'msg':'error'})

@user.route('/login',methods=["POST"])
def login():
    info = request.get_json()
    token = info.get('token')
    if token:
        data = verify_auth_token(token)
        if data:
            u = db.session.query(user_table).filter_by(uuid=data).first()
            if u:
                return jsonify(uuid=u.uuid,msg="login success",username=u.username,email=u.email)
            else:
                return jsonify(msg="invalid or expired token")
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
                    new_token = generate_token(data.uuid,3600*24)
                    return jsonify(uuid=data.uuid,msg="login success",token=new_token,username=data.username,email=data.email)
                else:
                    return jsonify(msg="wrong password")
            else:
                return jsonify(msg="username not exist")
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify(msg="error")

@user.route('/changePassword',methods=["POST"])
def changePassword():
    info = request.get_json()
    newPassword = info.get('password')
    token = info.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    try:
        user = db.session.query(user_table).filter_by(uuid=uuid).first()
        if user is None:
            return jsonify(msg="user not exist")
        user.password = sha256(user.salt.encode()+newPassword.encode()).hexdigest()
        db.session.merge(user)
        db.session.commit()
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")

@user.route('/resetPassword',methods=["POST"])
def resetPassword():
    info = request.get_json()
    username = info.get('username')
    email = info.get('email')
    if not all([username,email]):
        return jsonify(msg="missing username or email")
    try:
        user = db.session.query(user_table).filter_by(username=username,email=email).first()
        if user is None:
            return jsonify(msg="username or email wrong")
        uuid = user.uuid
        token = generate_token(uuid,600)
        send_email(token=token,email=email)
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")

@user.route('/confirm_reset_password/<token>',methods=['GET'])
def confirm_reset_password(token):
    try:
        uuid = verify_auth_token(token)
        user = db.session.query(user_table).filter_by(uuid=uuid).first()
        newPassword = binascii.b2a_hex(os.urandom(10))
        user.password = sha256(user.salt.encode()+newPassword.encode()).hexdigest()
        db.session.merge(user)
        db.session.commit()
        return '<h2>Your new password is {}</h2>'.format(newPassword)
    except Exception as e:
        print(e)
        return '<h1>The token is invalid or expired</h1>'