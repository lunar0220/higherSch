# Вход делает готовое представление из simplejwt: принимает username и password,
# возвращает токен (access). Этот токен React потом прикладывает к запросам кабинета.
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import Me

urlpatterns = [
    path("auth/login/", TokenObtainPairView.as_view()),
    path("auth/refresh/", TokenRefreshView.as_view()),
    path("auth/me/", Me.as_view()),
]
