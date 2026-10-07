from django.db import models
class BlogPost(models.Model):
    title=models.CharField(max_length=220); slug=models.SlugField(unique=True); excerpt=models.CharField(max_length=320); content=models.TextField(); cover=models.ImageField(upload_to="blog/",blank=True,null=True); published=models.BooleanField(default=False); published_at=models.DateTimeField(blank=True,null=True); created_at=models.DateTimeField(auto_now_add=True); updated_at=models.DateTimeField(auto_now=True)
    class Meta: ordering=["-published_at","-created_at"]
    def __str__(self): return self.title
