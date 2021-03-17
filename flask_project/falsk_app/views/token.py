import jwt
from . import app
def token_encode(**kwargs):
    return jwt.encode(kwargs,app.secret_key,algorithm='HS256')

