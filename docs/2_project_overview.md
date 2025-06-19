# 📄 Project Overview

## Mission

**To remove the daily "What can I actually eat?" anxiety by providing personalized, AI-powered recipe discovery that respects individual dietary needs, restrictions, and health conditions.**

ChompChew is built for people with dietary restrictions (e.g., allergies, intolerances), medical conditions (e.g., Ulcerative Colitis, Crohn's, IBS), and specific health goals (e.g., high-protein, low-carb) who struggle with the constant stress of meal planning.

## Core Features

-   **AI-Powered Recipe Generation**: Leverages OpenAI's GPT models to create unique recipes tailored to a user's specific constraints and available ingredients.
-   **Advanced Safety Validation**: A multi-layered system that checks recipes against a user's allergens and medical triggers to ensure food safety.
-   **Personalized Discovery**: A "For You" feed that recommends recipes based on a user's saved dietary profile, including ingredients to embrace or avoid.
-   **Advanced Search**: Granular search and filtering by ingredients, nutritional targets, dietary tags, and more.
-   **Saved Recipes (Cookbook)**: Allows users to save, organize, and revisit their favorite recipes.
-   **Dynamic User Profiles**: A comprehensive profile where users manage their dietary needs, which personalizes the entire app experience.

## Tech Stack

This project is built with a modern, robust, and scalable technology stack.

-   **Framework**: [Next.js](https://nextjs.org/) (v15) with the App Router
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [Supabase](https://supabase.com/) (PostgreSQL with Realtime & Storage)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (using the Supabase adapter)
-   **Caching**: [Upstash Redis](https://upstash.com/) for high-performance data caching
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Services**: [OpenAI API](https://openai.com/) (GPT-4 family) for recipe generation
-   **Component Library**: [shadcn/ui](https://ui.shadcn.com/) (used for some UI elements)
-   **Testing**: [Vitest](https://vitest.dev/) for unit/integration tests and [Playwright](https://playwright.dev/) for E2E tests 