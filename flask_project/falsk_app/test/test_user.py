import unittest
from falsk_app import app
from falsk_app.views import db,user_table
import json

class test_user(unittest.TestCase):
    def setUp(self):
        self.app = app
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = "wdxcas"
        self.client = app.test_client()

    def test_createNewUser(self):
        # case 1: correct input
        response = self.client.post('/user/createAccount',
                                    data=json.dumps(dict(admin = False,
                                                         username= "123456",
                                                         password = "B123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('success', msg)
        # case 2: repeat username
        response = self.client.post('/user/createAccount',
                                    data=json.dumps(dict(admin=False,
                                                         username="123456",
                                                         password="B123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('error', msg)
        # delete data after testing
        db.session.query(user_table).filter_by(username="123456").delete()
        db.session.commit()
        # case 3: missing username
        response = self.client.post('/user/createAccount',
                                    data=json.dumps(dict(admin=False,
                                                         password="B123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('error', msg)
        # case 4: missing password
        response = self.client.post('/user/createAccount',
                                    data=json.dumps(dict(admin=False,
                                                         username="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('error', msg)

    def test_login(self):
        # case 1: correct input (username and password)
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="A123456",
                                                         password="B123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('login success', msg)
        # case 2: correct input (token)
        token = resp_json.get('token')
        with self.client.session_transaction() as sess:
            sess['uuid'] = None
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('login success', msg)
        # case 3: invalid token
        token = "invalid token"
        with self.client.session_transaction() as sess:
            sess['uuid'] = None
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('invalid or expired token', msg)
        # case 4: user not exist
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="123456",
                                                         password="B123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('username not exist', msg)
        # case 5: wrong password
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="A123456",
                                                         password="A123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('wrong password', msg)
        # case 6: missing username or password
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(password="B123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('missing username or password', msg)

    def test_logout_have_not_login(self):
        with self.client.session_transaction() as sess:
            sess['uuid'] = None
        response = self.client.get('/user/logout', follow_redirects=True)
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual('not login yet', msg)

    def test_logout_have_login(self):
        with self.client.session_transaction() as sess:
            sess['uuid'] = "92c578860624ecc1aafe33ccc66f13"
        response = self.client.get('/user/logout', follow_redirects=True)
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual('logout success', msg)