# Модели публичного контента: преподаватели, отзывы, вопросы FAQ.
# Каждый класс = таблица в базе, каждое поле = столбец.
from django.db import models


class ExamType(models.TextChoices):
    EGE = "ege", "ЕГЭ"
    OGE = "oge", "ОГЭ"


class Teacher(models.Model):
    name = models.CharField("Имя", max_length=100)
    subject = models.CharField("Предмет", max_length=100)
    photo = models.ImageField("Фото", upload_to="teachers/", blank=True)
    bio = models.TextField("Факты о преподавателе", blank=True, help_text="Один факт на строку")
    experience = models.CharField("Опыт", max_length=200, blank=True)
    typical_score = models.CharField("Обычные баллы учеников", max_length=100, blank=True)
    social_link = models.URLField("Ссылка на соцсеть", blank=True)
    exam_types = models.CharField(
        "Экзамены", max_length=20, default="ege,oge",
        help_text="Через запятую: ege, oge",
    )
    order = models.PositiveIntegerField("Порядок", default=0)
    is_published = models.BooleanField("Показывать на сайте", default=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Преподаватель"
        verbose_name_plural = "Преподаватели"

    def __str__(self):
        return f"{self.name} ({self.subject})"


class Review(models.Model):
    author_name = models.CharField("Автор", max_length=100)
    text = models.TextField("Текст отзыва")
    exam_type = models.CharField("Экзамен", max_length=3, choices=ExamType.choices, blank=True)
    score = models.CharField("Результат", max_length=50, blank=True)
    created_at = models.DateTimeField("Создан", auto_now_add=True)
    is_published = models.BooleanField("Показывать на сайте", default=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"

    def __str__(self):
        return self.author_name


class FAQ(models.Model):
    question = models.CharField("Вопрос", max_length=300)
    answer = models.TextField("Ответ")
    exam_type = models.CharField(
        "Для какой страницы", max_length=3, choices=ExamType.choices, blank=True,
        help_text="Пусто = показывать на главной",
    )
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Вопрос FAQ"
        verbose_name_plural = "FAQ"

    def __str__(self):
        return self.question
