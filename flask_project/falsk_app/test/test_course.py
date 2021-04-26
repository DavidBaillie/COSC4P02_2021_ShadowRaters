import unittest
from falsk_app import app
from falsk_app.views import db,rating_course_table
import json

class test_course(unittest.TestCase):
    def setUp(self):
        self.app = app
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = "wdxcas"
        self.client = app.test_client()

    def test_getCourseInfo(self):
        response = self.client.get('/course',follow_redirects=True)
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual('success',msg)

    def test_courseReviews_POST(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        #case 1: correct input
        response = self.client.post('/course/reviews/c662cb64b1559cedd5f3d727658ade',
                                        data=json.dumps(dict(token=token,
                                                             score=1,
                                                             comment="test")),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success",msg)
        #case 2: repeat input
        response = self.client.post('/course/reviews/c662cb64b1559cedd5f3d727658ade',
                                        data=json.dumps(dict(token=token,
                                                             score=1,
                                                             comment="test")),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error, already rated", msg)
        #delete data after testing
        db.session.query(rating_course_table).filter_by(uuid="82bf07906b853e9cb3e8bc6e715719",
                                                        cid="c662cb64b1559cedd5f3d727658ade").delete()
        db.session.commit()
        #case 3: missing socre
        response = self.client.post('/course/reviews/c662cb64b1559cedd5f3d727658ade',
                                        data=json.dumps(dict(token=token,
                                                             comment="test")),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error", msg)
        #case 4: invaild token
        response = self.client.post('/course/reviews/c662cb64b1559cedd5f3d727658ade',
                                        data=json.dumps(dict(token="invalid",
                                                             comment="test")),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)

    def test_courseReviews_GET(self):
        response = self.client.get('/course/reviews/c662cb64b1559cedd5f3d727658ade', follow_redirects=True)
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual('success', msg)

    def test_voteCourseReview_agree(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # case 1: correct input
        response = self.client.post('/course/reviews/vote_agree/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: repeat input
        response = self.client.post('/course/reviews/vote_agree/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("already vote", msg)
        # cancel vote after testing
        response = self.client.post('/course/reviews/vote_cancel/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        # case 3: invalid token
        response = self.client.post('/course/reviews/vote_agree/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token="invalid")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)

    def test_voteCourseReview_disagree(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # case 1: correct input
        response = self.client.post('/course/reviews/vote_disagree/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: repeat input
        response = self.client.post('/course/reviews/vote_disagree/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("already vote", msg)
        # cancel vote after testing
        response = self.client.post('/course/reviews/vote_cancel/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        # case 3: invalid token
        response = self.client.post('/course/reviews/vote_disagree/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token="invalid")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)

    def test_voteCouresReview_cancel(self):
        # take a valid token first
        response = self.client.post('/user/login',
                                    data=json.dumps(dict(username="sw15gb123",
                                                         password="123456")),
                                    content_type='application/json')
        resp_json = response.get_json()
        token = resp_json.get('token')
        # add a vote for testing
        response = self.client.post('/course/reviews/vote_agree/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        # case 1: correct input
        response = self.client.post('/course/reviews/vote_cancel/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: vote not exist
        response = self.client.post('/course/reviews/vote_cancel/fa0d30fb1b1ebe5c43cbfdde97ed4b',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("vote not exist", msg)
        # case 3: invalid token
        response = self.client.post('/course/reviews/vote_cancel/fa0d30fb1b1ebe5c43cbfdde97ed4b',
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
        response = self.client.post('/course/getVotes',
                                    data=json.dumps(dict(token=token)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success", msg)
        # case 2: invalid token
        response = self.client.post('/course/getVotes',
                                    data=json.dumps(dict(token="invalid")),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("invalid or expired token", msg)