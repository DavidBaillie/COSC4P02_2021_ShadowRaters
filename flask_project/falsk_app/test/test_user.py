import unittest
from falsk_app import app
from falsk_app.views import db,user_table
import json

class test_user(unittest.TestCase):

    @classmethod
    def setUp(self):
        self.app = app
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = "wdxcas"
        self.client = app.test_client()


    def test_createNewUser(self):
        # case 1: correct input
        response = self.client.post('/user/createAccount',
                                    data=json.dumps(dict(admin = False,
                                                         username= "sw15gb",
                                                         password = "123456",
                                                         email="sw15gb@brocku.ca")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('success', msg)
        # case 2: repeat username
        response = self.client.post('/user/createAccount',
                                    data=json.dumps(dict(admin=False,
                                                         username="sw15gb",
                                                         password="654321",
                                                         email="123@gmail.com")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('error', msg)
        # delete data after testing
        db.session.query(user_table).filter_by(username="sw15gb").delete()
        db.session.commit()
        # case 3: missing username
        response = self.client.post('/user/createAccount',
                                    data=json.dumps(dict(admin=False,
                                                         password="123456",
                                                         email="123@gmail.com")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('error', msg)
        # case 4: missing password
        response = self.client.post('/user/createAccount',
                                    data=json.dumps(dict(admin=False,
                                                         username="123456",
                                                         email="123@gmail.com")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('error', msg)

    def test_login(self):
        # case 1: correct input (username and password)
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('login success', msg)
        # case 2: correct input (token)
        token = resp_json.get('token')
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('login success', msg)
        # case 3: invalid token
        token_invalid = "invalid token"
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(token=token_invalid)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('invalid or expired token', msg)
        # case 4: user not exist
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gbNotExist",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('username not exist', msg)
        # case 5: wrong password
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="0123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('wrong password', msg)
        # case 6: missing username or password
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('missing username or password', msg)

    def test_changePassword(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # case 1: correct input
        response = self.client.post('/user/changePassword',
                                    data=json.dumps(dict(token=token,
                                                         password='654321')),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('success', msg)
        # change back the password after testing
        response = self.client.post('/user/changePassword',
                                    data=json.dumps(dict(token=token,
                                                         password='123456')),
                                    content_type='application/json')
        # case 2: wrong token
        response = self.client.post('/user/changePassword',
                                    data=json.dumps(dict(token="wrong token",
                                                         password='654321')),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('invalid or expired token', msg)
        # case 3: None password
        response = self.client.post('/user/changePassword',
                                    data=json.dumps(dict(token=token,
                                                         password=None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual('error', msg)