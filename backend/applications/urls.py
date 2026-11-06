from django.urls import path

from .views import ApplicationCreate

urlpatterns = [
    path("applications/", ApplicationCreate.as_view()),
]
