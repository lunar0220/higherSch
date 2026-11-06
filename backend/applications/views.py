from rest_framework.generics import CreateAPIView

from .serializers import ApplicationSerializer


# CreateAPIView принимает только POST: сайт отправляет заявку,
# а список заявок видит только администратор в /admin
class ApplicationCreate(CreateAPIView):
    serializer_class = ApplicationSerializer
