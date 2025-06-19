import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { UserService } from '@/features/core/services/userService';
import { UserProfile } from '@/types/profile';
import { Database } from '@/features/core/types/database';

// This is the single, unified mock for the Supabase query builder.
// All chainable methods return `this` to allow for fluent API mocking.
const mockQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  single: vi.fn(), // Not chained, so it gets a plain mock
};

// This is the single, unified mock for the Supabase client.
const mockSupabaseClient = {
  from: vi.fn(() => mockQueryBuilder),
};

// We mock the entire module to ensure no real Supabase code is ever called.
vi.mock('@/lib/supabase-server', () => ({
  createServerComponentClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    // Reset all mock call history before each test
    vi.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should fetch and return a user profile successfully', async () => {
      const mockProfile: UserProfile = { id: '123', full_name: 'Test User' };
      mockQueryBuilder.single.mockResolvedValueOnce({ data: mockProfile, error: null });

      const profile = await userService.getUserProfile('123');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('*');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', '123');
      expect(profile).toEqual(mockProfile);
    });

    it('should return null if the user profile is not found', async () => {
      mockQueryBuilder.single.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });
      const profile = await userService.getUserProfile('not-found');
      expect(profile).toBeNull();
    });
  });

  describe('updateUserProfile', () => {
    it('should update a user profile and return true', async () => {
      // The chain is update().eq(), so we mock the resolution of eq()
      mockQueryBuilder.eq.mockResolvedValueOnce({ error: null });
      const result = await userService.updateUserProfile('123', { full_name: 'New Name' });

      expect(mockQueryBuilder.update).toHaveBeenCalledWith(expect.objectContaining({ full_name: 'New Name' }));
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', '123');
      expect(result).toBe(true);
    });

    it('should return false if the update fails', async () => {
      mockQueryBuilder.eq.mockResolvedValueOnce({ error: { message: 'Update failed' } });
      const result = await userService.updateUserProfile('123', { full_name: 'New Name' });
      expect(result).toBe(false);
    });
  });

  describe('createUserProfile', () => {
    it('should create a user profile and return true', async () => {
        mockQueryBuilder.insert.mockResolvedValueOnce({ error: null });
        const newUser: Database['public']['Tables']['users']['Insert'] = { id: '456', email: 'new.user@example.com', full_name: 'New User' };
        
        const result = await userService.createUserProfile(newUser);

        expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
        expect(mockQueryBuilder.insert).toHaveBeenCalledWith(newUser);
        expect(result).toBe(true);
    });

    it('should return false if creating a user profile fails', async () => {
        mockQueryBuilder.insert.mockResolvedValueOnce({ error: { message: 'Insert failed' } });
        const newUser: Database['public']['Tables']['users']['Insert'] = { id: '456', email: 'new.user@example.com', full_name: 'New User' };

        const result = await userService.createUserProfile(newUser);

        expect(result).toBe(false);
    });
  });

  describe('deleteUserProfile', () => {
    it('should delete a user profile and return true', async () => {
        mockQueryBuilder.eq.mockResolvedValueOnce({ error: null });
        const result = await userService.deleteUserProfile('123');

        expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
        expect(mockQueryBuilder.delete).toHaveBeenCalled();
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', '123');
        expect(result).toBe(true);
    });

    it('should return false if deleting a user profile fails', async () => {
        mockQueryBuilder.eq.mockResolvedValueOnce({ error: { message: 'Delete failed' } });
        const result = await userService.deleteUserProfile('123');
        expect(result).toBe(false);
    });
  });

  describe('getUserFavorites', () => {
    it('should fetch and return a user\'s favorite recipes', async () => {
        const mockFavorites = [{ recipe_id: 'r1' }];
        // The chain is select().eq().order(), so we mock the resolution of order()
        mockQueryBuilder.order.mockResolvedValueOnce({ data: mockFavorites, error: null });

        const favorites = await userService.getUserFavorites('123');

        expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_favorites');
        expect(favorites).toEqual(mockFavorites);
    });
  });

  describe('addToFavorites', () => {
    it('should add a recipe to favorites and return true', async () => {
      // The chain is just insert(), so we mock its resolution directly
      mockQueryBuilder.insert.mockResolvedValueOnce({ error: null });
      const result = await userService.addToFavorites('123', 'r1');

      expect(mockQueryBuilder.insert).toHaveBeenCalledWith({ user_id: '123', recipe_id: 'r1' });
      expect(result).toBe(true);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove a recipe from favorites and return true', async () => {
      // For this complex chain, we create a specific, temporary mock structure.
      const finalEqSpy = vi.fn().mockResolvedValue({ error: null });
      const firstEqSpy = vi.fn().mockReturnValue({ eq: finalEqSpy });
      const deleteSpy = vi.fn().mockReturnValue({ eq: firstEqSpy });

      // We temporarily override the main 'from' mock to return this specific structure for this test only.
      (mockSupabaseClient.from as Mock).mockReturnValueOnce({
        delete: deleteSpy,
      });

      const result = await userService.removeFromFavorites('123', 'r1');

      // Now we can make precise assertions against each step of the chain.
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_favorites');
      expect(deleteSpy).toHaveBeenCalled();
      expect(firstEqSpy).toHaveBeenCalledWith('user_id', '123');
      expect(finalEqSpy).toHaveBeenCalledWith('recipe_id', 'r1');
      expect(result).toBe(true);
    });
  });
}); 