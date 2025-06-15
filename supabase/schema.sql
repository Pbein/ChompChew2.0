-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE cooking_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE recipe_difficulty AS ENUM ('easy', 'medium', 'hard');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  dietary_preferences TEXT[],
  allergens TEXT[],
  macro_targets JSONB,
  fiber_sensitivity BOOLEAN DEFAULT false,
  cooking_level cooking_level,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Recipes table
CREATE TABLE recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructions JSONB NOT NULL,
  ingredients JSONB NOT NULL,
  prep_time INTEGER,
  cook_time INTEGER,
  total_time INTEGER,
  servings INTEGER,
  difficulty recipe_difficulty,
  cuisine_type TEXT,
  dietary_tags TEXT[],
  calories_per_serving INTEGER,
  nutrition_info JSONB,
  image_url TEXT,
  is_ai_generated BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  rating_average DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0
);

-- User favorites table
CREATE TABLE user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, recipe_id)
);

-- Recipe reviews table
CREATE TABLE recipe_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, recipe_id)
);

-- User follows table
CREATE TABLE user_follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Shopping lists table
CREATE TABLE shopping_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pantry items table
CREATE TABLE pantry_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity DECIMAL,
  unit TEXT,
  expiration_date DATE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_recipes_created_by ON recipes(created_by);
CREATE INDEX idx_recipes_is_public ON recipes(is_public);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_cuisine_type ON recipes(cuisine_type);
CREATE INDEX idx_recipes_rating_average ON recipes(rating_average);
CREATE INDEX idx_recipes_created_at ON recipes(created_at);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_recipe_id ON user_favorites(recipe_id);
CREATE INDEX idx_recipe_reviews_recipe_id ON recipe_reviews(recipe_id);
CREATE INDEX idx_recipe_reviews_user_id ON recipe_reviews(user_id);
CREATE INDEX idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON user_follows(following_id);
CREATE INDEX idx_shopping_lists_user_id ON shopping_lists(user_id);
CREATE INDEX idx_pantry_items_user_id ON pantry_items(user_id);
CREATE INDEX idx_pantry_items_expiration_date ON pantry_items(expiration_date);

-- Full-text search indexes
CREATE INDEX idx_recipes_title_search ON recipes USING gin(to_tsvector('english', title));
CREATE INDEX idx_recipes_description_search ON recipes USING gin(to_tsvector('english', description));

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipe_reviews_updated_at BEFORE UPDATE ON recipe_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON shopping_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pantry_items_updated_at BEFORE UPDATE ON pantry_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger to create user profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update recipe rating average
CREATE OR REPLACE FUNCTION update_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE recipes SET 
    rating_average = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM recipe_reviews 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM recipe_reviews 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    )
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language plpgsql;

-- Triggers to update recipe ratings
CREATE TRIGGER update_recipe_rating_on_insert
  AFTER INSERT ON recipe_reviews
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();

CREATE TRIGGER update_recipe_rating_on_update
  AFTER UPDATE ON recipe_reviews
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();

CREATE TRIGGER update_recipe_rating_on_delete
  AFTER DELETE ON recipe_reviews
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles are viewable by everyone" ON users FOR SELECT USING (true);

-- Recipes policies  
CREATE POLICY "Public recipes are viewable by everyone" ON recipes FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own recipes" ON recipes FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Users can create recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own recipes" ON recipes FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own recipes" ON recipes FOR DELETE USING (auth.uid() = created_by);

-- User favorites policies
CREATE POLICY "Users can view their own favorites" ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their favorites" ON user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from their favorites" ON user_favorites FOR DELETE USING (auth.uid() = user_id);

-- Recipe reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON recipe_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON recipe_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON recipe_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON recipe_reviews FOR DELETE USING (auth.uid() = user_id);

-- User follows policies
CREATE POLICY "Users can view all follows" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow others" ON user_follows FOR DELETE USING (auth.uid() = follower_id);

-- Shopping lists policies
CREATE POLICY "Users can view their own shopping lists" ON shopping_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create shopping lists" ON shopping_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shopping lists" ON shopping_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shopping lists" ON shopping_lists FOR DELETE USING (auth.uid() = user_id);

-- Pantry items policies
CREATE POLICY "Users can view their own pantry items" ON pantry_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create pantry items" ON pantry_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pantry items" ON pantry_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pantry items" ON pantry_items FOR DELETE USING (auth.uid() = user_id); 