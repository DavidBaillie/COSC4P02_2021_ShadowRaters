# app/views/university.py

from flask import Blueprint, render_template

university = Blueprint('university',__name__,url_prefix='/university')

@university.route('/')
def test():
    #return render_template('univerisity/a_page.html')
    return "university"