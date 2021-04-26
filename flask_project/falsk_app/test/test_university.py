import unittest
from falsk_app import app
from falsk_app.views import db,rating_university_table
import json

class test_university(unittest.TestCase):
    def setUp(self):
        self.app = app
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = "wdxcas"
        self.client = app.test_client()

    def test_getUniversityInfo(self):
        response = self.client.get('/university',follow_redirects=True)
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual('success',msg)

    def test_universityReviews_POST(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        #case 1: correct input
        response = self.client.post('/university/reviews/5a05866e09c4377fd977047e34bd0c',
                                        data=json.dumps(dict(token=token,
                                                             score=1,
                                                             comment="test")),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success",msg)
        #case 2: repeat input
        response = self.client.post('/university/reviews/5a05866e09c4377fd977047e34bd0c',
                                        data=json.dumps(dict(token=token,
                                                             score=1,
                                                             comment="test")),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error, already rated", msg)
        #delete data after testing
        db.session.query(rating_university_table).filter_by(uuid="82bf07906b853e9cb3e8bc6e715719",
                                                            uid="5a05866e09c4377fd977047e34bd0c").delete()
        db.session.commit()
        # case 3: missing score
        response = self.client.post('/university/reviews/5a05866e09c4377fd977047e34bd0c',
                                        data=json.dumps(dict(token=token,
                                                             comment="test")),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error", msg)
        # case 4: invalid token
        response = self.client.post('/university/reviews/5a05866e09c4377fd977047e34bd0c',
                                    data=json.dumps(dict(token='invalid',
                                                         score=1,
                                                         comment="test")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)

    def test_universityReviews_GET(self):
        response = self.client.get('/university/reviews/5a05866e09c4377fd977047e34bd0c', follow_redirects=True)
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual('success', msg)

    def test_voteUniversityReview_agree(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # case 1: correct input
        response = self.client.post('/university/reviews/vote_agree/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: repeat input
        response = self.client.post('/university/reviews/vote_agree/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("already vote", msg)
        # cancel vote after testing
        response = self.client.post('/university/reviews/vote_cancel/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        # case 3: invalid token
        response = self.client.post('/university/reviews/vote_agree/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token="invalid")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)

    def test_voteUniversityReview_disagree(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # case 1: correct input
        response = self.client.post('/university/reviews/vote_disagree/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: repeat input
        response = self.client.post('/university/reviews/vote_disagree/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("already vote", msg)
        # cancel vote after testing
        response = self.client.post('/university/reviews/vote_cancel/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        # case 3: invalid token
        response = self.client.post('/university/reviews/vote_disagree/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token="invalid")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)

    def test_voteUniversityReview_cancel(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # add a vote for testing
        response = self.client.post('/university/reviews/vote_agree/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        # case 1: correct input
        response = self.client.post('/university/reviews/vote_cancel/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: vote not exist
        response = self.client.post('/university/reviews/vote_cancel/8ed307686f6efd65cfa313615f3f09',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("vote not exist", msg)
        # case 3: invalid token
        response = self.client.post('/university/reviews/vote_cancel/8ed307686f6efd65cfa313615f3f09',
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
        response = self.client.post('/university/getVotes',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: invalid token
        response = self.client.post('/university/getVotes',
                                    data=json.dumps(dict(token="invalid")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)