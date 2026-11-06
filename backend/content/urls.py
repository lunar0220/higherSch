# Адреса API для контента
from django.urls import path

from .views import FAQList, ReviewList, TeacherList

urlpatterns = [
    path("teachers/", TeacherList.as_view()),
    path("reviews/", ReviewList.as_view()),
    path("faq/", FAQList.as_view()),
]
