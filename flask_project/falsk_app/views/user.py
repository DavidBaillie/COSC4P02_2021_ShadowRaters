from flask import Blueprint,jsonify,request
from . import db,user_table
import os,binascii
import random, string
from hashlib import sha256


user = Blueprint('createUser',__name__,url_prefix='/user')

@user.route('/',methods=["POST"])
def createNewUser():
    newUser = request.get_json()
    uuid = binascii.b2a_hex(os.urandom(15))
    uuid = str(uuid, encoding="utf-8")
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
