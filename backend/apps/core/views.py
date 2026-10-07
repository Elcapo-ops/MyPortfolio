from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import PortfolioPage, SiteSettings
from .serializers import PortfolioPageSerializer, SiteSettingsSerializer


class StaffWritePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or bool(
            request.user and request.user.is_staff
        )


class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [StaffWritePermission]
    lookup_field = "key"

    def list(self, request, *args, **kwargs):
        settings, _ = SiteSettings.objects.get_or_create(key="site")
        return Response(self.get_serializer(settings).data)


class PortfolioPageViewSet(viewsets.ModelViewSet):
    queryset = PortfolioPage.objects.order_by("sort_order", "slug")
    serializer_class = PortfolioPageSerializer
    permission_classes = [StaffWritePermission]
    lookup_field = "slug"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.slug in {"home", "about", "projects", "blog", "contact"}:
            raise ValidationError({"detail": "Built-in portfolio pages cannot be deleted."})
        return super().destroy(request, *args, **kwargs)
