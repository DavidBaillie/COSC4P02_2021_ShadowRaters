from flask import Blueprint,jsonify,request,session
from . import db,university_table,rating_university_table,user_table,vote_university_table
import os,binascii
import time
from user import verify_auth_token

university = Blueprint('university',__name__,url_prefix='/university')

@university.route('/',methods=["GET"])
def getUniversityInfo():
    try:
        print("1")
        data = db.session.query(university_table).all()
        res = []
        for i in data:
            content = {'uid':i.uid,'name':i.name,'info':i.info,'address':i.address,'website':i.website,'food':i.food,'scholarships':i.scholarships,'facilities':i.facilities,'student_life':i.student_life,'cleanliness':i.cleanliness}
            res.append(content)
        return jsonify({'msg':"success",'university':res})
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'msg':'error'})
@university.route('/reviews/<uid>',methods=["GET","POST"])
def universityReviews(uid):
    if request.method == "POST":
        newReview = request.get_json()
        token = newReview.get('token')
        if token is None or verify_auth_token(token) is None:
            return jsonify(msg="invalid or expired token")

        ruid = binascii.b2a_hex(os.urandom(15))
        uuid = verify_auth_token(token)
        try:
            data = db.session.query(rating_university_table).filter_by(uuid=uuid,uid=uid).all()
            if data != []:
                return jsonify(msg="error, already rated")
            else:
                date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                review = rating_university_table(ruid=ruid,uuid=uuid,uid=uid,score=newReview.get("score"),comment=newReview.get("comment"),num_agree=0,num_disagree=0,date=date)
                db.session.add(review)
                db.session.commit()
                return jsonify(msg="success")
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify({'msg': 'error'})
    else:
        try:
            data = db.session.query(rating_university_table).filter_by(uid=uid).all()
            res = []
            for i in data:
                uuid = i.uuid
                j = db.session.query(user_table).filter_by(uuid=uuid).first()
                username = j.username
                content = {'ruid':i.ruid,'username':username,'uid':i.uid,'score':i.score,'comment':i.comment,'num_agree':i.num_agree,'num_disagree':i.num_disagree,'date':i.date}
                res.append(content)
            return jsonify({'msg':"success",'reviews':res})
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify({'msg': 'error'})

@university.route('/reviews/vote_agree/<ruid>',methods=["POST"])
def voteUniversityReview_agree(ruid):
    vote = request.get_json()
    token = vote.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    vuid = binascii.b2a_hex(os.urandom(15))
    try:
        data = db.session.query(vote_university_table).filter_by(uuid=uuid, ruid=ruid).first()
        if data is not None:
            return jsonify(msg="already vote")
        vote = vote_university_table(vpid=vuid,uuid=uuid,ruid=ruid,flag=0)
        db.session.add(vote)
        review = db.session.query(rating_university_table).filter_by(ruid=ruid).first()
        review.num_agree += 1
        db.session.merge(review)
        db.session.commit()
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")


@university.route('/reviews/vote_disagree/<ruid>',methods=["POST"])
def voteUniversityReview_disagree(ruid):
    vote = request.get_json()
    token = vote.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    vuid = binascii.b2a_hex(os.urandom(15))
    try:
        data = db.session.query(vote_university_table).filter_by(uuid=uuid, ruid=ruid).first()
        if data is not None:
            return jsonify(msg="already vote")
        vote = vote_university_table(vuid=vuid, uuid=uuid, ruid=ruid, flag=1)
        db.session.add(vote)
        review = db.session.query(rating_university_table).filter_by(ruid=ruid).first()
        review.num_disagree += 1
        db.session.merge(review)
        db.session.commit()
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")

@university.route('/reviews/vote_cancle/<ruid>',methods=["POST"])
def voteProfessorReview_cancel(ruid):
    vote = request.get_json()
    token = vote.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    try:
        data = db.session.query(vote_university_table).filter_by(uuid=uuid, ruid=ruid).first()
        if data is None:
            return jsonify(msg="vote not exist")
        review = db.session.query(rating_university_table).filter_by(ruid=ruid).first()
        if data.flag == 0:
            review.num_agree -= 1
        elif data.flag == 1:
            review.num_disagree -= 1
        db.session.query(vote_university_table).filter_by(uuid=uuid, ruid=ruid).delete()
        db.session.merge(review)
        db.session.commit()
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")

@university.route('/getVotes',methods=['POST'])
def getVotes():
    info = request.get_json()
    token = info.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    try:
        votes = db.session.query(vote_university_table).filter_by(uuid=uuid).all()
        res = []
        for i in votes:
            content = {'ruid':i.ruid,'flag':i.flag}
            res.append(content)
        return jsonify(msg="success",votes=res)
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")