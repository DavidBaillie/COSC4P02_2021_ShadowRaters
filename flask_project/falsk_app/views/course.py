from flask import Blueprint,jsonify,request,session
from . import db,course_table,rating_course_table,user_table,university_table,department_table,professor_table
import os,binascii
import time


course = Blueprint('course',__name__,url_prefix='/course')

@course.route('/',methods=["GET"])
def getCourseInfo():
    try:
        data = db.session.query(course_table).all()
        res = []
        for i in data:
            university_name = db.session.query(university_table).filter_by(uid=i.uid).first().name
            department_name = db.session.query(department_table).filter_by(did=i.did).first().name
            professor_name = db.session.query(professor_table).filter_by(pid=i.pid).first().name
            content = {'cid':i.cid,'pid':i.pid,'professor':professor_name,'uid':i.uid,'university':university_name,'did':i.did,'department':department_name,'name':i.name,'info':i.info}
            res.append(content)
        return jsonify({'msg':"success",'course':res})
    except:
        db.session.rollback()
        return jsonify({'msg':'error'})
@course.route('/reviews/<cid>',methods=["GET","POST"])
def courseReviws(cid):
    if request.method == "POST":
        if session.get('uuid') is None:
            return jsonify(msg="error, login first")
        newReview = request.get_json()
        rcid = binascii.b2a_hex(os.urandom(15))

        uuid = newReview.get("uuid")
        try:
            data = db.session.query(rating_course_table).filter_by(uuid=uuid,cid=cid).all()
            if data != []:
                return jsonify(msg="error, already rated")
            else:
                date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                review = rating_course_table(rcid=rcid,uuid=uuid,cid=cid,score=newReview.get('score'),duration=newReview.get("duration"),comment=newReview.get("comment"),num_agree=0,num_disagree=0,date=date)
                db.session.add(review)
                db.session.commit()
        except:
            db.session.rollback()
            return jsonify({'msg': 'error'})
    else:
        try:
            data = db.session.query(rating_course_table).filter_by(cid=cid).all()
            res = []
            for i in data:
                uuid = i.uuid
                j = db.session.query(user_table).filter_by(uuid=uuid).first()
                username = j.username
                content = {'rcid':i.rcid,'username':username,'cid':i.cid,'score':i.score,'duration':i.duration,'comment':i.comment,'num_agree':i.num_agree,'num_disagree':i.num_disagree,'date':i.date}
                res.append(content)
            return jsonify({'msg':"success",'reviews':res})
        except:
            return jsonify({'msg':'error'})
