from . import *


departments = Blueprint('departments',__name__,url_prefix='')

@departments.route("/Departments",methods=["GET"])
def getDepartmentsInfo():
    curs.execute("select * from department")
    info = curs.fetchall()
    if info is None:
        return jsonify(msg="empty table")
    departments = []
    for i in info:
        content = {'did':i[0],'uid':i[1],'name':i[2],'info':i[3],'equipement':i[4],'education_support':i[5]}
        departments.append(content)
    data = {'msg':"success",'departments':departments}
    return jsonify(data)