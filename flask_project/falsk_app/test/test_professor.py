import unittest
from falsk_app import app
from falsk_app.views import db,rating_professor_table
import json

class test_professor(unittest.TestCase):
    def setUp(self):
        self.app = app
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = "wdxcas"
        self.client = app.test_client()

    def test_getProfessorInfo(self):
        response = self.client.get('/professor',follow_redirects=True)
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual('success',msg)
    def test_professorReviws_POST_have_not_login(self):
        response = self.client.post('/professor/reviews/47269dc7357140e3a6f2ab9ae7ed6c',
                                    data=json.dumps(dict(uuid = "02ecedf3fbb4a510acb4c41f2d02d3",
                                                         pid = "47269dc7357140e3a6f2ab9ae7ed6c",
                                                         score = 10,
                                                         comment = None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        msg = resp_json.get('msg')
        self.assertEqual("error, login first",msg)

    def test_professorReviws_POST_have_login(self):

        with self.client.session_transaction() as sess:
            sess['uuid'] = "02ecedf3fbb4a510acb4c41f2d02d3"
        #case 1: correct input
        response = self.client.post('/professor/reviews/47269dc7357140e3a6f2ab9ae7ed6c',
                                        data=json.dumps(dict(uuid="02ecedf3fbb4a510acb4c41f2d02d3",
                                                             pid="47269dc7357140e3a6f2ab9ae7ed6c",
                                                             score=10,
                                                             comment=None)),
                                        content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("success",msg)
        #case 2: repeat input
        response = self.client.post('/professor/reviews/47269dc7357140e3a6f2ab9ae7ed6c',
                                    data=json.dumps(dict(uuid="02ecedf3fbb4a510acb4c41f2d02d3",
                                                         pid="47269dc7357140e3a6f2ab9ae7ed6c",
                                                         score=10,
                                                         comment=None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error, already rated", msg)
        #delete data after testing
        db.session.query(rating_professor_table).filter_by(uuid="02ecedf3fbb4a510acb4c41f2d02d3",
                                                            pid="47269dc7357140e3a6f2ab9ae7ed6c").delete()
        db.session.commit()
        #case 3: missing input
        response = self.client.post('/professor/reviews/47269dc7357140e3a6f2ab9ae7ed6c',
                                    data=json.dumps(dict(pid="47269dc7357140e3a6f2ab9ae7ed6c",
                                                         score=10,
                                                         comment=None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error", msg)
        #case 4: id not exist
        response = self.client.post('/professor/reviews/47269dc7357140e3a6f2ab9ae7ed6c',
                                    data=json.dumps(dict(uuid="12ecedf3fbb4a510acb4c41f2d02d3",
                                                         pid="47269dc7357140e3a6f2ab9ae7ed6c",
                                                         score=10,
                                                         comment=None)),
                                    content_type='application/json')
        resp_json = response.get_json()
        print(resp_json)
        msg = resp_json.get('msg')
        self.assertEqual("error", msg)