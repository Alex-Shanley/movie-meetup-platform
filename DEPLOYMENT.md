# Deployment Guide

## Backend Deployment on Render

### 1. Create PostgreSQL Database
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Fill in:
   - Name: `movie-meetup-db`
   - Database: `moviemeetup_db`
   - User: (auto-generated)
   - Region: Oregon (US West) - same as frontend
   - Plan: Free
4. Click "Create Database"
5. Save the **Internal Database URL** - you'll need this

### 2. Create Web Service for Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `movie-meetup-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn moviemeetup.wsgi:application`
   - **Plan**: Free

### 3. Set Environment Variables
Add these environment variables in Render dashboard:

```
SECRET_KEY=<generate-a-secure-random-string>
DEBUG=False
DATABASE_URL=<your-internal-database-url-from-step-1>
TMDB_API_KEY=<your-tmdb-api-key>
CORS_ALLOWED_ORIGINS=https://movie-meetup-platform.onrender.com
```

**Important**: 
- Replace `https://movie-meetup-platform.onrender.com` with your actual frontend URL
- Generate a secure SECRET_KEY (use: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)

### 4. Deploy
Click "Create Web Service" - Render will automatically deploy

## Frontend Configuration

### Update Frontend to Use Backend API
1. Create `.env` file in `frontend/` directory:
```
VITE_API_URL=https://movie-meetup-backend.onrender.com
```

2. Update API service to use environment variable

## Troubleshooting

### Database Connection Issues
- Ensure you're using the **Internal Database URL** (not External)
- Check that DATABASE_URL is set correctly

### CORS Issues
- Add your frontend URL to CORS_ALLOWED_ORIGINS
- Format: `https://your-frontend.onrender.com` (no trailing slash)

### Static Files Not Loading
- Check that build.sh ran successfully
- Verify WhiteNoise is in MIDDLEWARE

### Migration Issues
- Migrations run automatically via build.sh
- Check build logs if migrations fail
