# Заявка с сайта: человек оставляет имя и телефон, менеджер связывается сам
from django.db import models

from courses.models import Tariff


class Application(models.Model):
    name = models.CharField("Имя", max_length=100)
    phone = models.CharField("Телефон", max_length=30)
    tariff = models.ForeignKey(
        Tariff, verbose_name="Тариф", on_delete=models.SET_NULL, null=True, blank=True,
    )
    comment = models.TextField("Комментарий", blank=True)
    created_at = models.DateTimeField("Дата", auto_now_add=True)
    is_processed = models.BooleanField("Обработана", default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self):
        return f"{self.name}, {self.phone}"
