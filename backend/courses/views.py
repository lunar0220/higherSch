from rest_framework.generics import ListAPIView

from .models import Course, Tariff
from .serializers import CourseSerializer, TariffSerializer


class CourseList(ListAPIView):
    serializer_class = CourseSerializer

    def get_queryset(self):
        qs = Course.objects.filter(is_published=True).select_related("teacher")
        exam = self.request.query_params.get("exam_type")
        if exam:
            qs = qs.filter(exam_type=exam)
        return qs


class TariffList(ListAPIView):
    serializer_class = TariffSerializer
    # Только общие тарифы (без привязки к курсу): те, что на главной
    queryset = Tariff.objects.filter(course__isnull=True)
