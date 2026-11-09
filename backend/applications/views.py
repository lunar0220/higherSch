from rest_framework.generics import CreateAPIView

from .serializers import ApplicationSerializer



class ApplicationCreate(CreateAPIView):
    serializer_class = ApplicationSerializer
