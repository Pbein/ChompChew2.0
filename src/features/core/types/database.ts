export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          dietary_preferences: string[] | null
          allergens: string[] | null
          cooking_level: 'beginner' | 'intermediate' | 'advanced' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          dietary_preferences?: string[] | null
          allergens?: string[] | null
          cooking_level?: 'beginner' | 'intermediate' | 'advanced' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          dietary_preferences?: string[] | null
          allergens?: string[] | null
          cooking_level?: 'beginner' | 'intermediate' | 'advanced' | null
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          title: string
          description: string | null
          instructions: Json
          ingredients: Json
          prep_time: number | null
          cook_time: number | null
          total_time: number | null
          servings: number | null
          difficulty: 'easy' | 'medium' | 'hard' | null
          cuisine_type: string | null
          dietary_tags: string[] | null
          calories_per_serving: number | null
          nutrition_info: Json | null
          image_url: string | null
          is_ai_generated: boolean
          is_public: boolean
          created_by: string
          created_at: string
          updated_at: string
          rating_average: number | null
          rating_count: number
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          instructions: Json
          ingredients: Json
          prep_time?: number | null
          cook_time?: number | null
          total_time?: number | null
          servings?: number | null
          difficulty?: 'easy' | 'medium' | 'hard' | null
          cuisine_type?: string | null
          dietary_tags?: string[] | null
          calories_per_serving?: number | null
          nutrition_info?: Json | null
          image_url?: string | null
          is_ai_generated?: boolean
          is_public?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
          rating_average?: number | null
          rating_count?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          instructions?: Json
          ingredients?: Json
          prep_time?: number | null
          cook_time?: number | null
          total_time?: number | null
          servings?: number | null
          difficulty?: 'easy' | 'medium' | 'hard' | null
          cuisine_type?: string | null
          dietary_tags?: string[] | null
          calories_per_serving?: number | null
          nutrition_info?: Json | null
          image_url?: string | null
          is_ai_generated?: boolean
          is_public?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
          rating_average?: number | null
          rating_count?: number
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          created_at?: string
        }
      }
      recipe_reviews: {
        Row: {
          id: string
          recipe_id: string
          user_id: string
          rating: number
          comment: string | null
          images: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          user_id: string
          rating: number
          comment?: string | null
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      user_follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      shopping_lists: {
        Row: {
          id: string
          user_id: string
          name: string
          items: Json
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          items: Json
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          items?: Json
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pantry_items: {
        Row: {
          id: string
          user_id: string
          name: string
          quantity: number | null
          unit: string | null
          expiration_date: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          quantity?: number | null
          unit?: string | null
          expiration_date?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          quantity?: number | null
          unit?: string | null
          expiration_date?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
  }
}

// Additional types for the application
export interface Recipe {
  id: string
  title: string
  description?: string
  instructions: RecipeInstruction[]
  ingredients: RecipeIngredient[]
  prep_time?: number
  cook_time?: number
  total_time?: number
  servings?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  cuisine_type?: string
  dietary_tags?: string[]
  calories_per_serving?: number
  nutrition_info?: NutritionInfo
  image_url?: string
  is_ai_generated: boolean
  is_public: boolean
  created_by: string
  created_at: string
  updated_at: string
  rating_average?: number
  rating_count: number
}

export interface RecipeInstruction {
  step: number
  instruction: string
  time_estimate?: number
  image_url?: string
}

export interface RecipeIngredient {
  name: string
  amount: number
  unit: string
  optional?: boolean
  notes?: string
}

export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  bio?: string
  dietary_preferences?: string[]
  allergens?: string[]
  cooking_level?: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
  updated_at: string
} 