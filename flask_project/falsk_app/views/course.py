from flask import Blueprint,jsonify,request,session
from . import db,course_table,rating_course_table,user_table,university_table,department_table,professor_table,vote_course_table
import os,binascii
from user import verify_auth_token
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
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'msg':'error'})
@course.route('/reviews/<cid>',methods=["GET","POST"])
def courseReviews(cid):
    if request.method == "POST":
        newReview = request.get_json()
        token = newReview.get('token')
        if token is None or verify_auth_token(token) is None:
            return jsonify(msg="invalid or expired token")

        rcid = binascii.b2a_hex(os.urandom(15))
        uuid = verify_auth_token(token)
        try:
            data = db.session.query(rating_course_table).filter_by(uuid=uuid,cid=cid).all()
            if data != []:
                return jsonify(msg="error, already rated")
            else:
                date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                review = rating_course_table(rcid=rcid,uuid=uuid,cid=cid,score=newReview.get('score'),duration=newReview.get("duration"),comment=newReview.get("comment"),num_agree=0,num_disagree=0,date=date)
                db.session.add(review)
                db.session.commit()
                return jsonify(msg="success")
        except Exception as e:
            print(e)
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
        except Exception as e:
            print(e)
            return jsonify({'msg':'error'})

@course.route('/reviews/vote_agree/<rcid>',methods=["POST"])
def voteCourseReview_agree(rcid):
    vote = request.get_json()
    token = vote.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    vcid = binascii.b2a_hex(os.urandom(15))
    try:
        data = db.session.query(vote_course_table).filter_by(uuid=uuid, rcid=rcid).first()
        if data is not None:
            return jsonify(msg="already vote")
        vote = vote_course_table(vcid=vcid,uuid=uuid,rcid=rcid,flag=0)
        db.session.add(vote)
        review = db.session.query(rating_course_table).filter_by(rcid=rcid).first()
        review.num_agree += 1
        db.session.merge(review)
        db.session.commit()
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")


@course.route('/reviews/vote_disagree/<rcid>',methods=["POST"])
def voteCourseReview_disagree(rcid):
    vote = request.get_json()
    token = vote.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    vcid = binascii.b2a_hex(os.urandom(15))
    try:
        data = db.session.query(vote_course_table).filter_by(uuid=uuid, rcid=rcid).first()
        if data is not None:
            return jsonify(msg="already vote")
        vote = vote_course_table(vcid=vcid, uuid=uuid, rcid=rcid, flag=1)
        db.session.add(vote)
        review = db.session.query(rating_course_table).filter_by(rcid=rcid).first()
        review.num_disagree += 1
        db.session.merge(review)
        db.session.commit()
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")

@course.route('/reviews/vote_cancle/<rcid>',methods=["POST"])
def voteCouresReview_cancel(rcid):
    vote = request.get_json()
    token = vote.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    try:
        data = db.session.query(vote_course_table).filter_by(uuid=uuid, rcid=rcid).first()
        if data is None:
            return jsonify(msg="vote not exist")
        review = db.session.query(rating_course_table).filter_by(rcid=rcid).first()
        if data.flag == 0:
            review.num_agree -= 1
        elif data.flag == 1:
            review.num_disagree -= 1
        db.session.query(vote_course_table).filter_by(uuid=uuid, rcid=rcid).delete()
        db.session.merge(review)
        db.session.commit()
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")

@course.route('/getVotes',methods=['POST'])
def getVotes():
    info = request.get_json()
    token = info.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    try:
        votes = db.session.query(vote_course_table).filter_by(uuid=uuid).all()
        res = []
        for i in votes:
            content = {'rcid':i.rcid,'flag':i.flag}
            res.append(content)
        return jsonify(msg="success",votes=res)
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")