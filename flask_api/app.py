import psycopg2
from flask import Flask

app = Flask(__name__)
#conn = psycopg2.connect(
#   host="51.222.151.27",
#    database="postgres",
#    user="root",
#    password="COSC4P02Raters")

@app.route('/', methods =['GET'])
def default():
    #code goes here


    return 'HEY EVERYONE!'


@app.route('/mainpage', methods=['GET'])
def mainPage():
    # code goes here

    return 'ALL THE INFO WE NEED FOR THE MAIN PAGE'

@app.route('/SchoolInfo', methods=['GET'])
def SchoolInfo():
    # code goes here

    return 'ALL THE INFO WE NEED FOR THE School\'s Page'

if __name__ == '__main__':
    app.run()
