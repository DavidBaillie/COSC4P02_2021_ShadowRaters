from .views import app
from .views.university import university
from .views.course import course
from .views.department import department
from .views.professor import professor
from .views.user import user

app.register_blueprint(university)
app.register_blueprint(course)
app.register_blueprint(department)
app.register_blueprint(professor)
app.register_blueprint(user)