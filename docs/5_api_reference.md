# 📖 API Reference

This document provides a reference for the ChompChew API endpoints.

## Base URL

All API routes are prefixed with `/api`.

-   **Development**: `http://localhost:3000/api`
-   **Production**: `https://your-production-domain.com/api`

---

## Health Check

### `GET /api/health`

Provides a real-time status check of the application and its connected services.

-   **Method**: `GET`
-   **Authentication**: None
-   **Success Response** (`200 OK`):
    ```json
    {
      "status": "ok",
      "timestamp": "2025-06-14T02:27:13.198Z",
      "services": {
        "redis": { "status": "ok", "message": "Redis is healthy" },
        "supabase": { "status": "ok", "message": "Supabase is healthy" },
        "openai": { "status": "ok", "message": "OpenAI is healthy" }
      }
    }
    ```
-   **Error Response** (`503 Service Unavailable`): If any service is down, the status for that service will be `"error"`.

---

## Recipe Generation

### `POST /api/recipes/generate`

Generates a new recipe using AI based on a user's prompt and constraints.

-   **Method**: `POST`
-   **Authentication**: Required (User must be logged in)
-   **Rate Limit**: 10 requests per hour per user.

-   **Request Body**:
    ```json
    {
      "prompt": "A healthy and delicious chicken stir-fry",
      "dietaryPreferences": ["gluten-free"],
      "allergens": ["peanuts"]
    }
    ```

-   **Success Response** (`200 OK`):
    ```json
    {
      "success": true,
      "recipeMarkdown": "# Chicken Stir-Fry...",
      "imageUrl": "https://<your-supabase-url>/..."
    }
    ```

-   **Error Responses**:
    -   `400 Bad Request`: Invalid or missing request body.
    -   `401 Unauthorized`: User is not authenticated.
    -   `429 Too Many Requests`: User has exceeded the rate limit.
    -   `500 Internal Server Error`: An unexpected error occurred during recipe generation.

---

## Authentication

Authentication is handled by **NextAuth.js**. The following routes are automatically created:

-   `GET /api/auth/session`: Returns the current user session.
-   `POST /api/auth/signin`: Initiates the sign-in process.
-   `POST /api/auth/signout`: Logs the user out.
-   `GET /api/auth/providers`: Returns the configured authentication providers. 