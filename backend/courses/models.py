# Модели курсов и тарифов
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
