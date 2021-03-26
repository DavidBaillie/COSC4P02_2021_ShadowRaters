from falsk_app import app
from falsk_app.config import settings
from flask_cors import *

app.config.from_object(settings.Test)
CORS(app,supports_credentials=True)

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(host='0.0.0.0')
