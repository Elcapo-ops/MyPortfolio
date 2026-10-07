from django.db import models


class SiteSettings(models.Model):
    THEME_CHOICES = [
        ("blue", "Blue"),
        ("light", "Light"),
        ("purple", "Purple"),
        ("green", "Green"),
        ("minimal", "Minimal"),
        ("sunset", "Sunset"),
    ]

    key = models.CharField(max_length=32, primary_key=True, default="site", editable=False)
    default_theme = models.CharField(max_length=16, choices=THEME_CHOICES, default="blue")

    def __str__(self):
        return "Site appearance"


class PortfolioPage(models.Model):
    slug = models.SlugField(max_length=32, primary_key=True)
    eyebrow = models.CharField(max_length=120, blank=True)
    title = models.CharField(max_length=240)
    description = models.TextField(blank=True)
    section_title = models.CharField(max_length=240, blank=True)
    section_description = models.TextField(blank=True)
    secondary_title = models.CharField(max_length=240, blank=True)
    secondary_description = models.TextField(blank=True)
    cta_title = models.CharField(max_length=240, blank=True)
    cta_description = models.TextField(blank=True)
    show_in_navigation = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
