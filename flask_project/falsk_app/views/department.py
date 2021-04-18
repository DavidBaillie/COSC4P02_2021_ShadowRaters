from flask import Blueprint,jsonify,request,session
from . import db,department_table,rating_department_table,user_table,university_table,vote_department_table
import os,binascii
import time
from user import verify_auth_token

department = Blueprint('department',__name__,url_prefix='/department')

@department.route('/',methods=["GET"])
def getDepartmentInfo():
    try:
        data = db.session.query(department_table).all()
        res = []
        for i in data:
            university_name = db.session.query(university_table).filter_by(uid=i.uid).first().name
            content = {'did':i.did,'uid':i.uid,'university':university_name,'name':i.name,'info':i.info,'equipment':i.equipment,'education_support':i.education_support}
            res.append(content)
        return jsonify({'msg':"success",'department':res})
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'msg':'error'})
@department.route('/reviews/<did>',methods=["GET","POST"])
def departmentReviews(did):
    if request.method == "POST":
        newReview = request.get_json()
        token = newReview.get('token')
        if token is None or verify_auth_token(token) is None:
            return jsonify(msg="invalid or expired token")

        rdid = binascii.b2a_hex(os.urandom(15))
        uuid = verify_auth_token(token)
        try:
            data = db.session.query(rating_department_table).filter_by(uuid=uuid,did=did).all()
            if data != []:
                return jsonify(msg="error, already rated")
            else:
                date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                review = rating_department_table(rdid=rdid,uuid=uuid,did=did,score=newReview.get("score"),comment=newReview.get("comment"),num_agree=0,num_disagree=0,date=date)
                db.session.add(review)
                db.session.commit()
                return jsonify(msg="success")
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify({'msg': 'error'})
    else:
        try:
            data = db.session.query(rating_department_table).filter_by(did=did).all()
            res = []
            for i in data:
                uuid = i.uuid
                j = db.session.query(user_table).filter_by(uuid=uuid).first()
                username = j.username
                content = {'rdid':i.rdid,'username':username,'did':i.did,'score':i.score,'comment':i.comment,'num_agree':i.num_agree,'num_disagree':i.num_disagree,'date':i.date}
                res.append(content)
            return jsonify({'msg':"success",'reviews':res})
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify({'msg': 'error'})

@department.route('/reviews/vote_agree/<rdid>',methods=["POST"])
def voteDepaartmentReview_agree(rdid):
    vote = request.get_json()
    token = vote.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    vdid = binascii.b2a_hex(os.urandom(15))
    try:
        data = db.session.query(vote_department_table).filter_by(uuid=uuid, rdid=rdid).first()
        if data is not None:
            return jsonify(msg="already vote")
        vote = vote_department_table(vdid=vdid,uuid=uuid,rdid=rdid,flag=0)
        db.session.add(vote)
        review = db.session.query(rating_department_table).filter_by(rdid=rdid).first()
        review.num_agree += 1
        db.session.merge(review)
        db.session.commit()
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")


@department.route('/reviews/vote_disagree/<rdid>',methods=["POST"])
def voteDepartmentReview_disagree(rdid):
    vote = request.get_json()
    token = vote.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    vdid = binascii.b2a_hex(os.urandom(15))
    try:
        data = db.session.query(vote_department_table).filter_by(uuid=uuid, rdid=rdid).first()
        if data is not None:
            return jsonify(msg="already vote")
        vote = vote_department_table(vdid=vdid, uuid=uuid, rdid=rdid, flag=1)
        db.session.add(vote)
        review = db.session.query(rating_department_table).filter_by(rdid=rdid).first()
        review.num_disagree += 1
        db.session.merge(review)
        db.session.commit()
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")

@department.route('/reviews/vote_cancle/<rdid>',methods=["POST"])
def voteDepartmentReview_cancel(rdid):
    vote = request.get_json()
    token = vote.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    try:
        data = db.session.query(vote_department_table).filter_by(uuid=uuid, rdid=rdid).first()
        if data is None:
            return jsonify(msg="vote not exist")
        review = db.session.query(rating_department_table).filter_by(rdid=rdid).first()
        if data.flag == 0:
            review.num_agree -= 1
        elif data.flag == 1:
            review.num_disagree -= 1
        db.session.query(vote_department_table).filter_by(uuid=uuid, rdid=rdid).delete()
        db.session.merge(review)
        db.session.commit()
        return jsonify(msg="success")
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")

@department.route('/getVotes',methods=['POST'])
def getVotes():
    info = request.get_json()
    token = info.get('token')
    if token is None or verify_auth_token(token) is None:
        return jsonify(msg="invalid or expired token")
    uuid = verify_auth_token(token)
    try:
        votes = db.session.query(vote_department_table).filter_by(uuid=uuid).all()
        res = []
        for i in votes:
            content = {'rdid':i.rdid,'flag':i.flag}
            res.append(content)
        return jsonify(msg="success",votes=res)
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify(msg="error")