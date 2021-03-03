from flask import Flask
from views.university import university
from views.course import course

app = Flask(__name__)
app.register_blueprint(university,url_prefix='/university')
app.register_blueprint(course,url_prefix='/course')

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':
    app.run()
