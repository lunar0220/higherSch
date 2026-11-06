from django.contrib import admin

from .models import Course, Tariff


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "exam_type", "teacher", "is_published")


@admin.register(Tariff)
class TariffAdmin(admin.ModelAdmin):
    list_display = ("name", "price_per_month", "order")
