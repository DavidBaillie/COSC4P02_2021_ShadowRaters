from flask import Blueprint,jsonify,request
from . import db,professor_table,rating_professor_table
import os,binascii
import time


professor = Blueprint('professor',__name__,url_prefix='/professor')

@professor.route('/',methods=["GET"])
def getprofessorInfo():
    try:
        data = db.session.query(professor_table).all()
        res = []
        for i in data:
            content = {'pid':i.pid,'uid':i.uid,'did':i.did,'name':i.name,'info':i.info}
            res.append(content)
        return jsonify({'msg':"success",'professor':res})
    except:
        db.session.rollback()
        return jsonify({'msg':'error'})
@professor.route('/reviews/<pid>',methods=["GET","POST"])
def professorReviws(pid):
    if request.method == "POST":
        newReview = request.get_json()
        rpid = binascii.b2a_hex(os.urandom(15))
        uuid = newReview.get("uuid")
        try:
            data = db.session.query(rating_professor_table).filter_by(uuid=uuid,pid=pid).all()
            if data != []:
                return jsonify({'msg':"error, already rated"})
            else:
                date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                review = rating_professor_table(rpid=rpid,uuid=uuid,pid=pid,score=newReview.get("score"),comment=newReview.get("comment"),num_agree=0,num_disagree=0,date=date)
                db.session.add(review)
                db.session.commit()
                return jsonify(msg="success")
        except:
            db.session.rollback()
            return jsonify({'msg': "error"})
    else:
        try:
            data = db.session.query(rating_professor_table).filter_by(pid=pid).all()
            res = []
            for i in data:
                content = {'rpid':i.rpid,'uuid':i.uuid,'pid':i.pid,'score':i.score,'comment':i.comment,'num_agree':i.num_agree,'num_disagree':i.num_disagree,'date':i.date}
                res.append(content)
            return jsonify({'msg':"success",'reviews':res})
        except:
            db.session.rollback()
            return jsonify({'msg': 'error'})