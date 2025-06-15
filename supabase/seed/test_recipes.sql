-- Seed file: Inserts a small set of recipes for local development & tests.
-- Run with: psql -d "$SUPABASE_DB" -f supabase/seed/test_recipes.sql

INSERT INTO public.recipes (
  title,
  description,
  instructions,
  ingredients,
  prep_time,
  cook_time,
  total_time,
  servings,
  difficulty,
  cuisine_type,
  dietary_tags,
  calories_per_serving,
  nutrition_info,
  image_url,
  created_by
) VALUES
  (
    'Chicken & Rice Soup',
    'A comforting, low-fiber soup suitable for UC flare-ups.',
    '[{"step": 1, "text": "Sauté carrots, celery, and chicken."}, {"step": 2, "text": "Add broth and rice; simmer 20 min."}, {"step": 3, "text": "Season and serve."}]',
    '[{"name": "chicken breast", "amount": "200 g"}, {"name": "white rice", "amount": "1/2 cup"}, {"name": "carrots", "amount": "1/2 cup"}, {"name": "celery", "amount": "1/4 cup"}, {"name": "chicken broth", "amount": "4 cups"}]',
    10, 20, 30, 2, 'easy', 'American', ARRAY['low-fiber','uc-safe'],
    320,
    '{"protein": 25, "fat": 6, "carbs": 40, "fiber": 1}',
    'https://source.unsplash.com/featured/?soup',
    (SELECT id FROM public.users LIMIT 1)
  ),
  (
    'Vegan Chocolate Chip Cookies',
    'Crispy-edge, soft-center cookies without dairy or eggs.',
    '[{"step": 1, "text": "Mix dry ingredients."}, {"step": 2, "text": "Fold in wet ingredients and chocolate chips."}, {"step": 3, "text": "Bake 12 min @ 350°F."}]',
    '[{"name": "all-purpose flour", "amount": "2 cups"}, {"name": "coconut oil", "amount": "1/2 cup"}, {"name": "coconut sugar", "amount": "3/4 cup"}, {"name": "almond milk", "amount": "1/3 cup"}, {"name": "vegan chocolate chips", "amount": "1 cup"}]',
    15, 12, 27, 24, 'medium', 'American', ARRAY['vegan','dairy-free'],
    160,
    '{"protein": 2, "fat": 7, "carbs": 23, "fiber": 1}',
    'https://source.unsplash.com/featured/?cookies',
    (SELECT id FROM public.users LIMIT 1)
  ); 