# Deployment Guide

## Frontend (Netlify)

1. Environment Variables

    - Set up the following environment variables in Netlify:
        ```
        VITE_SUPABASE_URL=your_supabase_url
        VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
        VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
        VITE_CLIENT_URL=your_netlify_url
        ```

2. Build Settings

    - Build command: `npm run build`
    - Publish directory: `dist`
    - Node version: 18

3. Deployment
    - Connect your GitHub repository to Netlify
    - Enable automatic deployments
    - Configure branch deployments (main/production)

## Backend (Heroku)

1. Environment Variables

    - Set up the following environment variables in Heroku:
        ```
        NODE_ENV=production
        SUPABASE_URL=your_supabase_url
        SUPABASE_ANON_KEY=your_supabase_anon_key
        STRIPE_SECRET_KEY=your_stripe_secret_key
        JWT_SECRET=your_jwt_secret
        CLIENT_URL=your_netlify_url
        ```

2. Database

    - Ensure Supabase database is properly configured
    - Run any pending migrations
    - Verify database connections

3. Deployment
    - Connect your GitHub repository to Heroku
    - Enable automatic deployments
    - Configure branch deployments (main/production)

## Post-Deployment Checklist

1. Frontend

    - [ ] Verify all environment variables are set
    - [ ] Test authentication flow
    - [ ] Test product listing and details
    - [ ] Test cart functionality
    - [ ] Test checkout process
    - [ ] Verify Stripe integration
    - [ ] Check responsive design
    - [ ] Verify image loading
    - [ ] Test API endpoints

2. Backend

    - [ ] Verify all environment variables are set
    - [ ] Test database connections
    - [ ] Verify API endpoints
    - [ ] Test authentication
    - [ ] Test file uploads
    - [ ] Verify Stripe webhooks
    - [ ] Check error handling
    - [ ] Monitor logs for issues

3. Security

    - [ ] Verify HTTPS is enabled
    - [ ] Check CORS configuration
    - [ ] Verify API rate limiting
    - [ ] Test input validation
    - [ ] Check error messages
    - [ ] Verify secure headers

4. Performance
    - [ ] Check loading times
    - [ ] Verify image optimization
    - [ ] Test caching
    - [ ] Monitor API response times
    - [ ] Check database query performance

## Troubleshooting

### Common Issues

1. Frontend

    - CORS errors: Check backend CORS configuration
    - Environment variables: Verify all variables are set in Netlify
    - Build failures: Check build logs and dependencies

2. Backend
    - Database connection: Verify Supabase credentials
    - API errors: Check logs and error handling
    - Memory issues: Monitor Heroku dyno usage

### Support

-   Frontend issues: Check Netlify deployment logs
-   Backend issues: Check Heroku logs
-   Database issues: Check Supabase dashboard
-   Payment issues: Check Stripe dashboard
