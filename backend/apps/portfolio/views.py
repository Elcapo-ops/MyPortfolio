from rest_framework import permissions,viewsets
from rest_framework.response import Response
from .models import Profile,Skill,Experience,Tag,Project
from .serializers import ProfileSerializer,SkillSerializer,ExperienceSerializer,TagSerializer,ProjectSerializer
class StaffWritePermission(permissions.BasePermission):
    def has_permission(self,request,view): return request.method in permissions.SAFE_METHODS or bool(request.user and request.user.is_staff)
class ProfileViewSet(viewsets.ModelViewSet):
    queryset=Profile.objects.all(); serializer_class=ProfileSerializer; permission_classes=[StaffWritePermission]
    def list(self, request, *args, **kwargs):
        obj=Profile.objects.first()
        if not obj:
            return Response({"detail":"Profile not configured."}, status=404)
        return Response(self.get_serializer(obj).data)
class SkillViewSet(viewsets.ModelViewSet): queryset=Skill.objects.all(); serializer_class=SkillSerializer; permission_classes=[StaffWritePermission]; filterset_fields=["category"]; ordering_fields=["sort_order","name"]
class ExperienceViewSet(viewsets.ModelViewSet): queryset=Experience.objects.all(); serializer_class=ExperienceSerializer; permission_classes=[StaffWritePermission]
class TagViewSet(viewsets.ModelViewSet): queryset=Tag.objects.all(); serializer_class=TagSerializer; permission_classes=[StaffWritePermission]
class ProjectViewSet(viewsets.ModelViewSet): queryset=Project.objects.prefetch_related("tags").all(); serializer_class=ProjectSerializer; permission_classes=[StaffWritePermission]; lookup_field="slug"; filterset_fields=["featured"]; search_fields=["title","summary","description","tags__name"]; ordering_fields=["sort_order","created_at","title"]
