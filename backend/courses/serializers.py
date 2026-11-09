from rest_framework import serializers

from .models import Course, Tariff


class TariffSerializer(serializers.ModelSerializer):

    features = serializers.SerializerMethodField()

    class Meta:
        model = Tariff
        fields = ["id", "name", "price_per_month", "features", "order"]

    def get_features(self, obj):
        return [line.strip() for line in obj.features.splitlines() if line.strip()]


class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.name", read_only=True, default=None)

    class Meta:
        model = Course
        fields = [
            "id", "title", "exam_type", "description",
            "teacher_name", "lessons_count", "duration",
        ]
