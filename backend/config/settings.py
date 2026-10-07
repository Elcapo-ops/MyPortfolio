import os
import urllib.parse
from pathlib import Path
from dotenv import load_dotenv
from django.core.exceptions import ImproperlyConfigured
BASE_DIR=Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR/".env")
SECRET_KEY=os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ImproperlyConfigured("SECRET_KEY must be set in backend/.env or the environment.")
DEBUG=os.getenv("DEBUG","False").lower()=="true"
ALLOWED_HOSTS=[x.strip() for x in os.getenv("ALLOWED_HOSTS","localhost,127.0.0.1").split(",") if x.strip()]
INSTALLED_APPS=["django.contrib.admin","django.contrib.auth","django.contrib.contenttypes","django.contrib.sessions","django.contrib.messages","django.contrib.staticfiles","corsheaders","rest_framework","django_filters","apps.accounts","apps.core","apps.portfolio","apps.contact","apps.blog"]
MIDDLEWARE=["corsheaders.middleware.CorsMiddleware","django.middleware.security.SecurityMiddleware","django.contrib.sessions.middleware.SessionMiddleware","django.middleware.common.CommonMiddleware","django.middleware.csrf.CsrfViewMiddleware","django.contrib.auth.middleware.AuthenticationMiddleware","django.contrib.messages.middleware.MessageMiddleware","django.middleware.clickjacking.XFrameOptionsMiddleware"]
ROOT_URLCONF="config.urls"
TEMPLATES=[{"BACKEND":"django.template.backends.django.DjangoTemplates","DIRS":[],"APP_DIRS":True,"OPTIONS":{"context_processors":["django.template.context_processors.request","django.contrib.auth.context_processors.auth","django.contrib.messages.context_processors.messages"]}}]
WSGI_APPLICATION="config.wsgi.application"
DATABASES={"default":{"ENGINE":"django.db.backends.postgresql","NAME":os.getenv("DB_NAME","portfolio"),"USER":os.getenv("DB_USER","postgres"),"PASSWORD":os.getenv("DB_PASSWORD","postgres"),"HOST":os.getenv("DB_HOST","localhost"),"PORT":os.getenv("DB_PORT","5432")}}
if os.getenv("DATABASE_URL"):
    u=urllib.parse.urlparse(os.getenv("DATABASE_URL"))
    database_options={}
    query=urllib.parse.parse_qs(u.query)
    if "sslmode" in query:
        database_options["sslmode"]=query["sslmode"][0]
    elif not DEBUG:
        database_options["sslmode"]="require"
    DATABASES={"default":{"ENGINE":"django.db.backends.postgresql","NAME":u.path.lstrip("/"),"USER":urllib.parse.unquote(u.username or ""), "PASSWORD":urllib.parse.unquote(u.password or ""), "HOST":u.hostname or "localhost","PORT":u.port or 5432,"OPTIONS":database_options}}
AUTH_PASSWORD_VALIDATORS=[{"NAME":"django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},{"NAME":"django.contrib.auth.password_validation.MinimumLengthValidator"},{"NAME":"django.contrib.auth.password_validation.CommonPasswordValidator"}]
LANGUAGE_CODE="en-us"; TIME_ZONE="UTC"; USE_I18N=True; USE_TZ=True
STATIC_URL="/static/"; STATIC_ROOT=BASE_DIR/"staticfiles"; MEDIA_URL="/media/"; MEDIA_ROOT=BASE_DIR/"media"
DEFAULT_AUTO_FIELD="django.db.models.BigAutoField"
CORS_ALLOWED_ORIGINS=[x.strip() for x in os.getenv("CORS_ALLOWED_ORIGINS","http://localhost:3000").split(",") if x.strip()]
CSRF_TRUSTED_ORIGINS=[x.strip() for x in os.getenv("CSRF_TRUSTED_ORIGINS","http://localhost:3000").split(",") if x.strip()]
REST_FRAMEWORK={"DEFAULT_AUTHENTICATION_CLASSES":["rest_framework_simplejwt.authentication.JWTAuthentication"],"DEFAULT_PERMISSION_CLASSES":["rest_framework.permissions.AllowAny"],"DEFAULT_FILTER_BACKENDS":["django_filters.rest_framework.DjangoFilterBackend","rest_framework.filters.SearchFilter","rest_framework.filters.OrderingFilter"]}
EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST=os.getenv("EMAIL_HOST") or "smtp.gmail.com"
EMAIL_PORT=int(os.getenv("EMAIL_PORT","587"))
EMAIL_HOST_USER=os.getenv("EMAIL_HOST_USER") or "jhonjordan010@gmail.com"
EMAIL_HOST_PASSWORD=os.getenv("EMAIL_HOST_PASSWORD","")
EMAIL_USE_TLS=os.getenv("EMAIL_USE_TLS","True").lower()=="true"
EMAIL_USE_SSL=os.getenv("EMAIL_USE_SSL","False").lower()=="true"
EMAIL_TIMEOUT=int(os.getenv("EMAIL_TIMEOUT","10"))
DEFAULT_FROM_EMAIL=os.getenv("DEFAULT_FROM_EMAIL") or EMAIL_HOST_USER or "portfolio@localhost"
CONTACT_EMAIL=os.getenv("CONTACT_EMAIL") or "jhonjordan010@gmail.com"
from datetime import timedelta
SIMPLE_JWT={"ACCESS_TOKEN_LIFETIME":timedelta(minutes=30),"REFRESH_TOKEN_LIFETIME":timedelta(days=7),"AUTH_HEADER_TYPES":("Bearer",)}
AUTH_USER_MODEL="accounts.User"
