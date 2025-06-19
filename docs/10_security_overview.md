# 🔒 Security Overview

This document outlines the key security measures implemented in the ChompChew application to protect user data and ensure a safe, trustworthy platform. Given the sensitive nature of user health and dietary information, security is a top priority.

## Core Principles

-   **Least Privilege**: Services and users are only granted the minimum permissions necessary to perform their functions.
-   **Defense in Depth**: We use multiple layers of security, so that if one layer fails, others are still in place to protect the system.
-   **Secure by Default**: The application is designed to be secure out-of-the-box, with strict data access policies at the database level.

## 1. Data Access Control: Row Level Security (RLS)

This is the most critical security feature for protecting user data.

-   **Implementation**: We use **Supabase's Row Level Security (RLS)** on every table that contains user-specific information (`users`, `user_favorites`, `shopping_lists`, etc.).
-   **How it Works**: RLS policies are rules at the database level that filter which rows a user is allowed to access. The policies are tied to the user's unique ID (`auth.uid()`) from their authentication token.
-   **Guarantee**: A user can **NEVER** see, modify, or delete another user's data. A query for another user's profile will return zero rows, as if the data does not exist. This is enforced by the database itself, not just the application code.

## 2. API Security

Our API endpoints, which handle actions like recipe generation, are protected by several mechanisms.

-   **Authentication**: All sensitive API endpoints are protected and require a valid user session, managed by **NextAuth.js**. Unauthenticated requests are rejected.
-   **Rate Limiting**: To prevent abuse and control costs (especially for the OpenAI API), we implement IP-based rate limiting on critical endpoints like `/api/recipes/generate`. The current limit is 10 requests per hour. This is implemented in `src/lib/middleware/rateLimiter.ts`.
-   **Input Validation**: We plan to implement schema validation using **Zod** for all API route inputs. This will ensure that all incoming data is in the expected format and type, preventing a wide range of potential injection and data corruption vulnerabilities.

## 3. Authentication

-   **Provider**: User authentication is handled by **[NextAuth.js](https://next-auth.js.org/)**, an industry-standard, secure library for authentication in Next.js.
-   **Session Management**: NextAuth.js securely manages user sessions using signed, HTTP-only cookies, which helps mitigate Cross-Site Scripting (XSS) attacks. It also includes built-in Cross-Site Request Forgery (CSRF) protection.

## 4. Secrets Management

-   **Environment Variables**: All secret keys, API tokens, and database credentials are managed through environment variables.
-   **Local Development**: In development, these are stored in a `.env.local` file, which is explicitly ignored by Git via the `.gitignore` file.
-   **Production**: In production (e.g., on Vercel), these are stored as secure environment variables in the hosting platform's dashboard.
-   **No Hardcoded Secrets**: There are absolutely no secret keys hardcoded anywhere in the application's source code.

This multi-layered approach ensures that the application is resilient to common web vulnerabilities and that user data is handled with the highest standard of care. 