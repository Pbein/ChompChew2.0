export interface MacroTargets {
  protein?: number;
  fat?: number;
  carbs?: number;
  calories?: number;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;

  dietary_preferences?: string[]; // e.g., ['vegan', 'keto']
  allergens?: string[]; // avoided ingredients
  macro_targets?: MacroTargets;
  fiber_sensitivity?: boolean;

  created_at?: string;
  updated_at?: string;
} 