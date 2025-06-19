# 🚀 Getting Started with ChompChew

This guide provides everything you need to get the ChompChew application running locally on your development machine.

## 1. Prerequisites

Make sure you have the following software installed on your system:

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [Git](https://git-scm.com/)

## 2. Installation

First, clone the repository to your local machine and navigate into the project directory.

```bash
git clone https://github.com/Pbein/ChompChew2.0.git
cd ChompChew2.0
```

Next, install all the required dependencies using `npm`.

```bash
npm install
```

## 3. Environment Configuration

The application requires several external services to function correctly. You'll need to configure your environment variables to connect to them.

Create a new file named `.env.local` in the root of the project and add the following content.

```env
# Supabase Configuration
# Get these from your Supabase project dashboard > Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth.js Configuration
# A long, random string used to sign tokens
NEXTAUTH_SECRET=generate_a_secret_here
NEXTAUTH_URL=http://localhost:3000

# Upstash Redis Configuration (for Caching)
# Get these from your Upstash Redis database dashboard
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# OpenAI Configuration (for AI Recipe Generation)
OPENAI_API_KEY=your_openai_api_key
```

> **Security Note**: The `.env.local` file is ignored by Git, so your secret keys will not be committed to the repository.

## 4. Database Setup

This project uses Supabase for its PostgreSQL database.

1.  Navigate to your Supabase project dashboard.
2.  Go to the **SQL Editor**.
3.  Create a **New query**.
4.  Copy the entire content of the `supabase/schema.sql` file from this repository and paste it into the editor.
5.  Click **Run** to execute the script. This will create all necessary tables, relationships, and row-level security policies.

## 5. Running the Application

Once the installation and configuration are complete, you can start the development server.

```bash
npm run dev
```

The application will now be running and accessible at [http://localhost:3000](http://localhost:3000).

## 6. Health Check

To verify that all services (Supabase, Redis, OpenAI) are connected and running correctly, you can visit the health check endpoint in your browser or use a tool like `curl`.

```bash
curl http://localhost:3000/api/health
```

You should see a JSON response indicating that all services are "healthy". If any service shows an error, please double-check the relevant environment variables in your `.env.local` file. 