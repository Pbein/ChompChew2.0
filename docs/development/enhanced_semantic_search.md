# 🍽️ Functional Specification Document: Smart Semantic Search Input

## 📌 Feature Name

**Smart Semantic + Structured Search Input** for Recipe Discovery

## 🧭 Purpose

To enable users to intuitively search for recipes using natural language and/or structured keywords (e.g., "chicken", "no dairy", "paleo dinner under 30 mins"), while the system dynamically classifies input into structured categories such as ingredients, diets, and cooking constraints.

This component will power the core search experience of the application and feed structured queries to a recipe engine or AI system.

---

## 👤 Target Users

* Users with specific dietary needs (e.g., paleo, gluten-free)
* Users with limited ingredients looking to cook based on what they have
* Users seeking quick, healthy, or occasion-based meals

---

## 🧩 User Stories

1. **As a user**, I want to type a search like "chicken broth paleo dinner" and have each term categorized automatically.
2. **As a user**, I want to confirm the category of each term with a click (e.g., add "chicken" to ingredients).
3. **As a user**, I want visual tags/chips showing my active filters.
4. **As a user**, I want to be able to remove or edit individual tags.
5. **As a user**, I want the search bar to offer autocomplete and suggestions while typing.
6. **As a user**, I want the final search to return recipes matching all my selected filters.

---

## 🔍 Functional Requirements

### ✅ Input Behavior

* Accepts natural language phrases
* Parses tokens in real-time (on space, comma, enter)
* Auto-suggests terms from known vocabularies (ingredients, diets, cuisines, etc.)
* Displays a contextual dropdown with category suggestions for each term (e.g., “Add ‘chicken’ to Ingredients”)

### ✅ Token Confirmation & Chip Display

* Once a suggestion is selected, convert term into a labeled chip
* Chips are displayed below the input field with category labels
* Each chip can be removed (❌) or edited

### ✅ Final Output Format

Structure the selected inputs as JSON:

```json
{
  "ingredients": ["chicken", "broth"],
  "excludedIngredients": ["dairy"],
  "dietaryPreferences": ["paleo"],
  "mealType": ["dinner"],
  "prepConstraints": ["under 30 mins"]
}
```

---

## 🧱 Component Structure (React / Next.js)

### `SearchInput.tsx`

* Renders the input box
* Handles keypress parsing
* Debounces input
* Triggers category suggestions

### `SuggestionPopover.tsx`

* Displays category suggestions for current term
* Allows user to confirm classification

### `SearchChip.tsx`

* Displays confirmed terms (e.g., \[ingredient: chicken])
* Includes remove and edit functionality

### `SearchContext.ts` or Redux/State Store

* Stores structured query state

```ts
interface SearchQuery {
  ingredients: string[];
  excludedIngredients: string[];
  dietaryPreferences: string[];
  mealType: string[];
  cuisine: string[];
  cookingMethod: string[];
  nutritionGoals: string[];
  prepConstraints: string[];
  dishes: string[];
}
```

---

## 🧠 NLP Parsing Logic

* Use either a basic keyword map or GPT endpoint
* On each parsed term:

  * Match against dictionaries (ingredients, diets, etc.)
  * Use rules (e.g., `no [word]` → excludedIngredients)
  * If ambiguous, show category suggestions to the user

Example (user types):

> `paleo chicken no dairy dinner under 30`

AI/GPT or rules-based parser outputs:

```json
{
  "ingredients": ["chicken"],
  "excludedIngredients": ["dairy"],
  "dietaryPreferences": ["paleo"],
  "mealType": ["dinner"],
  "prepConstraints": ["under 30 minutes"]
}
```

---

## 🎨 UX Design Notes

* Input bar should feel like a search engine
* Chips should be color-coded by category
* Contextual dropdown (popover) should not be intrusive but clearly visible
* Keep "add filter manually" option for accessibility

---

## 🧪 Optional Enhancements

* Add voice-to-search input
* Add recent search memory or saved search profiles
* Let users reorder chips (for UX control)

---

## ✅ Acceptance Criteria

* User can type search terms and confirm categories visually
* Chips reflect each categorized filter
* Structured search state is available for recipe search
* Input is intuitive, minimal, and responsive

---

## 📦 Dependencies

* Tailwind CSS (for UI styling)
* React + TypeScript
* State management: Context API or Zustand/Redux
* Optional: GPT endpoint or simple NLP parsing function

---

## 📎 Deliverables

* Search input component with dynamic token parsing
* Chip display system with color-coded categories
* Contextual dropdown for category suggestions
* Structured state output as JSON

---

## 🛠 Suggested Dev Stack

* Framework: **Next.js**
* Styling: **Tailwind CSS**
* State: **Zustand or React Context**
* Optional AI/NLP: **OpenAI API** or in-app keyword matcher

