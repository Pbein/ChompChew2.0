"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { useProfileStore } from '@/store/profileStore';
import DietaryProfileSelector from '@/components/profile/DietaryProfileSelector';
import AllergenManager from '@/components/profile/AllergenManager';
import MacroSliders from '@/components/profile/MacroSliders';

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { profile, fetchProfile, updateProfile, loading } = useProfileStore();

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

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold mb-4">Sign in to manage your dietary profile</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Dietary Preferences</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Diet Tags</h2>
        <DietaryProfileSelector value={profile?.dietary_preferences || []} onChange={(tags) => updateProfile({ dietary_preferences: tags })} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Avoided / Allergens</h2>
        <AllergenManager value={profile?.allergens || []} onChange={(list) => updateProfile({ allergens: list })} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Macro Targets</h2>
        <MacroSliders value={profile?.macro_targets || {}} onChange={(mt) => updateProfile({ macro_targets: mt })} />
      </section>

      {loading && <p className="text-sm text-gray-500">Saving...</p>}
    </div>
  );
} 