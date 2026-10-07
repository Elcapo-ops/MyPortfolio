from django.db import migrations,models
class Migration(migrations.Migration):
    initial=True
    dependencies=[]
    operations=[migrations.CreateModel(name="BlogPost",fields=[("id",models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name="ID")),("title",models.CharField(max_length=220)),("slug",models.SlugField(max_length=50,unique=True)),("excerpt",models.CharField(max_length=320)),("content",models.TextField()),("cover",models.ImageField(blank=True,null=True,upload_to="blog/")),("published",models.BooleanField(default=False)),("published_at",models.DateTimeField(blank=True,null=True)),("created_at",models.DateTimeField(auto_now_add=True)),("updated_at",models.DateTimeField(auto_now=True))])]
