import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/profile';
import { updateUserProfileAction } from '@/app/profile/actions';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  lastSaved: Date | null;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateProfileWithServerAction: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
  retryUpdate: (data: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  lastSaved: null,

  clearError: () => set({ error: null }),

  fetchProfile: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      set({ 
        profile: data, 
        loading: false, 
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load profile';
      set({ 
        error: errorMessage, 
        loading: false 
      });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const { profile } = get();
    if (!profile) {
      set({ error: 'No profile loaded' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      set({ 
        profile: data, 
        loading: false, 
        error: null,
        lastSaved: new Date()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save profile';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw error; // Re-throw so the UI can handle it
    }
  },

  updateProfileWithServerAction: async (updates: Partial<UserProfile>) => {
    set({ loading: true, error: null });

    try {
      const result = await updateUserProfileAction(updates);
      
      if (result.success) {
        set({ 
          profile: result.data, 
          loading: false, 
          error: null,
          lastSaved: new Date()
        });
      } else {
        throw new Error('Server action failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save profile';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw error; // Re-throw so the UI can handle it
    }
  },

  retryUpdate: async (data: Partial<UserProfile>) => {
    const { updateProfile } = get();
    set({ error: null });
    return updateProfile(data);
  },
})); 