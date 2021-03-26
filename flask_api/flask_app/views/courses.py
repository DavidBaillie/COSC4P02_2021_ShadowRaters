from . import *

courses = Blueprint('courses',__name__,url_prefix='')

@courses.route("/Courses",methods=["GET"])
def getCoursesInfo():
    curs.execute("select * from course")
    info = curs.fetchall()
    if info is None:
        return jsonify(msg="empty table")
    courses = []
    for i in info:
        content = {'cid':i[0],'pid':i[1],'uid':i[2],'did':i[3],'name':i[4],'info':i[5]}
        courses.append(content)
    data = {'msg':"success",'courses':courses}
    return jsonify(data)