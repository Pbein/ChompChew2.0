# 🎨 Design System

This document outlines the core principles of the ChompChew design system. The goal is to maintain a consistent, accessible, and professional user interface across the entire application.

## Core Philosophy

-   **Consistency is Key**: Reusing colors, spacing, and components creates a predictable and intuitive user experience.
-   **Clarity over Clutter**: Every element should have a purpose. We prioritize clear visual hierarchy and avoid unnecessary decoration.
-   **Accessibility First**: Our design must be usable by everyone. This includes sufficient color contrast, keyboard navigability, and screen reader support.

## Spacing System

We use a **base-4 spacing system**. All margins, paddings, and layout gaps should be multiples of 4 pixels. This creates a harmonious vertical and horizontal rhythm throughout the app.

-   **Source of Truth**: The `tailwind.config.ts` file.
-   **Usage**: Use Tailwind's spacing utilities like `p-4` (16px), `m-8` (32px), `gap-2` (8px), etc.
-   **Example**: The space between a label and its input field might be `4px` (`gap-1`), while the space between larger sections on a page might be `32px` (`gap-8`).

## Color System

We use a semantic color palette, which allows for easy theming (especially for dark mode) and ensures that colors are used for their intended purpose.

-   **Source of Truth**: `src/globals.css` and `tailwind.config.ts`.
-   **Do not use hardcoded colors** like `bg-white` or `text-gray-900`. Always use the semantic variable names.

| Class Name        | Light Mode (Hex) | Dark Mode (Hex) | Purpose                                                |
| ----------------- | ---------------- | --------------- | ------------------------------------------------------ |
| `bg-background`   | `#FFFFFF`        | `#09090B`       | The primary background color of pages and components.  |
| `bg-foreground`   | `#09090B`        | `#FAFAFA`       | The primary color for text and icons.                  |
| `bg-card`         | `#FFFFFF`        | `#18181B`       | The background color for card-like components.         |
| `text-card-foreground` | `#09090B`        | `#FAFAFA`       | The text color for elements inside cards.              |
| `bg-primary`      | `#16A34A`        | `#22C55E`       | The background for primary interactive elements (buttons). |
| `text-primary-foreground` | `#FAFAFA`        | `#18181B`       | The text color for elements on a primary background.   |
| `bg-secondary`    | `#F1F5F9`        | `#27272A`       | The background for secondary elements (e.g., tags).    |
| `text-secondary-foreground`| `#0F172A`        | `#E4E4E7`       | The text color for elements on a secondary background. |
| `border`          | `#E2E8F0`        | `#27272A`       | The color for borders and dividers.                    |
| `input`           | `#E2E8F0`        | `#27272A`       | The border color for input fields.                     |

## Typography

We have a defined typographic scale to maintain visual hierarchy.

-   **Font**: The primary font is configured in `src/app/layout.tsx`.
-   **Scale**: Use semantic HTML tags (`<h1>`, `<h2>`, `<h3>`, `<p>`) and Tailwind's text size utilities (`text-lg`, `text-xl`, etc.) to apply the correct styles.

| Element / Class   | Size        | Weight     | Usage                                        |
| ----------------- | ----------- | ---------- | -------------------------------------------- |
| `h1` / `text-4xl` | 2.25rem     | bold       | Main page titles.                            |
| `h2` / `text-3xl` | 1.875rem    | semibold   | Large section headings.                      |
| `h3` / `text-2xl` | 1.5rem      | semibold   | Sub-section headings.                        |
| `h4` / `text-xl`  | 1.25rem     | semibold   | Card titles or important labels.             |
| `p` / `text-base` | 1rem        | normal     | Default body text for paragraphs.            |
| `small` / `text-sm` | 0.875rem    | normal     | Helper text, captions, or secondary info.    |

## Component Strategy

-   **Complex Components**: For complex, stateful, and accessible components like dialogs, dropdowns, and sliders, we use **[shadcn/ui](https://ui.shadcn.com/)**. These are not part of a library but are scripts that add the component code directly to our codebase under `src/components/ui`, allowing for full control and customization.
-   **Custom Components**: For most other components (`RecipeCard`, `Header`, etc.), we build them from scratch using **Tailwind CSS** and standard React patterns. This keeps our application lean and avoids unnecessary dependencies. 