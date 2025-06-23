"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { useProfileStore } from '@/store/profileStore';
import DietaryProfileSelector from '@/components/profile/DietaryProfileSelector';
import AllergenManager from '@/components/profile/AllergenManager';
import MacroSliders from '@/components/profile/MacroSliders';
import { UserProfile } from '@/types/profile';

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [localProfile, setLocalProfile] = useState<Partial<UserProfile>>({});
  
  const { profile, fetchProfile, updateProfile, loading, error } = useProfileStore();

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
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  // Initialize local profile when store profile loads
  useEffect(() => {
    if (profile) {
      setLocalProfile({
        dietary_preferences: profile.dietary_preferences || [],
        allergens: profile.allergens || [],
        macro_targets: profile.macro_targets || {}
      });
    }
  }, [profile]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleLocalUpdate = (field: keyof UserProfile, value: unknown) => {
    setLocalProfile(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile(localProfile);
      setHasUnsavedChanges(false);
      setShowToast({ type: 'success', message: 'Profile saved successfully!' });
    } catch {
      setShowToast({ type: 'error', message: 'Failed to save profile. Please try again.' });
    }
  };

  const handleReset = () => {
    if (profile) {
      setLocalProfile({
        dietary_preferences: profile.dietary_preferences || [],
        allergens: profile.allergens || [],
        macro_targets: profile.macro_targets || {}
      });
      setHasUnsavedChanges(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold mb-4 text-foreground">Sign in to manage your dietary profile</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300 ${
          showToast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <span>{showToast.type === 'success' ? '✓' : '✗'}</span>
            <span>{showToast.message}</span>
            <button 
              onClick={() => setShowToast(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Dietary Preferences</h1>
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <button 
              onClick={handleReset}
              className="px-3 py-1 text-sm border border-border text-muted-foreground hover:bg-muted rounded"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <p className="font-medium">Error loading profile:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-2 text-foreground">Diet Tags</h2>
        <DietaryProfileSelector 
          value={localProfile.dietary_preferences || []} 
          onChange={(tags) => handleLocalUpdate('dietary_preferences', tags)} 
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-foreground">Avoided / Allergens</h2>
        <AllergenManager 
          value={localProfile.allergens || []} 
          onChange={(list) => handleLocalUpdate('allergens', list)} 
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-foreground">Macro Targets</h2>
        <MacroSliders 
          value={localProfile.macro_targets || {}} 
          onChange={(mt) => handleLocalUpdate('macro_targets', mt)} 
        />
      </section>

      {/* Save Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Saving...</span>
            </div>
          )}
          {hasUnsavedChanges && !loading && (
            <span className="text-sm text-amber-600 dark:text-amber-400">You have unsaved changes</span>
          )}
        </div>
        <button 
          onClick={handleSave}
          disabled={!hasUnsavedChanges || loading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
} 