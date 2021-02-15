import psycopg2
from flask import Flask

app = Flask(__name__)
#conn = psycopg2.connect(
#    host="51.222.151.27",
#    database="postgres",
#    user="root",
#    password="COSC4P02Raters")

@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
