from flask import Flask
from sshtunnel import SSHTunnelForwarder
import psycopg2

app = Flask(__name__)

server = SSHTunnelForwarder(
    ('51.222.151.27',22),
    ssh_private_key = "C:\\Users\\wsh41\\.ssh\\id_rsa",
    ssh_username='root',
    remote_bind_address=('localhost',5432))

server.start()
print("server connected")

conn = psycopg2.connect(
    database='postgres',
    user='postgres',
    password='COSC4P02Raters',
    host='localhost',
    port=server.local_bind_port,
)
curs = conn.cursor()
print("database connected")




@app.route('/')
def hello_world():
    curs.execute("select version()")
    data = curs.fetchone()
    print(data)
    return "%s" % data


if __name__ == '__main__':
    app.run()
