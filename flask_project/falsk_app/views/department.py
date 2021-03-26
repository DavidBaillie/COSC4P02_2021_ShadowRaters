#app\views\department.py
from flask import Blueprint,jsonify,request
from . import db,department_table,rating_department_table
import os,binascii
import time


department = Blueprint('department',__name__,url_prefix='/department')

@department.route('/',methods=["GET"])
def getDepartmentInfo():
    try:
        data = db.session.query(department_table).all()
        res = []
        for i in data:
            content = {'did':i.did,'uid':i.uid,'name':i.name,'info':i.info,'equipment':i.equipment,'education_support':i.education_support}
            res.append(content)
        return jsonify({'msg':"success",'department':res})
    except:
        db.session.rollback()
        return jsonify({'msg':'error'})
@department.route('/reviews/<did>',methods=["GET","POST"])
def courseReviws(did):
    if request.method == "POST":
        newReview = request.get_json()
        rdid = binascii.b2a_hex(os.urandom(15))

        uuid = newReview.get("uuid")
        try:
            data = db.session.query(rating_department_table).filter_by(uuid=uuid,did=did).all()
            if data != []:
                return jsonify(msg="error, already rated")
            else:
                date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                review = rating_department_table(rdid=rdid,uuid=uuid,did=did,score=newReview.get("score"),comment=newReview.get("comment"),num_agree=0,num_disagree=0,date=date)
                db.session.add(review)
                db.session.commit()
        except:
            db.session.rollback()
            return jsonify({'msg': 'error'})
    else:
        try:
            data = db.session.query(rating_department_table).filter_by(did=did).all()
            res = []
            for i in data:
                content = {'rdid':i.rdid,'uuid':i.uuid,'did':i.did,'score':i.score,'comment':i.comment,'num_agree':i.num_agree,'num_disagree':i.num_disagree,'date':i.date}
                res.append(content)
            return jsonify({'msg':"success",'reviews':res})
        except:
            db.session.rollback()
            return jsonify({'msg': 'error'})
