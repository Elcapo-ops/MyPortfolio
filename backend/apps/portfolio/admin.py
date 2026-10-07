from django.contrib import admin
from .models import Profile,Skill,Experience,Tag,Project
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin): list_display=("name","headline","email"); fieldsets=(("Identity",{"fields":("name","headline","bio","location","email","avatar","cv")}),("Links",{"fields":("github_url","linkedin_url","website_url")}))
@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin): list_display=("name","category","level","sort_order"); list_filter=("category",); search_fields=("name",); list_editable=("level","sort_order")
@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin): list_display=("role","company","start_date","end_date","sort_order"); list_filter=("company",); search_fields=("role","company")
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin): prepopulated_fields={"slug":("name",)}; search_fields=("name",)
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin): list_display=("title","featured","sort_order","updated_at"); list_filter=("featured","tags"); search_fields=("title","summary","description"); prepopulated_fields={"slug":("title",)}; filter_horizontal=("tags",); list_editable=("featured","sort_order")
