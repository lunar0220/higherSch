from django.urls import path

from . import cabinet_views as cabinet
from .views import CourseList, TariffList

urlpatterns = [

    path("courses/", CourseList.as_view()),
    path("tariffs/", TariffList.as_view()),
    path("my/courses/", cabinet.MyCourses.as_view()),
    path("my/courses/<int:course_id>/", cabinet.MyCourseDetail.as_view()),
    path("my/homework/", cabinet.MyHomework.as_view()),
    path("lessons/<int:lesson_id>/", cabinet.LessonDetail.as_view()),
    path("lessons/<int:lesson_id>/complete/", cabinet.LessonComplete.as_view()),
    path("homework/<int:homework_id>/submit/", cabinet.SubmitHomework.as_view()),
]
