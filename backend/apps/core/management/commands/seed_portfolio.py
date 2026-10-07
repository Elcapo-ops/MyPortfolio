from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.portfolio.models import Profile,Skill,Experience,Tag,Project
from apps.blog.models import BlogPost
from django.utils import timezone
from apps.core.models import PortfolioPage, SiteSettings
class Command(BaseCommand):
    help="Create the initial admin and portfolio content."
    def handle(self,*args,**options):
        User=get_user_model(); email="admin@example.com"; password="change-me"
        user,_=User.objects.get_or_create(email=email,defaults={"username":"admin","is_staff":True,"is_superuser":True})
        user.is_staff=True; user.is_superuser=True; user.set_password(password); user.save()
        profile=Profile.objects.first() or Profile.objects.create(name="Ahmad Fawad Akhtari",headline="Full Stack Developer & Software Engineer",bio="I build modern web applications with clean code, scalable architecture and great user experiences. I work across backend systems, APIs, databases and polished frontend interfaces.",location="United States",email="jhonjordan010@gmail.com",github_url="https://github.com/",linkedin_url="https://www.linkedin.com/")
        skills=[("Next.js","Frontend",92),("React","Frontend",90),("TypeScript","Frontend",88),("Python","Backend",90),("Django","Backend",88),("Laravel","Backend",92),("PHP","Backend",90),("PostgreSQL","Database",86),("Docker","DevOps",80),("REST APIs","Architecture",92),("Git","Tools",92),("System Design","Architecture",84)]
        for i,(name,category,level) in enumerate(skills): Skill.objects.get_or_create(name=name,defaults={"category":category,"level":level,"sort_order":i})
        tags=[]
        for name in ["Next.js","Django","Python","PostgreSQL","TypeScript"]: tags.append(Tag.objects.get_or_create(name=name,defaults={"slug":name.lower().replace(".","-")})[0])
        project,_=Project.objects.get_or_create(slug="image-to-pdf",defaults={"title":"Image to PDF Converter","summary":"A polished Windows utility for converting images into PDFs.","description":"A modular desktop application focused on reliable image conversion, drag-and-drop workflows, modern UI and maintainable packaging.","featured":True,"sort_order":0})
        project.tags.set(tags[:4])
        SiteSettings.objects.get_or_create(key="site")
        pages=[
            ("home","FULL STACK / ARCHITECTURE","I build digital systems that feel alive.","I build modern web applications with clean code, scalable architecture and great user experiences.","Selected work","Built to solve real problems.","Capabilities","Engineering with product thinking.","Have a project?","Let's turn the idea into something people enjoy using."),
            ("about","ABOUT","The engineer behind the interface.","","Technical toolkit","","Experience","","",""),
            ("projects","PROJECTS","Selected work.","A collection of systems, applications and experiments.","","","","","",""),
            ("blog","BLOG","Notes from the stack.","","","","","","",""),
            ("contact","CONTACT","Let's build something useful.","Tell me what you're building, what problem you're solving, or where you need engineering support.","","","","","",""),
        ]
        for slug,eyebrow,title,description,section_title,section_description,secondary_title,secondary_description,cta_title,cta_description in pages:
            PortfolioPage.objects.get_or_create(
                slug=slug,
                defaults={
                    "eyebrow":eyebrow,
                    "title":title,
                    "description":description,
                    "section_title":section_title,
                    "section_description":section_description,
                    "secondary_title":secondary_title,
                    "secondary_description":secondary_description,
                    "cta_title":cta_title,
                    "cta_description":cta_description,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"Admin: {email} / {password}")); self.stdout.write(self.style.SUCCESS("Portfolio seed complete."))
