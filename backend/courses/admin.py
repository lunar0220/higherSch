from django.contrib import admin

# Register your models here.


from django.contrib import admin

from .models import Course, Tariff


class TariffInline(admin.TabularInline):
    model = Tariff
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "exam_type", "teacher", "is_published")
    inlines = [TariffInline]


admin.site.register(Tariff)