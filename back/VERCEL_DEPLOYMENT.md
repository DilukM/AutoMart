# Vercel Deployment Guide

## Quick Deploy

1. **Push your code to GitHub**
2. **Go to [vercel.com](https://vercel.com)**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure the following settings:**

   ### Build Settings
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend` (if your backend is in a subfolder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

   ### Environment Variables
   Add these in Vercel dashboard under Project Settings > Environment Variables:

   ```
   DB_HOST=your-mysql-host
   DB_PORT=3306
   DB_USERNAME=your-db-username
   DB_PASSWORD=your-db-password
   DB_DATABASE=your-db-name
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h
   AI_SERVICE=gemini
   GEMINI_API_KEY=your-gemini-api-key
   OPENAI_API_KEY=your-openai-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   NODE_ENV=production
   ```

6. **Deploy!** Vercel will build and deploy your API automatically.

## Post-Deployment

- Your API will be available at: `https://your-project.vercel.app`
- API Documentation: `https://your-project.vercel.app/api-docs`
- Health Check: `https://your-project.vercel.app/health`

## Troubleshooting

### Build Failures
- Check that all environment variables are set
- Ensure your database is accessible from Vercel's IP ranges
- Verify that all dependencies are properly listed in package.json

### Runtime Errors
- Check Vercel function logs in the dashboard
- Ensure your database connection string is correct
- Verify API keys are valid and have proper permissions

### Cold Starts
- Vercel serverless functions may have cold start delays
- This is normal for serverless deployments
- Consider keeping your API warm with periodic health checks