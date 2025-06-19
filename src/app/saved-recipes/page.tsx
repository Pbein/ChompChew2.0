"use client";

import { useEffect, useState } from 'react';
import { useSavedRecipesStore } from '@/store/savedRecipesStore';
import { RecipeGrid } from '@/components/recipe/RecipeGrid';
import { getSupabaseClient } from '@/lib/supabase';

export default function SavedRecipesPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const userId = user?.id;
  const { saved, loading, toggleSave, handleUserAuthentication } = useSavedRecipesStore();

  // Get user session using singleton client
  useEffect(() => {
    const supabase = getSupabaseClient()
    let mounted = true
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (mounted) {
          setUser(user)
          setUserLoaded(true)
          
          // Ensure saved recipes are loaded for this page
          if (user) {
            await handleUserAuthentication(user.id);
          }
        }
      } catch (error) {
        console.error('SavedRecipesPage - Error getting user:', error)
        if (mounted) {
          setUser(null)
          setUserLoaded(true)
        }
      }
    }
    
    getUser()
    
    return () => {
      mounted = false
    }
  }, [handleUserAuthentication])

  if (loading || !userLoaded) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-600">Loading your cookbook...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        💾 My Saved Recipes
      </h1>

      {saved.length === 0 ? (
        <p className="text-gray-600">You haven&apos;t saved any recipes yet. Start exploring and save your favorites!</p>
      ) : (
        <RecipeGrid
          recipes={saved}
          onSaveRecipe={(recipe) => toggleSave(recipe, userId)}
          onViewRecipe={(recipe) => {
            window.location.href = `/recipe/${recipe.id}`;
          }}
          loading={false}
          emptyMessage="No saved recipes"
        />
      )}
    </div>
  );
} 