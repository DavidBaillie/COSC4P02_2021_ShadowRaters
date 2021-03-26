from . import *


reviewProfessors = Blueprint('reviewProfessors',__name__,url_prefix='/reviews')

@reviewProfessors.route("/professors/<pid>",methods=["GET","POST"])
def professorReviews(pid):
    if request.method == 'POST':
        newReview = request.get_json()
        rpid = binascii.b2a_hex(os.urandom(15))
        rpid = str(rpid,encoding="utf-8")
        uuid = newReview.get('uuid')
        pid = newReview.get('pid')
        curs.execute("select * from rating_professor where uuid = '%s' and pid = '%s'" % (uuid,pid))
        info = curs.fetchone()
        print(info)
        if info is not None:
            return jsonify(msg="already rated")
        score = newReview.get('score')
        comment = newReview.get('comment')
        num_agree = 0
        num_disagree = 0
        if not all([uuid,pid,score]):
            return jsonify(msg="not enough data")
        curs.execute("insert into rating_professor "
                     "values('%s','%s','%s','%s','%s','%s','%s')" % (rpid,uuid,pid,score,comment,num_agree,num_disagree))
        conn.commit()
        return jsonify(msg="success")
    else:
        print(type(pid))
        curs.execute("select * from rating_professor where pid = '%s'" % pid)
        #curs.execute("select * from rating_professor")
        info = curs.fetchall()
        if info is None:
            return jsonify(msg="empty table")
        reviews=[]
        for i in info:
            content = {'rpid':i[0],'uuid':i[1],'pid':i[2],'score':i[3],'comment':i[4],'num_agree':i[5],'num_disagree':i[6]}
            reviews.append(content)
        data = {'msg':"success",'reviews':reviews}
        return jsonify(data)