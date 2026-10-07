from django.db import models
class Profile(models.Model):
    name=models.CharField(max_length=160); headline=models.CharField(max_length=200); bio=models.TextField(); location=models.CharField(max_length=160,blank=True); email=models.EmailField(); avatar=models.ImageField(upload_to="profile/",blank=True,null=True); cv=models.FileField(upload_to="cv/",blank=True,null=True); github_url=models.URLField(blank=True); linkedin_url=models.URLField(blank=True); website_url=models.URLField(blank=True)
    def __str__(self): return self.name
class Skill(models.Model):
    CATEGORY_CHOICES=[("Frontend","Frontend"),("Backend","Backend"),("Database","Database"),("DevOps","DevOps"),("Architecture","Architecture"),("Tools","Tools")]
    name=models.CharField(max_length=100); category=models.CharField(max_length=40,choices=CATEGORY_CHOICES); level=models.PositiveSmallIntegerField(default=80); sort_order=models.PositiveIntegerField(default=0)
    class Meta: ordering=["sort_order","name"]
    def __str__(self): return self.name
class Experience(models.Model):
    company=models.CharField(max_length=160); role=models.CharField(max_length=160); description=models.TextField(); start_date=models.DateField(); end_date=models.DateField(blank=True,null=True); sort_order=models.PositiveIntegerField(default=0)
    class Meta: ordering=["sort_order","-start_date"]
    def __str__(self): return f"{self.role} — {self.company}"
class Tag(models.Model):
    name=models.CharField(max_length=80,unique=True); slug=models.SlugField(unique=True)
    def __str__(self): return self.name
class Project(models.Model):
    title=models.CharField(max_length=180); slug=models.SlugField(unique=True); summary=models.CharField(max_length=300); description=models.TextField(); image=models.ImageField(upload_to="projects/",blank=True,null=True); live_url=models.URLField(blank=True); repo_url=models.URLField(blank=True); featured=models.BooleanField(default=False); sort_order=models.PositiveIntegerField(default=0); tags=models.ManyToManyField(Tag,blank=True,related_name="projects"); created_at=models.DateTimeField(auto_now_add=True); updated_at=models.DateTimeField(auto_now=True)
    class Meta: ordering=["sort_order","-created_at"]
    def __str__(self): return self.title
