from flask import Blueprint,jsonify,request
from . import db,university_table,rating_university_table
import os,binascii
import time


university = Blueprint('university',__name__,url_prefix='/university')

@university.route('/',methods=["GET"])
def getUniversityInfo():
    try:
        data = db.session.query(university_table).all()
        res = []
        for i in data:
            content = {'uid':i.uid,'name':i.name,'info':i.info,'address':i.address,'website':i.website,'food':i.food,'scholarships':i.scholarships,'facilities':i.facilities,'student_life':i.student_life,'cleanliness':i.cleanliness}
            res.append(content)
        return jsonify({'msg':"success",'university':res})
    except:
        db.session.rollback()
        return jsonify({'msg':'error'})
@university.route('/reviews/<uid>',methods=["GET","POST"])
def universityReviws(uid):
    if request.method == "POST":
        newReview = request.get_json()
        ruid = binascii.b2a_hex(os.urandom(15))

        uuid = newReview.get("uuid")
        try:
            data = db.session.query(rating_university_table).filter_by(uuid=uuid,uid=uid).all()
            if data != []:
                return jsonify(msg="error, already rated")
            else:
                date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                review = rating_university_table(ruid=ruid,uuid=uuid,uid=uid,score=newReview.get("score"),comment=newReview.get("comment"),num_agree=0,num_disagree=0,date=date)
                db.session.add(review)
                db.session.commit()
        except:
            db.session.rollback()
            return jsonify({'msg': 'error'})
    else:
        try:
            data = db.session.query(rating_university_table).filter_by(uid=uid).all()
            res = []
            for i in data:
                content = {'ruid':i.ruid,'uuid':i.uuid,'uid':i.uid,'score':i.score,'comment':i.comment,'num_agree':i.num_agree,'num_disagree':i.num_disagree,'date':i.date}
                res.append(content)
            return jsonify({'msg':"success",'reviews':res})
        except:
            db.session.rollback()
            return jsonify({'msg': 'error'})