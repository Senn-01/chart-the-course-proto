# Netlify Deployment Guide

This repository is configured for deployment on Netlify.

## Prerequisites

1. A Netlify account
2. A Supabase project with database configured
3. OpenAI API key (for AI features)

## Deployment Steps

### 1. Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Senn-01/chart-the-course-proto)

Or manually:

1. Fork/clone this repository
2. Log in to [Netlify](https://app.netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub account and select this repository
5. Configure build settings (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `.next`

### 2. Configure Environment Variables

In your Netlify site settings, go to "Site configuration" > "Environment variables" and add:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key

# Netlify will automatically set:
# NEXT_PUBLIC_APP_URL (uses $URL)
# URL (your site URL)
# DEPLOY_URL (unique URL for each deploy)
```

### 3. Set up Supabase

1. Create a new Supabase project
2. Run the migrations in `supabase/migrations/` in order:
   - `001_initial_schema.sql`
3. Copy your project URL and keys to Netlify environment variables

### 4. Deploy

1. Push your changes to trigger a deployment
2. Or manually trigger a deploy from the Netlify dashboard

## Features

- Next.js 14 with App Router
- Netlify Functions for serverless API endpoints
- Automatic HTTPS and CDN
- Preview deployments for pull requests
- Form handling capabilities (if needed)

## Local Development

```bash
# Install dependencies
npm install

# Run locally with Netlify CLI (recommended)
npx netlify-cli dev

# Or run Next.js directly
npm run dev
```

## Netlify Functions

The Supabase Edge Functions have been converted to Netlify Functions:
- `/api/vision-chat` - AI chat for vision guidance
- `/api/transcribe-log` - Audio transcription for daily logs

These are automatically deployed with your site.

## Troubleshooting

1. **Build failures**: Check the deploy logs in Netlify dashboard
2. **Function errors**: View function logs in Netlify dashboard
3. **Environment variables**: Ensure all required variables are set
4. **CORS issues**: The functions include CORS headers for cross-origin requests

## Performance Optimizations

- Next.js automatic code splitting
- Netlify Edge CDN for static assets
- Optimized function cold starts
- Automatic image optimization with Next.js Image

## Support

For issues specific to Netlify deployment, check:
- [Netlify Documentation](https://docs.netlify.com)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/)
- Project issues on GitHub