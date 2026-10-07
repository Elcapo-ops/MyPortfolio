from rest_framework import serializers
from .models import BlogPost
class BlogPostSerializer(serializers.ModelSerializer):
    cover_url=serializers.SerializerMethodField()
    class Meta: model=BlogPost; fields=["id","title","slug","excerpt","content","cover_url","cover","published","published_at","created_at","updated_at"]
    def get_cover_url(self,obj): return self.context["request"].build_absolute_uri(obj.cover.url) if obj.cover else None
