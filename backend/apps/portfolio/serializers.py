from rest_framework import serializers
from .models import Profile,Skill,Experience,Tag,Project
class ProfileSerializer(serializers.ModelSerializer):
    avatar_url=serializers.SerializerMethodField(); cv_url=serializers.SerializerMethodField()
    class Meta: model=Profile; fields=["id","name","headline","bio","location","email","avatar_url","avatar","cv_url","cv","github_url","linkedin_url","website_url"]
    def get_avatar_url(self,obj): return self.context["request"].build_absolute_uri(obj.avatar.url) if obj.avatar else None
    def get_cv_url(self,obj): return self.context["request"].build_absolute_uri(obj.cv.url) if obj.cv else None
class SkillSerializer(serializers.ModelSerializer):
    class Meta: model=Skill; fields="__all__"
class ExperienceSerializer(serializers.ModelSerializer):
    class Meta: model=Experience; fields="__all__"
class TagSerializer(serializers.ModelSerializer):
    class Meta: model=Tag; fields="__all__"
class ProjectSerializer(serializers.ModelSerializer):
    tags=TagSerializer(many=True,read_only=True); tag_ids=serializers.PrimaryKeyRelatedField(many=True,source="tags",queryset=Tag.objects.all(),write_only=True,required=False)
    image_url=serializers.SerializerMethodField()
    class Meta: model=Project; fields=["id","title","slug","summary","description","image_url","image","live_url","repo_url","featured","sort_order","tags","tag_ids","created_at","updated_at"]; read_only_fields=["image_url","created_at","updated_at"]
    def get_image_url(self,obj): return self.context["request"].build_absolute_uri(obj.image.url) if obj.image else None
