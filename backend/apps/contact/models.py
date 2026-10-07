from django.db import models
class ContactMessage(models.Model):
    name=models.CharField(max_length=160); email=models.EmailField(); message=models.TextField(); read=models.BooleanField(default=False); created_at=models.DateTimeField(auto_now_add=True)
    class Meta: ordering=["-created_at"]
    def __str__(self): return f"{self.name} — {self.email}"
