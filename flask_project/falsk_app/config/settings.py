
class BASE(object):
    DEBUG = False
    SECRET_KEY = "fsdadwda"
    #SQLALCHEMY_DATABASE_URI = ""

class Test(BASE):
    DEBUG = True
    SECRET_KEY = "wdxcas"

class Product(BASE):
    DEBUG = False
    SECRET_KEY = "SDIAPCOACJC"