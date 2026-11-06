# Регистрируем модели, чтобы ими можно было управлять в /admin
from django.contrib import admin

from .models import FAQ, Review, Teacher

admin.site.register(Teacher)
admin.site.register(Review)
admin.site.register(FAQ)
