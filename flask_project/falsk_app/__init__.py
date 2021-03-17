from .views import app
from .views.university import university
from .views.course import courses


app.register_blueprint(university,url_prefix='/university')
app.register_blueprint(courses,url_prefix='/course')