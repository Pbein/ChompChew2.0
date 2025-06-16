# 🍽️ ChompChew — High-Level Product Overview

## 🧠 App Mission

ChompChew helps people with unique dietary needs discover, filter, and generate recipes tailored to their exact health preferences.

Built with real needs in mind—like ulcerative colitis, allergies, veganism, or macro goals—this app allows users to embrace the foods that nourish them and avoid the ones that don't.

## 🗺️ Key Use Cases

- Find UC-safe, low-fiber, or inflammation-friendly meals
- Discover high-protein or low-carb options based on macro goals
- Avoid problematic ingredients and highlight preferred ones
- Save and organize go-to meals
- Generate AI-powered custom recipes based on ingredients and preferences

## 🧱 Core Features

| Feature                          | Description                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------- |
| 🧭 Homepage Discovery Feed       | For guests, it shows a variety of popular recipes. For authenticated users, it's a fully personalized "For You" feed based on their profile. |
| 🔍 Simple Search Bar (on homepage) | Quickly search recipes by keyword or tag                                     |
| ⚙️ Advanced Search Page          | Granular filtering (ingredients, macros, tags, nutrition)                    |
| 🧠 AI Recipe Generation          | Custom recipe generation via OpenAI                                          |
| 📄 Recipe Detail Page            | Full recipe instructions & nutrition. Details like fiber and macros are dynamically highlighted based on the user's dietary profile. |
| 📘 Saved Recipes (Cookbook)      | Bookmark, organize, and revisit recipes                                      |
| 👤 User Profile                  | Manages dietary preferences, including allergies, dietary profiles (e.g., Vegan, Keto), ingredients to avoid/embrace, macro targets, and sensitivities (e.g., fiber), which personalize the entire app experience. |
| 🔐 Auth                          | Login/signup, save preferences and favorites                                 |

## 🧭 Navigation Bar Layout

| Item                       | Function                                                               |
| -------------------------- | ---------------------------------------------------------------------- |
| 🏠 Logo (click = homepage)   | Always links to recipe discovery                                       |
| 🔍 Advanced Search         | Takes user to full-feature search/filter page                          |
| 🧠 Generate Recipe         | Launches AI-powered recipe generation flow                             |
| 📘 Saved Recipes           | Links to the user's cookbook                                           |
| 👤 Profile                 | Sign In / Sign Up if not logged in; shows profile dropdown if authenticated |

## 🏠 Homepage Layout

```
+-------------------------------------------------------------+
| 🔍 [ Simple search bar... ]   👤 Sign In / Profile          |
+-------------------------------------------------------------+
| 🍲 Discovery Feed                                              |
|   [Recommended: "Low Fiber", "UC-Safe", "30g Protein"]       |
|   [Chicken & Rice Soup ✅]    [Avocado Bowl ❌]              |
|   ...                                                        |
+-------------------------------------------------------------+
```

- Simple search bar lets users type "chicken" or "vegan pasta" with auto-complete
- Recipes shown are filtered according to user's profile preferences
- The discovery feed uses a responsive grid of modern recipe cards with safety indicators. It also features a horizontal scrolling category system for quick discovery.
- Each card displays:
  - Ingredient highlights (e.g. contains embraced ingredients)
  - Nutrition snippet (dynamically highlighting what's important to the user)
  - Save button

## 🧩 MVP Feature Breakdown

| MVP Area           | Features                                                              |
| ------------------ | --------------------------------------------------------------------- |
| 🔐 Auth            | Sign up / Sign in / Logout                                            |
| 👤 Profile         | Avoided ingredients, embraced ingredients, dietary tags, fiber level, macro targets |
| 🏠 Homepage        | Simple search + discovery feed with personalized results              |
| 🔍 Advanced Search | Filters for ingredients, nutrition, tags                              |
| 🧠 Generate Recipe | AI form → generated recipe card view                                  |
| 📘 Saved Recipes   | Save/view/remove bookmarked meals                                     |
| 📄 Recipe Page     | Ingredient + nutrition view with context-aware data, save button      |

## 🗂️ Suggested Folder/Route Structure (Next.js)

```bash
/pages
  /index.tsx              # Homepage (Discovery Feed + Simple Search)
  /login.tsx              # Auth
  /profile.tsx            # User dietary preferences
  /search.tsx             # Advanced Search
  /generate.tsx           # AI recipe generator
  /recipe/[id].tsx        # Recipe detail
  /cookbook.tsx           # Saved recipes
```

## 🗄️ Backend Data (Supabase)

| Table                | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| `users`              | Auth & ID                                                         |
| `profiles`           | User preferences (ingredients, tags, macros, fiber sensitivity)   |
| `recipes`            | Core recipe data                                                  |
| `ingredients`        | Ingredient info, including detailed nutritional data (macros, calories, fiber, etc.) |
| `recipe_ingredients` | Join table for ingredients per recipe                             |
| `favorites`          | User-saved recipes                                                |
| `ai_requests` (optional) | Log of AI-generated requests and outputs                        |

## ✨ Personalization Engine
A core principle of ChompChew is intelligent and personalized information display. The app avoids overwhelming users with data that isn't relevant to their goals.

- **Conditional Nutrition Details:** Nutritional information such as fiber content, detailed macros (fat, carbs, protein), and calorie counts are stored for all recipes and ingredients.
- **Contextual Highlighting:** This information is surfaced dynamically. For a user with a "UC-Safe" profile, fiber content will be prominently displayed. For a user focused on "High Protein," protein grams will be highlighted. A user looking for a simple dessert may not see these details unless they've set relevant preferences.
- **User-Centric UI:** The goal is to make the UI cleaner and more relevant for each individual user, directly supporting the mission to reduce dietary anxiety.

## 👥 User Experience States (Authenticated vs. Unauthenticated)
ChompChew is designed to serve both first-time visitors and registered users effectively, with distinct experiences tailored to each.

### **Guest Experience (Unauthenticated)**
The primary goal for unauthenticated users is to showcase the app's power and value, encouraging them to create a profile.
- **Homepage Discovery:** The discovery feed displays a curated selection of popular, highly-rated, or trending recipes across diverse categories (e.g., "30-Minute Meals," "Vegan," "Low-Carb"). This provides a taste of the app's breadth.
- **Full Search Access:** Guests can use the full search and filtering capabilities to find recipes.
- **No Persistence:** Preferences and saved recipes are not stored. A prompt to sign up will appear when users attempt to save a recipe or access profile-based features.

### **Personalized Experience (Authenticated)**
For authenticated users, the app transforms into a highly personalized dietary tool.
- **"For You" Discovery Feed:** The homepage becomes a tailored feed where recipes are algorithmically recommended based on the user's saved dietary profile, including their embraced/avoided ingredients, macro targets, and health conditions.
- **Dynamic Content:** Recipe details, search results, and suggestions are all influenced by the user's profile. Nutritional information (like fiber or protein) is highlighted based on what's important to them.
- **Persistence and History:** All saved recipes, collections, and preferences are stored, creating a long-term, evolving relationship with the user.

## 🏗️ Rebuild & Development Plan
The project is following a phased rebuild plan to ensure quality and preserve features. The current status is tracked against this plan.

- **Phase 0: Preparation & Backup** (✅ Complete)
- **Phase 1: Foundation & Core Services** (✅ Complete)
- **Phase 2: Search Foundation** (✅ Complete) - *Integrated as part of the foundational build.*
- **Phase 3: Dietary Needs & User Preferences** (🎯 Up Next)
- **Phase 4: Recipe Discovery** (✅ In Progress - AI Generation is complete)
- **Phase 5: Advanced Safety & Dietary Features**
- **Phase 6: Nutrition & Macro Features**
- **Phase 7: UI/UX Polish & Advanced Features**
- **Phase 8: Integration & Launch Preparation**