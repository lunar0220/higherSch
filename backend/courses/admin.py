# Админка: здесь преподаватель наполняет курсы, уроки и проверяет домашки.
from django.contrib import admin

from .models import Course, Enrollment, Homework, Lesson, LessonProgress, Submission, Tariff


class LessonInline(admin.TabularInline):
    """Уроки можно добавлять прямо на странице курса."""
    model = Lesson
    fields = ("order", "title", "video_url")
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "exam_type", "teacher", "is_published")
    inlines = [LessonInline]


@admin.register(Tariff)
class TariffAdmin(admin.ModelAdmin):
    list_display = ("name", "price_per_month", "order")


class HomeworkInline(admin.TabularInline):
    """Задания можно добавлять прямо на странице урока."""
    model = Homework
    fields = ("title", "kind", "deadline", "description")
    extra = 1


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order")
    list_filter = ("course",)
    inlines = [HomeworkInline]


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "start_score", "current_score", "target_score")
    list_filter = ("course",)


@admin.register(Homework)
class HomeworkAdmin(admin.ModelAdmin):
    list_display = ("title", "lesson", "kind", "deadline")
    list_filter = ("kind", "lesson__course")


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    # Здесь преподаватель ставит статус («частично»), оценку и комментарий
    list_display = ("homework", "student", "status", "grade", "submitted_at")
    list_filter = ("status", "homework__kind")


admin.site.register(LessonProgress)
