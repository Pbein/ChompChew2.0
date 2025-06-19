# 🏗️ Architecture Overview

This document describes the high-level architecture of the ChompChew application, based on its current implementation.

## Frontend Architecture

The frontend is built using the **Next.js App Router**, which organizes the application by features and routes.

### Directory Structure (`src/`)

-   **`app/`**: Contains all routes and UI pages of the application.
    -   `page.tsx`: The homepage.
    -   `layout.tsx`: The root layout for the entire application.
    -   `api/`: Handles all backend API routes, such as `/api/health` and `/api/recipes/generate`.
    -   `auth/`: Contains the sign-in and sign-up pages.
    -   `[feature]/`: Each core feature (e.g., `profile`, `search`, `generate-recipe`) has its own directory, containing its `page.tsx` and related components.

-   **`components/`**: Home to shared, reusable React components used across multiple pages (e.g., `Header.tsx`, `RecipeCard.tsx`).

-   **`features/`**: Contains feature-specific logic and components that are not routes. This is where most of the core application logic resides.
    -   `core/`: Foundational services, types, and stores.
        -   `services/`: The heart of the business logic (`recipeGenerationService`, `userService`, etc.).
        -   `stores/`: Zustand stores for client-side state management.
        -   `types/`: Core TypeScript types and interfaces.
    -   `[feature]/`: Feature-specific components and logic (e.g., `features/search/components/`).

-   **`lib/`**: A collection of utility functions, client initializations (Supabase, Redis, OpenAI), and other shared logic that doesn't fit into the `features` directory.

-   **`styles/`**: Although not present, this is where global styles and CSS would go. Currently, styling is handled by Tailwind CSS utility classes directly in components.

## Backend & Services Architecture

The "backend" consists of API routes within the Next.js app and several external services.

-   **API Routes**: Server-side logic is handled in `src/app/api/`. These are serverless functions that process requests for tasks like recipe generation.

-   **Core Services (`src/features/core/services/`)**:
    -   **`recipeGenerationService.ts`**: Orchestrates the logic for calling the OpenAI API, building prompts, and processing the results.
    -   **`safetyValidationService.ts`**: A critical service that validates recipes against a user's dietary profile to ensure safety.
    -   **`userService.ts`**: Manages all interactions with user data in the database (profiles, favorites).
    -   **`cacheService.ts`**: Handles all caching logic, using Redis to store and retrieve frequently accessed data to improve performance.

-   **Database (`supabase/`)**:
    -   The database schema is defined in `supabase/schema.sql`.
    -   It uses **Supabase** for PostgreSQL hosting, which provides a relational database, authentication, and file storage.
    -   **Row-Level Security (RLS)** is enabled on all critical tables to ensure users can only access their own data.

## Data Flow Example: AI Recipe Generation

To illustrate how these pieces fit together, here is the data flow for generating a new recipe:

1.  A user on the `/generate-recipe` page submits a prompt.
2.  The frontend calls the `/api/recipes/generate` API route.
3.  The API route invokes the `recipeGenerationService`.
4.  The `recipeGenerationService` builds a detailed prompt and calls the **OpenAI API**.
5.  Upon receiving the recipe, it calls the `safetyValidationService` to check it against the user's profile.
6.  The generated image is uploaded to **Supabase Storage** via the `aiImageService`.
7.  The final, validated recipe data (with the permanent image URL) is returned to the frontend and displayed to the user.
8.  The user's request count is updated in the **Redis cache** via the `cacheService` to manage rate limiting. 