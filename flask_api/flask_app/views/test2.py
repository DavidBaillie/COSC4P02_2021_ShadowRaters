from flask import Blueprint

t2 = Blueprint('t2',__name__,url_prefix='/test2')

@t2.route('/')
def test1():
    return 'test2'