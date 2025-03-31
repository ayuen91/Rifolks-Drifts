# Deployment Guide for Rifolks Drifts

## Prerequisites

-   Node.js >= 18.17.0
-   Git
-   Heroku CLI
-   Netlify CLI
-   PostgreSQL database

## Environment Variables Setup

### Backend (Heroku)

Required environment variables:

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=<generate-a-secure-secret>
JWT_EXPIRES_IN=7d

# Supabase
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>

# CORS
ALLOWED_ORIGINS=https://your-netlify-app.netlify.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Frontend (Netlify)

Required environment variables:

```bash
# API Configuration
REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api
REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# Feature Flags
REACT_APP_ENABLE_TRY_ON=true
REACT_APP_ENABLE_COD_RULES=true
```

## Deployment Steps

### Backend Deployment (Heroku)

1. Create a new Heroku app:

```bash
heroku create rifolks-drifts-backend
```

2. Add PostgreSQL addon:

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. Set environment variables:

```bash
heroku config:set JWT_SECRET=<your-secret>
heroku config:set SUPABASE_URL=<your-url>
# ... set other variables
```

4. Deploy the application:

```bash
git push heroku main
```

5. Run database migrations:

```bash
heroku run npm run migrate
```

### Frontend Deployment (Netlify)

1. Build the application locally:

```bash
cd frontend
npm run build
```

2. Deploy using Netlify CLI:

```bash
netlify deploy --prod
```

Or connect your GitHub repository to Netlify for automatic deployments.

## Post-Deployment Checklist

### Backend

-   [ ] Database migrations completed successfully
-   [ ] Environment variables properly set
-   [ ] CORS configured correctly
-   [ ] Rate limiting working
-   [ ] Logging system operational
-   [ ] API endpoints responding correctly

### Frontend

-   [ ] Build completed without errors
-   [ ] Environment variables properly set
-   [ ] API calls working correctly
-   [ ] Static assets loading properly
-   [ ] Routing working correctly
-   [ ] COD features functioning as expected

### General

-   [ ] SSL certificates valid
-   [ ] Error monitoring set up
-   [ ] Performance monitoring configured
-   [ ] Backup system in place
-   [ ] Security headers configured
-   [ ] Rate limiting working

## Monitoring and Maintenance

### Logging

-   Backend logs: `heroku logs --tail`
-   Frontend logs: Netlify dashboard

### Performance Monitoring

-   Use Heroku metrics for backend
-   Netlify analytics for frontend
-   Set up error tracking (e.g., Sentry)

### Backup

-   Database backups configured
-   Regular backup schedule in place
-   Backup restoration tested

## Troubleshooting

### Common Issues

1. CORS errors

    - Check ALLOWED_ORIGINS configuration
    - Verify frontend API URL

2. Database connection issues

    - Verify DATABASE_URL
    - Check database credentials
    - Ensure database is running

3. Build failures
    - Check Node.js version
    - Verify all dependencies
    - Check for environment variables

### Support

For deployment issues:

-   Check Heroku logs
-   Review Netlify build logs
-   Contact support if needed
