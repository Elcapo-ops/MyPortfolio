from rest_framework import serializers

from .models import PortfolioPage, SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = ["key", "default_theme"]
        read_only_fields = ["key"]


class PortfolioPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioPage
        fields = [
            "slug",
            "eyebrow",
            "title",
            "description",
            "section_title",
            "section_description",
            "secondary_title",
            "secondary_description",
            "cta_title",
            "cta_description",
            "show_in_navigation",
            "sort_order",
        ]
