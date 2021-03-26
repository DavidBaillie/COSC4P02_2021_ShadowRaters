from . import *

createUser = Blueprint('createUser',__name__,url_prefix='')

@createUser.route('/createUser',methods=["POST"])
def createNewUser():
    newUser = request.get_json()
    uuid = binascii.b2a_hex(os.urandom(15))
    uuid = str(uuid,encoding="utf-8")
    admin = newUser.get("admin")
    username = newUser.get("username")
    email = newUser.get("email")
    password = newUser.get("password")
    salt = ''.join(random.sample(string.ascii_letters + string.digits,10))
    password = sha256(salt.encode()+password.encode()).hexdigest()
    school = newUser.get("school")
    program = newUser.get("program")
    if not all([username,password]):
        return jsonify(msg="missing admin, username or password")
    curs.execute("select * from \"user\" where username = '%s'" % username)
    data = curs.fetchone()
    #print(data)
    if(data is not None):
        return jsonify(msg="username already exist")
    curs.execute("insert into \"user\" "
                 "values('%s','%s','%s','%s','%s','%s','%s','%s')" % (uuid,admin,username,email,password,salt,school,program))
    conn.commit()
    return jsonify(msg="sign up success")