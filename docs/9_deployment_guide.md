# 🚀 Deployment Guide

This guide provides instructions for deploying the ChompChew application to a production environment. Our recommended hosting provider is **[Vercel](https://vercel.com/)**, as it is built by the creators of Next.js and offers a seamless deployment experience.

## Prerequisites

-   You have an account with [Vercel](https://vercel.com/signup).
-   You have connected your GitHub account to Vercel.
-   You have already pushed the project to a GitHub repository.

## 1. Importing the Project

1.  From your Vercel dashboard, click **"Add New..."** and select **"Project"**.
2.  Find your `ChompChew2.0` GitHub repository and click the **"Import"** button.
3.  Vercel will automatically detect that this is a Next.js project and configure the build settings for you. You typically do not need to change these.

## 2. Configuring Environment Variables

This is the most critical step. You must provide Vercel with the same secret keys that you use in your `.env.local` file for development.

1.  In the **"Configure Project"** screen, expand the **"Environment Variables"** section.
2.  Add each of the following variables one by one. For security, it's highly recommended to use different Supabase and Redis instances for production than you do for development.

    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    -   `SUPABASE_SERVICE_ROLE_KEY`
    -   `NEXTAUTH_SECRET` (Generate a new, strong secret for production)
    -   `NEXTAUTH_URL` (This will be your production URL, e.g., `https://chompchew.vercel.app`)
    -   `UPSTASH_REDIS_REST_URL`
    -   `UPSTASH_REDIS_REST_TOKEN`
    -   `OPENAI_API_KEY`

3.  Click the **"Deploy"** button.

Vercel will now start building and deploying your application. You can monitor the progress in the build logs.

## 3. Setting a Custom Domain (Optional)

Once the deployment is successful, Vercel will assign you a `.vercel.app` URL. To use a custom domain:

1.  Navigate to your project's dashboard in Vercel.
2.  Go to the **"Settings"** tab and click on **"Domains"**.
3.  Enter your custom domain and follow the on-screen instructions to configure your DNS records (usually involves adding an `A` record or a `CNAME` record with your domain registrar).

## Continuous Deployment (CI/CD)

By default, Vercel sets up a CI/CD pipeline for you:

-   **Production Branch**: Every push or merge to your `main` branch will automatically trigger a new production deployment.
-   **Preview Branches**: Every pull request will automatically generate a unique "preview" deployment. This allows you to review changes on a live, shareable URL before merging them into production.

This workflow is highly recommended as it allows for thorough testing and review before changes go live. 