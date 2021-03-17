from . import *

professors = Blueprint('professors',__name__,url_prefix='')

@professors.route("/Professors/",methods=["GET"])
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