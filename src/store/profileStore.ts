import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/profile';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ profile: data, loading: false });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const { profile } = get();
    if (!profile) return;

    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', profile.id)
      .single();

    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ profile: data, loading: false });
    }
  },
})); 