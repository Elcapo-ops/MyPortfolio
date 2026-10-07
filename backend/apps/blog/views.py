from rest_framework import permissions,viewsets
from .models import BlogPost
from .serializers import BlogPostSerializer
class StaffWritePermission(permissions.BasePermission):
    def has_permission(self,request,view): return request.method in permissions.SAFE_METHODS or bool(request.user and request.user.is_staff)
class BlogPostViewSet(viewsets.ModelViewSet):
    queryset=BlogPost.objects.all(); serializer_class=BlogPostSerializer; permission_classes=[StaffWritePermission]; lookup_field="slug"; search_fields=["title","excerpt","content"]
    def get_queryset(self):
        if self.request.method in permissions.SAFE_METHODS and not (
            self.request.user and self.request.user.is_staff
        ):
            return BlogPost.objects.filter(published=True)
        return BlogPost.objects.all()
