# Модели курсов, тарифов и обучения (запись на курс, уроки, домашки).
# Каждый класс = таблица в базе, каждое поле = столбец.
from django.conf import settings
from django.db import models

from content.models import ExamType, Teacher


class Course(models.Model):
    title = models.CharField("Название", max_length=200)
    exam_type = models.CharField("Экзамен", max_length=3, choices=ExamType.choices)
    description = models.TextField("Описание", blank=True)
    teacher = models.ForeignKey(
        Teacher, verbose_name="Преподаватель",
        on_delete=models.SET_NULL, null=True, blank=True, related_name="courses",
    )
    lessons_count = models.PositiveIntegerField("Количество занятий", default=0)
    duration = models.CharField("Срок обучения", max_length=100, blank=True)
    is_published = models.BooleanField("Показывать на сайте", default=True)

    class Meta:
        verbose_name = "Курс"
        verbose_name_plural = "Курсы"

    def __str__(self):
        return self.title


class Tariff(models.Model):
    # Курс необязателен: тарифы на главной (Стандарт, Про, Про+) общие для всех
    course = models.ForeignKey(
        Course, verbose_name="Курс", on_delete=models.CASCADE,
        related_name="tariffs", null=True, blank=True,
    )
    name = models.CharField("Название тарифа", max_length=100)
    price_per_month = models.PositiveIntegerField("Цена от, ₽ в месяц")
    features = models.TextField("Что входит", blank=True, help_text="Один пункт на строку")
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Тариф"
        verbose_name_plural = "Тарифы"

    def __str__(self):
        return self.name


# ===== Обучение (личный кабинет) =====

class Enrollment(models.Model):
    """Запись ученика на курс. Здесь же хранятся баллы для «траектории»."""
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, verbose_name="Ученик",
        on_delete=models.CASCADE, related_name="enrollments",
    )
    course = models.ForeignKey(
        Course, verbose_name="Курс", on_delete=models.CASCADE, related_name="enrollments",
    )
    start_score = models.PositiveSmallIntegerField("Балл в начале", null=True, blank=True)
    current_score = models.PositiveSmallIntegerField("Балл сейчас", null=True, blank=True)
    target_score = models.PositiveSmallIntegerField("Желаемый балл", null=True, blank=True)
    created_at = models.DateTimeField("Дата записи", auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")  # одного ученика нельзя записать на курс дважды
        verbose_name = "Запись на курс"
        verbose_name_plural = "Записи на курсы"

    def __str__(self):
        return f"{self.student} — {self.course}"


class Lesson(models.Model):
    course = models.ForeignKey(Course, verbose_name="Курс", on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField("Название урока", max_length=200)
    description = models.TextField("Краткое описание", blank=True)
    video_url = models.URLField("Ссылка на видео (YouTube или Rutube)", blank=True)
    notes = models.TextField("Конспект", blank=True)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Урок"
        verbose_name_plural = "Уроки"

    def __str__(self):
        return f"{self.course.title}: {self.title}"


class LessonProgress(models.Model):
    """Отметка «урок пройден». Из этих отметок считается % прохождения курса."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="Ученик", on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, verbose_name="Урок", on_delete=models.CASCADE, related_name="progress")
    completed_at = models.DateTimeField("Когда пройден", auto_now_add=True)

    class Meta:
        unique_together = ("student", "lesson")
        verbose_name = "Пройденный урок"
        verbose_name_plural = "Пройденные уроки"

    def __str__(self):
        return f"{self.student}: {self.lesson.title}"


class Homework(models.Model):
    """Задание к уроку. Тип «Пробный экзамен» нужен, чтобы отличать пробники от обычных домашек."""

    class Kind(models.TextChoices):
        HOMEWORK = "homework", "Домашнее задание"
        MOCK = "mock", "Пробный экзамен"

    lesson = models.ForeignKey(Lesson, verbose_name="Урок", on_delete=models.CASCADE, related_name="homeworks")
    title = models.CharField("Название", max_length=200)
    description = models.TextField("Задание", blank=True)
    kind = models.CharField("Тип", max_length=10, choices=Kind.choices, default=Kind.HOMEWORK)
    deadline = models.DateField("Срок сдачи", null=True, blank=True)

    class Meta:
        verbose_name = "Задание"
        verbose_name_plural = "Задания"

    def __str__(self):
        return self.title


class Submission(models.Model):
    """Ответ ученика на задание. Статус и оценку может менять преподаватель в админке."""

    class Status(models.TextChoices):
        DONE = "done", "Выполнено"
        PARTIAL = "partial", "Частично"
        NOT_DONE = "not_done", "Не выполнено"

    homework = models.ForeignKey(Homework, verbose_name="Задание", on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="Ученик", on_delete=models.CASCADE)
    answer = models.TextField("Ответ ученика", blank=True)
    status = models.CharField("Статус", max_length=10, choices=Status.choices, default=Status.DONE)
    grade = models.PositiveSmallIntegerField("Оценка", null=True, blank=True)
    teacher_comment = models.TextField("Комментарий преподавателя", blank=True)
    submitted_at = models.DateTimeField("Отправлено", auto_now=True)

    class Meta:
        unique_together = ("homework", "student")
        verbose_name = "Ответ на задание"
        verbose_name_plural = "Ответы на задания"

    def __str__(self):
        return f"{self.student}: {self.homework.title}"
