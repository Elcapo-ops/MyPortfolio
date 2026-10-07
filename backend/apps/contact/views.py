from rest_framework import permissions,viewsets
from .models import ContactMessage
from .serializers import ContactMessageSerializer
class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset=ContactMessage.objects.all(); serializer_class=ContactMessageSerializer; permission_classes=[permissions.IsAdminUser]; http_method_names=["get","patch","delete","head","options"]
