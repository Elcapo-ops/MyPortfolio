from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include,path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from apps.portfolio.views import ProfileViewSet,SkillViewSet,ExperienceViewSet,TagViewSet,ProjectViewSet
from apps.blog.views import BlogPostViewSet
from apps.contact.views import ContactMessageViewSet
from apps.core.views import PortfolioPageViewSet, SiteSettingsViewSet
router=DefaultRouter()
router.register("profile",ProfileViewSet,basename="profile")
router.register("skills",SkillViewSet,basename="skills")
router.register("experience",ExperienceViewSet,basename="experience")
router.register("tags",TagViewSet,basename="tags")
router.register("projects",ProjectViewSet,basename="projects")
router.register("blog",BlogPostViewSet,basename="blog")
router.register("messages",ContactMessageViewSet,basename="messages")
router.register("pages",PortfolioPageViewSet,basename="pages")
router.register("site-settings",SiteSettingsViewSet,basename="site-settings")
urlpatterns=[path("admin/",admin.site.urls),path("api/v1/",include(router.urls)),path("api/v1/auth/token/",TokenObtainPairView.as_view(),name="token"),path("api/v1/auth/token/refresh/",TokenRefreshView.as_view(),name="token_refresh"),path("api/v1/contact/",include("apps.contact.urls"))]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
