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
    def test_courseReviws_POST_have_not_login(self):
        response = self.client.post('/course/reviews/c662cb64b1559cedd5f3d727658ade',
                                    data=json.dumps(dict(uuid = "02ecedf3fbb4a510acb4c41f2d02d3",
                                                         cid = "c662cb64b1559cedd5f3d727658ade",
                                                         score = 10,
                                                         comment = None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual("error, login first",msg)

    def test_courseReviws_POST_have_login(self):

        with self.client.session_transaction() as sess:
            sess['uuid'] = "02ecedf3fbb4a510acb4c41f2d02d3"
        #case 1: correct input
        response = self.client.post('/course/reviews/c662cb64b1559cedd5f3d727658ade',
                                        data=json.dumps(dict(uuid="02ecedf3fbb4a510acb4c41f2d02d3",
                                                            cid="c662cb64b1559cedd5f3d727658ade",
                                                            score=10,
                                                            comment=None)),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success",msg)
        #case 2: repeat input
        response = self.client.post('/course/reviews/c662cb64b1559cedd5f3d727658ade',
                                    data=json.dumps(dict(uuid="02ecedf3fbb4a510acb4c41f2d02d3",
                                                         cid="c662cb64b1559cedd5f3d727658ade",
                                                         score=10,
                                                         comment=None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error, already rated", msg)
        #delete data after testing
        db.session.query(rating_course_table).filter_by(uuid="02ecedf3fbb4a510acb4c41f2d02d3",
                                                        cid="c662cb64b1559cedd5f3d727658ade").delete()
        db.session.commit()
        #case 3: missing input
        response = self.client.post('/course/reviews/c662cb64b1559cedd5f3d727658ade',
                                    data=json.dumps(dict(cid="c662cb64b1559cedd5f3d727658ade",
                                                         score=10,
                                                         comment=None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error", msg)
        #case 4: id not exist
        response = self.client.post('/course/reviews/c662cb64b1559cedd5f3d727658ade',
                                    data=json.dumps(dict(uuid="12ecedf3fbb4a510acb4c41f2d02d3",
                                                         cid="c662cb64b1559cedd5f3d727658ade",
                                                         score=10,
                                                         comment=None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error", msg)
