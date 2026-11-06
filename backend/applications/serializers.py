import re

from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "name", "phone", "tariff", "comment"]

    # Проверка номера на стороне сервера: фронтенд можно обойти, бэкенд нельзя.
    # Метод validate_<поле> Django REST вызывает сам при проверке заявки.
    def validate_phone(self, value):
        text = value.strip()
        # Допустимы только цифры, пробелы, скобки, плюс и дефис
        if not re.fullmatch(r"[\d\s()+\-]+", text):
            raise serializers.ValidationError("Номер может содержать только цифры, пробелы, скобки, + и -")

        digits = re.sub(r"\D", "", text)
        # Российский номер: 11 цифр, начинается с 7 или 8
        if len(digits) == 11 and digits[0] in "78":
            return "+7" + digits[1:]
        # Без кода страны: 10 цифр, начинается с 9
        if len(digits) == 10 and digits[0] == "9":
            return "+7" + digits
        # Международный номер: «+» и от 10 до 15 цифр
        if text.startswith("+") and 10 <= len(digits) <= 15:
            return "+" + digits

        raise serializers.ValidationError("Введите корректный номер телефона")
