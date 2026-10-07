# 🚀 MyPortfolio Vercel Deployment Checklist

Complete this checklist step-by-step to deploy your portfolio to production.

---

## ✅ Step 1: Copy GitHub Actions Workflows (Push from VS Code)

Create these 3 files in your repository:

### File 1: `.github/workflows/frontend-deploy.yml`
```yaml
name: Frontend Deploy to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-deploy.yml'
  pull_request:
    types: [opened, synchronize, reopened]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-deploy.yml'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend

    env:
      VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_FRONTEND }}
      NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build

      - name: Deploy to Vercel (Production)
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: |
          npx vercel --prod --token="$VERCEL_TOKEN" --yes --scope="$VERCEL_ORG_ID" --project="$VERCEL_PROJECT_ID"

      - name: Deploy to Vercel (Preview)
        if: github.event_name == 'pull_request'
        run: |
          npx vercel --token="$VERCEL_TOKEN" --yes --scope="$VERCEL_ORG_ID" --project="$VERCEL_PROJECT_ID"
```

### File 2: `.github/workflows/backend-deploy.yml`
```yaml
name: Backend Deploy to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-deploy.yml'
  pull_request:
    types: [opened, synchronize, reopened]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-deploy.yml'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend

    env:
      VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_BACKEND }}
      SECRET_KEY: ${{ secrets.BACKEND_SECRET_KEY }}
      DEBUG: "False"
      ALLOWED_HOSTS: ${{ secrets.ALLOWED_HOSTS }}
      CORS_ALLOWED_ORIGINS: ${{ secrets.CORS_ALLOWED_ORIGINS }}
      CSRF_TRUSTED_ORIGINS: ${{ secrets.CSRF_TRUSTED_ORIGINS }}
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      EMAIL_HOST: ${{ secrets.EMAIL_HOST }}
      EMAIL_PORT: ${{ secrets.EMAIL_PORT }}
      EMAIL_HOST_USER: ${{ secrets.EMAIL_HOST_USER }}
      EMAIL_HOST_PASSWORD: ${{ secrets.EMAIL_HOST_PASSWORD }}
      EMAIL_USE_TLS: ${{ secrets.EMAIL_USE_TLS }}
      EMAIL_USE_SSL: ${{ secrets.EMAIL_USE_SSL }}
      DEFAULT_FROM_EMAIL: ${{ secrets.DEFAULT_FROM_EMAIL }}
      CONTACT_EMAIL: ${{ secrets.CONTACT_EMAIL }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.13'

      - name: Install backend dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Django system checks
        run: |
          python manage.py check

      - name: Collect static files
        run: |
          python manage.py collectstatic --noinput || true

      - name: Deploy to Vercel (Production)
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: |
          npx vercel --prod --token="$VERCEL_TOKEN" --yes --scope="$VERCEL_ORG_ID" --project="$VERCEL_PROJECT_ID"

      - name: Deploy to Vercel (Preview)
        if: github.event_name == 'pull_request'
        run: |
          npx vercel --token="$VERCEL_TOKEN" --yes --scope="$VERCEL_ORG_ID" --project="$VERCEL_PROJECT_ID"
```

### File 3: `.github/workflows/ci.yml`
```yaml
name: CI Checks

on:
  push:
    branches: ['**']
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  backend-quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.13'

      - name: Install backend dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt

      - name: Run Django checks
        working-directory: backend
        env:
          SECRET_KEY: test-secret-key-for-ci
          DEBUG: 'True'
          ALLOWED_HOSTS: 'localhost,127.0.0.1'
          CORS_ALLOWED_ORIGINS: 'http://localhost:3000'
          CSRF_TRUSTED_ORIGINS: 'http://localhost:3000'
          DB_NAME: 'portfolio'
          DB_USER: 'postgres'
          DB_PASSWORD: 'postgres'
          DB_HOST: 'localhost'
          DB_PORT: '5432'
        run: |
          cp -n .env.example .env || true
          python manage.py check

  frontend-quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm ci

      - name: Build frontend
        working-directory: frontend
        env:
          NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1
        run: npm run build
```

**Status**: [ ] All 3 workflow files created and pushed

---

## ✅ Step 2: Add Vercel Config Files (Push from VS Code)

### File 4: `frontend/vercel.json`
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

### File 5: `backend/vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "config/wsgi.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "config/wsgi.py"
    }
  ],
  "env": {
    "DJANGO_SETTINGS_MODULE": "config.settings",
    "PYTHONUNBUFFERED": "1",
    "PYTHONDONTWRITEBYTECODE": "1"
  }
}
```

**Status**: [ ] Both Vercel config files created and pushed

---

## ✅ Step 3: Generate Production Secrets

### 3.1 Django Secret Key
Run this command in your terminal:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
Copy the output (50-character string).

- [ ] **BACKEND_SECRET_KEY** = `<paste the 50-char string here>`

### 3.2 Vercel Tokens & IDs
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your team name (top left)
3. Go to **Settings → General**
4. Copy the **Team ID**

- [ ] **VERCEL_ORG_ID** = `<paste team ID here>`

Get your token:
1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Click **Create**
3. Name: `GitHub Actions`
4. Scope: Select your team
5. Click **Create**
6. **Copy immediately** (only shown once)

- [ ] **VERCEL_TOKEN** = `<paste token here - KEEP SECRET>`

### 3.3 Vercel Project IDs
1. Go to your **Frontend Vercel project**
2. Click **Settings → General**
3. Copy **Project ID**

- [ ] **VERCEL_PROJECT_ID_FRONTEND** = `<paste frontend project ID here>`

Do the same for backend:
1. Go to your **Backend Vercel project**
2. Click **Settings → General**
3. Copy **Project ID**

- [ ] **VERCEL_PROJECT_ID_BACKEND** = `<paste backend project ID here>`

### 3.4 Backend Domains
1. Go to **Backend Vercel project → Deployments**
2. Find the production deployment
3. Copy the URL (e.g., `myportfolio-api.vercel.app`)

- [ ] **ALLOWED_HOSTS** = `<paste backend domain without https://>`
  - Example: `myportfolio-api.vercel.app`

Get your frontend domain:
1. Go to **Frontend Vercel project → Deployments**
2. Find the production deployment
3. Copy the URL (e.g., `myportfolio-frontend.vercel.app`)

- [ ] **CORS_ALLOWED_ORIGINS** = `https://<paste frontend domain>`
  - Example: `https://myportfolio-frontend.vercel.app`

- [ ] **CSRF_TRUSTED_ORIGINS** = `https://<paste frontend domain>`
  - Example: `https://myportfolio-frontend.vercel.app`

- [ ] **NEXT_PUBLIC_API_URL** = `https://<paste backend domain>/api/v1`
  - Example: `https://myportfolio-api.vercel.app/api/v1`

### 3.5 Database Connection
1. Go to **Backend Vercel project → Storage**
2. Find **PostgreSQL**
3. Click **Connect** or select the database
4. Copy the **POSTGRES_URL_NON_POOLING** (not the regular URL)

- [ ] **DATABASE_URL** = `<paste PostgreSQL connection string>`

### 3.6 Email Settings (Gmail SMTP)
These are fixed values:

- [ ] **EMAIL_HOST** = `smtp.gmail.com`
- [ ] **EMAIL_PORT** = `587`
- [ ] **EMAIL_USE_TLS** = `True`
- [ ] **EMAIL_USE_SSL** = `False`
- [ ] **EMAIL_HOST_USER** = `jhonjordan010@gmail.com`
- [ ] **DEFAULT_FROM_EMAIL** = `jhonjordan010@gmail.com`
- [ ] **CONTACT_EMAIL** = `jhonjordan010@gmail.com`

### 3.7 Gmail App Password
**⚠️ This is NOT your Gmail password!**

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Check **2-Step Verification** is ON
3. Go to **App passwords** (only appears if 2FA is enabled)
4. Select:
   - App: **Mail**
   - Device: **Windows Computer** (or your OS)
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

- [ ] **EMAIL_HOST_PASSWORD** = `<paste 16-char app password>`

---

## ✅ Step 4: Add Secrets to GitHub

Go to: **GitHub Repo → Settings → Secrets and variables → Actions → New repository secret**

Add each secret one by one. **Secret names are CASE-SENSITIVE**.

```
VERCEL_TOKEN = <from 3.2>
VERCEL_ORG_ID = <from 3.2>
VERCEL_PROJECT_ID_FRONTEND = <from 3.3>
VERCEL_PROJECT_ID_BACKEND = <from 3.3>
BACKEND_SECRET_KEY = <from 3.1>
ALLOWED_HOSTS = <from 3.4>
CORS_ALLOWED_ORIGINS = <from 3.4>
CSRF_TRUSTED_ORIGINS = <from 3.4>
NEXT_PUBLIC_API_URL = <from 3.4>
DATABASE_URL = <from 3.5>
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_HOST_USER = jhonjordan010@gmail.com
EMAIL_HOST_PASSWORD = <from 3.7>
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
DEFAULT_FROM_EMAIL = jhonjordan010@gmail.com
CONTACT_EMAIL = jhonjordan010@gmail.com
```

**Status**: [ ] All 18 secrets added to GitHub

---

## ✅ Step 5: First Deployment

### Manual Trigger (Recommended for first deploy)
1. Go to your GitHub repo
2. Click **Actions** tab
3. Select **Backend Deploy to Vercel**
4. Click **Run workflow → Run workflow**
5. Wait for it to complete (watch the logs)
6. Once backend succeeds, do the same for **Frontend Deploy to Vercel**

### Auto Deployment (After first success)
Just push any change to `main` branch - both workflows trigger automatically.

**Status**: [ ] Backend deployed successfully
**Status**: [ ] Frontend deployed successfully

---

## ✅ Step 6: Verify Live URLs

After deployment:

1. **Frontend**: Visit your frontend Vercel URL
   - Should load your portfolio with animations
   - Should connect to backend API

2. **Backend API**: Visit `https://<your-backend-domain>/api/v1/`
   - Should return API endpoints

3. **Admin Panel**: Visit `https://<your-backend-domain>/admin/`
   - Should show Django admin login

**Status**: [ ] Frontend loads and displays
**Status**: [ ] Backend API responds
**Status**: [ ] Admin panel accessible

---

## ✅ Step 7: One-Time Database Setup

Run these commands **once** from your local machine:

```bash
# Set production database connection
export DATABASE_URL="<your DATABASE_URL from GitHub secret>"

# Navigate to backend
cd backend

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Follow prompts to set username, email, password
```

**Status**: [ ] Database migrations completed
**Status**: [ ] Superuser created

---

## 🆘 Troubleshooting

### Frontend won't deploy
- Check: `NEXT_PUBLIC_API_URL` is correct
- Check: Secret name is exactly `NEXT_PUBLIC_API_URL` (case-sensitive)
- View logs: GitHub Actions → Frontend Deploy → Click failed run

### Backend won't deploy
- Check: `BACKEND_SECRET_KEY` is not empty
- Check: `DATABASE_URL` is correct (includes postgresql://)
- Check: `ALLOWED_HOSTS` matches backend domain
- View logs: GitHub Actions → Backend Deploy → Click failed run

### Email not sending
- Verify: `EMAIL_HOST_PASSWORD` is Google App Password (16 chars), NOT Gmail password
- Verify: 2FA is enabled on Gmail account
- Test: Send a contact form and check backend logs

### CORS/CSRF errors
- Check: `CORS_ALLOWED_ORIGINS` has `https://` prefix
- Check: `CSRF_TRUSTED_ORIGINS` has `https://` prefix
- Check: Both match your frontend domain exactly
- Check: `ALLOWED_HOSTS` matches backend domain (without https://)

### Static files not loading
- This is handled automatically by Vercel
- If issue persists, check Django admin loads at all

---

## 📋 Final Verification Checklist

- [ ] All 3 workflow files created (`.github/workflows/`)
- [ ] Both Vercel config files created (`frontend/vercel.json`, `backend/vercel.json`)
- [ ] All files pushed to GitHub `main` branch
- [ ] 18 secrets added to GitHub repository
- [ ] Backend deployed successfully to Vercel
- [ ] Frontend deployed successfully to Vercel
- [ ] Frontend URL works and displays portfolio
- [ ] Backend API responds at `/api/v1/`
- [ ] Admin panel at `/admin/` is accessible
- [ ] Database migrations completed
- [ ] Superuser created
- [ ] Contact form email sending (test optional)

---

## 🎯 Next Steps After Deployment

1. **Make code changes** → Push to `main` → Auto-deploys to production
2. **Create feature branches** → Open PR → CI checks run (no production deploy)
3. **Update portfolio** → Use admin dashboard at `https://<backend>/admin/`
4. **Monitor** → Check GitHub Actions for deploy status

---

**Deployment Date**: _______________

**Frontend URL**: _______________

**Backend URL**: _______________

**Notes**: _______________

