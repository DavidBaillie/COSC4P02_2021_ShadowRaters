from . import *


reviewCourses = Blueprint('reviewCourses',__name__,url_prefix='/reviews')

@reviewCourses.route("/courses",methods=["GET","POST"])
def courseReviews():
    if request.method == 'POST':
        newReview = request.get_json()
        rcid = binascii.b2a_hex(os.urandom(15))
        rcid = str(rcid,encoding="utf-8")
        uuid = newReview.get('uuid')
        cid = newReview.get('cid')
        curs.execute("select * from rating_professor where uuid = '%s' and cid = '%s'" % (uuid, cid))
        info = curs.fetchall()
        if info is not None:
            return jsonify(msg="already rated")
        score = newReview.get('score')
        duration = newReview.get('duration')
        comment = newReview.get('comment')
        num_agree = 0
        num_disagree = 0
        if not all([uuid,cid,score]):
            return jsonify(msg="not enough data")
        curs.execute("insert into rating_course "
                     "values('%s','%s','%s','%s','%s','%s','%s','%s')" % (rcid,uuid,cid,score,duration,comment,num_agree,num_disagree))
        conn.commit()
        return jsonify(msg="success")
    else:
        curs.execute("select * from rating_course")
        info = curs.fetchall()
        if info is None:
            return jsonify(msg="empty table")
        reviews=[]
        for i in info:
            content = {'rpid':i[0],'uuid':i[1],'pid':i[2],'score':i[3],'duration':i[4],'comment':i[5],'num_agree':i[6],'num_disagree':i[7]}
            reviews.append(content)
        data = {'msg':"success",'reviews':reviews}
        return jsonify(data)