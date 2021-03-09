# app/views/course.py

from flask import Blueprint,render_template

course = Blueprint('course',__name__)

@course.route('/')
def test():
    return "course"