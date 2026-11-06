# Сериализатор превращает объект из базы в JSON, который понимает React
from rest_framework import serializers

from .models import FAQ, Review, Teacher


class TeacherSerializer(serializers.ModelSerializer):
    # Факты хранятся текстом (по строке на факт), а React ждёт список
    facts = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = [
            "id", "name", "subject", "photo", "facts", "experience",
            "typical_score", "social_link", "exam_types",
        ]

    def get_facts(self, obj):
        return [line.strip() for line in obj.bio.splitlines() if line.strip()]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "author_name", "text", "exam_type", "score", "created_at"]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "exam_type"]
