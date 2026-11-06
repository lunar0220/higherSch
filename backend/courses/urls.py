from django.urls import path

from .views import CourseList, TariffList

urlpatterns = [
    path("courses/", CourseList.as_view()),
    path("tariffs/", TariffList.as_view()),
]
