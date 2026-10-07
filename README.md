# MyPortfolio

This is my portfolio, ready to access and read.

## Ahmad Fawad Akhtari — Full Stack Portfolio

Production-oriented portfolio architecture with a **Next.js frontend** and a separate **Django REST Framework backend** backed by PostgreSQL.

## Stack

- Next.js 15 + React + TypeScript
- Tailwind CSS
- Framer Motion
- Django 5.2
- Django REST Framework
- SimpleJWT
- PostgreSQL
- Django Admin
- Pillow
- Docker / Docker Compose

## Features

- Animated liquid background with floating blobs
- Liquid/glass UI surfaces
- Smooth route transitions and scroll reveals
- Six themes: blue, light, purple, green, minimal and sunset
- Responsive design
- Projects, tags, skills, experience, profile and blog APIs
- Public contact API and private message management
- JWT authentication for the frontend admin dashboard
- Portfolio dashboard for profile, page copy, projects, skills, experience, blog posts, tags, messages, media and theme settings
- Social profile links and the public contact email are editable in the portfolio dashboard under Profile; the inquiry notification recipient is configured with `CONTACT_EMAIL`
- Contact form messages are saved in the dashboard and emailed to `CONTACT_EMAIL` when SMTP is configured
- Django Admin remains available as an optional backend tool
- PostgreSQL persistence
- Media uploads for profile, CV, projects and blog covers
- Search/filter-ready REST endpoints
- Production-oriented environment configuration

## Local setup

### 1. PostgreSQL
Create a database named `portfolio` and update `backend/.env` from `.env.example`.

### 2. Django

```bash
cd backend
python -m venv .venv
# Windows
.venv\\Scripts\\activate
# macOS/Linux
# source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_portfolio
python manage.py runserver
```

Django API: `http://localhost:8000/api/v1/`
Django Admin: `http://localhost:8000/admin/`

The seed command creates:

- Admin email: `admin@example.com`
- Admin password: `change-me`

Change these immediately for real deployment.

### Contact email delivery

For Gmail, use `smtp.gmail.com`, port `587`, TLS enabled, and SSL disabled. Set `EMAIL_HOST_USER` and `DEFAULT_FROM_EMAIL` to the Gmail account authorized to send; use a Google App Password (not the account password) for `EMAIL_HOST_PASSWORD`. Inquiry notifications go to `CONTACT_EMAIL`, which defaults to `jhonjordan010@gmail.com`. The public email shown on the site remains the email configured in the dashboard's Profile section. Submissions are also retained in the dashboard's Messages section, even when email delivery is unavailable.

### Vercel deployment

Vercel supports both Next.js and Django. Create two Vercel projects from this repository:

1. Frontend project: set Root Directory to `frontend`; configure `NEXT_PUBLIC_API_URL` to the deployed Django URL ending in `/api/v1`.
2. Backend project: set Root Directory to `backend`. Vercel detects `manage.py` and its WSGI application. Add a PostgreSQL database through the Vercel Marketplace and provide its `DATABASE_URL` to the backend project.

Set backend environment variables `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` for the deployed project domains, along with the Gmail SMTP variables above. Set the frontend production origin in both CORS and CSRF trusted origins. SMTP credentials must be entered as Vercel environment secrets, never committed to source control. Vercel's function filesystem is not durable: configure durable media storage before relying on avatar, CV, project-image, or blog-image uploads. Migrate the database and create an administrator before opening the deployed dashboard.

### Portfolio management

Sign in at `http://localhost:3000/admin` with the seeded administrator account. From this dashboard you can update your profile and upload a profile picture or CV, edit the visible copy on every public page, add custom scrollable portfolio sections and choose whether each appears in the navigation, manage projects and their images/tags, skills, experience, blog posts and contact messages, and choose the site's default theme. You do not need Django Admin for routine portfolio management.

### 3. Next.js

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend: `http://localhost:3000`

### 4. Docker

From the repository root:

```bash
docker compose up --build
```

## Architecture

```text
Browser
   |
   v
Next.js / React / Tailwind / Framer Motion
   |
   | REST + JWT
   v
Django REST Framework
   |
   +-- Authentication / Permissions
   +-- Serializers / Validation
   +-- Business endpoints
   +-- Django Admin
   +-- Media handling
   |
   v
PostgreSQL
```

## Main API routes

- `POST /api/v1/auth/token/`
- `POST /api/v1/auth/token/refresh/`
- `GET /api/v1/profile/`
- `GET /api/v1/skills/`
- `GET /api/v1/experience/`
- `GET /api/v1/projects/`
- `GET /api/v1/projects/<slug>/`
- `GET /api/v1/blog/`
- `GET /api/v1/blog/<slug>/`
- `POST /api/v1/contact/`
- `GET /api/v1/messages/` (admin)

## Project organization

`frontend/` contains the presentation layer.

`backend/` contains the API, database models, authentication, validation, media and CMS.

The frontend never accesses PostgreSQL directly.
