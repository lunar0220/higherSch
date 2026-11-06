# Представления (views): принимают запрос и отдают данные.
# ListAPIView умеет отдавать список объектов, нам нужно только сказать какие.
from rest_framework.generics import ListAPIView

from .models import FAQ, Review, Teacher
from .serializers import FAQSerializer, ReviewSerializer, TeacherSerializer


class TeacherList(ListAPIView):
    serializer_class = TeacherSerializer

    def get_queryset(self):
        qs = Teacher.objects.filter(is_published=True)
        # /api/teachers/?exam_type=ege показывает только преподавателей ЕГЭ
        exam = self.request.query_params.get("exam_type")
        if exam:
            qs = qs.filter(exam_types__icontains=exam)
        return qs


class ReviewList(ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        qs = Review.objects.filter(is_published=True)
        exam = self.request.query_params.get("exam_type")
        if exam:
            qs = qs.filter(exam_type=exam)
        return qs


class FAQList(ListAPIView):
    serializer_class = FAQSerializer

    def get_queryset(self):
        # Без параметра отдаём вопросы для главной (у них поле пустое)
        exam = self.request.query_params.get("exam_type", "")
        return FAQ.objects.filter(exam_type=exam)
