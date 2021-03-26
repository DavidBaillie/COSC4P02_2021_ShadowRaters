from flask import Blueprint,render_template

t1 = Blueprint('t1',__name__,url_prefix='/test1')

@t1.route('/')
def test1():
    return render_template('test1.html')