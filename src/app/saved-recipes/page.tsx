"use client";

import { useEffect, useState } from 'react';
import { useSavedRecipesStore } from '@/store/savedRecipesStore';
import { RecipeGrid } from '@/components/recipe/RecipeGrid';
import { createClientComponentClient } from '@/lib/supabase';

export default function SavedRecipesPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const userId = user?.id;
  const { saved, loadSaved, loading } = useSavedRecipesStore();

  // Get user session
  useEffect(() => {
    const supabase = createClientComponentClient()
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    loadSaved(userId);
  }, [userId, loadSaved]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-600">Loading your cookbook...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-2">
        💾 My Saved Recipes
      </h1>

      {saved.length === 0 ? (
        <p className="text-gray-600">You haven&apos;t saved any recipes yet. Start exploring and save your favorites!</p>
      ) : (
        <RecipeGrid
          recipes={saved}
          onSaveRecipe={() => {}}
          onViewRecipe={(r) => {
            window.location.href = `/recipe/${r.id}`;
          }}
          loading={false}
          emptyMessage="No saved recipes"
        />
      )}
    </div>
  );
} 