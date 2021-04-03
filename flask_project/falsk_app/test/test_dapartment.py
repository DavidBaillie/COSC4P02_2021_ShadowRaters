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
    def test_departmentReviews_POST_have_not_login(self):
        response = self.client.post('/department/reviews/314c5fbdfded16c54ab6467239fc97',
                                    data=json.dumps(dict(uuid = "92c578860624ecc1aafe33ccc66f13",
                                                         did = "314c5fbdfded16c54ab6467239fc97",
                                                         score = 10,
                                                         comment = None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual("error, login first",msg)

    def test_departmentReviews_POST_have_login(self):

        with self.client.session_transaction() as sess:
            sess['uuid'] = "92c578860624ecc1aafe33ccc66f13"
        #case 1: correct input
        response = self.client.post('/department/reviews/314c5fbdfded16c54ab6467239fc97',
                                        data=json.dumps(dict(uuid="92c578860624ecc1aafe33ccc66f13",
                                                            did="314c5fbdfded16c54ab6467239fc97",
                                                            score=10,
                                                            comment=None)),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success",msg)
        #case 2: repeat input
        response = self.client.post('/department/reviews/314c5fbdfded16c54ab6467239fc97',
                                    data=json.dumps(dict(uuid="92c578860624ecc1aafe33ccc66f13",
                                                         did="314c5fbdfded16c54ab6467239fc97",
                                                         score=10,
                                                         comment=None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error, already rated", msg)
        #delete data after testing
        db.session.query(rating_department_table).filter_by(uuid="92c578860624ecc1aafe33ccc66f13",
                                                            did="314c5fbdfded16c54ab6467239fc97").delete()
        db.session.commit()
        #case 3: missing input
        response = self.client.post('/department/reviews/314c5fbdfded16c54ab6467239fc97',
                                    data=json.dumps(dict(did="314c5fbdfded16c54ab6467239fc97",
                                                         score=10,
                                                         comment=None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error", msg)
        #case 4: id not exist
        response = self.client.post('/department/reviews/314c5fbdfded16c54ab6467239fc97',
                                    data=json.dumps(dict(uuid="82c578860624ecc1aafe33ccc66f13",
                                                         did="314c5fbdfded16c54ab6467239fc97",
                                                         score=10,
                                                         comment=None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error", msg)

    def test_departmentReviews_GET(self):
        response = self.client.get('/course/reviews/314c5fbdfded16c54ab6467239fc97', follow_redirects=True)
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual('success', msg)