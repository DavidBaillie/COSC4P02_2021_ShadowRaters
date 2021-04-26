import unittest
from falsk_app import app
from falsk_app.views import db,rating_department_table
import json

class test_department(unittest.TestCase):
    def setUp(self):
        self.app = app
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = "wdxcas"
        self.client = app.test_client()

    def test_getDepartmentInfo(self):
        response = self.client.get('/department',follow_redirects=True)
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual('success',msg)

    def test_departmentReviews_POST(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        #case 1: correct input
        response = self.client.post('/department/reviews/314c5fbdfded16c54ab6467239fc97',
                                        data=json.dumps(dict(token=token,
                                                             score=1,
                                                             comment="test")),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success",msg)
        #case 2: repeat input
        response = self.client.post('/department/reviews/314c5fbdfded16c54ab6467239fc97',
                                        data=json.dumps(dict(token=token,
                                                             score=1,
                                                             comment="test")),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error, already rated", msg)
        #delete data after testing
        db.session.query(rating_department_table).filter_by(uuid="82bf07906b853e9cb3e8bc6e715719",
                                                            did="314c5fbdfded16c54ab6467239fc97").delete()
        db.session.commit()
        # case 3: missing score
        response = self.client.post('/department/reviews/314c5fbdfded16c54ab6467239fc97',
                                    data=json.dumps(dict(token=token,
                                                         comment="test")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error", msg)
        # case 4: invalid token
        response = self.client.post('/department/reviews/314c5fbdfded16c54ab6467239fc97',
                                        data=json.dumps(dict(token="invalid",
                                                             score=1,
                                                             comment="test")),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)

    def test_departmentReviews_GET(self):
        response = self.client.get('/department/reviews/314c5fbdfded16c54ab6467239fc97', follow_redirects=True)
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual('success', msg)

    def test_voteDepartmentReview_agree(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # case 1: correct input
        response = self.client.post('/department/reviews/vote_agree/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: repeat input
        response = self.client.post('/department/reviews/vote_agree/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("already vote", msg)
        # cancel vote after testing
        response = self.client.post('/department/reviews/vote_cancel/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        # case 3: invalid token
        response = self.client.post('/department/reviews/vote_agree/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token="invalid")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)

    def test_voteDepartmentReview_disagree(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # case 1: correct input
        response = self.client.post('/department/reviews/vote_disagree/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: repeat input
        response = self.client.post('/department/reviews/vote_disagree/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("already vote", msg)
        # cancel vote after testing
        response = self.client.post('/department/reviews/vote_cancel/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        # case 3: invalid token
        response = self.client.post('/department/reviews/vote_disagree/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token="invalid")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)

    def test_voteDepartmentReview_cancel(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # add a vote for testing
        response = self.client.post('/department/reviews/vote_agree/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        # case 1: correct input
        response = self.client.post('/department/reviews/vote_cancel/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: vote not exist
        response = self.client.post('/department/reviews/vote_cancel/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("vote not exist", msg)
        # case 3: invalid token
        response = self.client.post('/department/reviews/vote_cancel/ffe562f458f390ff4c0e2f8ff811ec',
                                    data=json.dumps(dict(token="invalid")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)

    def test_getVotes(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # case 1: correct input
        response = self.client.post('/department/getVotes',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: invalid token
        response = self.client.post('/department/getVotes',
                                    data=json.dumps(dict(token="invalid")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)