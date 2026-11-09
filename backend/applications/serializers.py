import re

from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "name", "phone", "tariff", "comment"]


    def validate_phone(self, value):
        text = value.strip()
        if not re.fullmatch(r"[\d\s()+\-]+", text):
            raise serializers.ValidationError("Номер может содержать только цифры, пробелы, скобки, + и -")

        digits = re.sub(r"\D", "", text)
        if len(digits) == 11 and digits[0] in "78":
            return "+7" + digits[1:]
        if len(digits) == 10 and digits[0] == "9":
            return "+7" + digits
        if text.startswith("+") and 10 <= len(digits) <= 15:
            return "+" + digits

        raise serializers.ValidationError("Введите корректный номер телефона")
