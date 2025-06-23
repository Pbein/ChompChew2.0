import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfilePage from '@/app/profile/page';
import { useProfileStore } from '@/store/profileStore';
import userEvent from '@testing-library/user-event';

// Mock the zustand store
vi.mock('@/store/profileStore');

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock the supabase client
const mockGetUser = vi.fn();
vi.mock('@/lib/supabase', () => ({
  createClientComponentClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

describe('Profile Management Integration Test', () => {
  const mockUpdateProfile = vi.fn();
  const mockFetchProfile = vi.fn();
  const mockClearError = vi.fn();
  const mockRetryUpdate = vi.fn();
  const user = userEvent.setup();

  const mockProfile = {
    id: 'test-user-id',
    dietary_preferences: ['vegan'],
    allergens: ['nuts'],
    macro_targets: { protein: 30, carbs: 50, fat: 20, calories: 2000 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up authenticated user by default
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } }
    });
    
    // Provide a mock implementation of the store's return value
    vi.mocked(useProfileStore).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      lastSaved: null,
      updateProfile: mockUpdateProfile,
      fetchProfile: mockFetchProfile,
      clearError: mockClearError,
      retryUpdate: mockRetryUpdate,
    });
    mockUpdateProfile.mockResolvedValue(undefined);
  });

  it('should display batch save functionality with unsaved changes indicator', async () => {
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Initially, no unsaved changes
    expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled();
    
    // Make a change by actually adding an allergen
    const allergenInput = screen.getByPlaceholderText('Add avoided ingredient');
    const allergenSection = screen.getByText('Avoided / Allergens').closest('section');
    const addButton = within(allergenSection!).getByRole('button', { name: 'Add' });
    
    await user.type(allergenInput, 'dairy');
    await user.click(addButton);
    
    // Should now show unsaved changes
    await waitFor(() => {
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeEnabled();
    });
  });

  it('should show success toast when profile is saved successfully', async () => {
    mockUpdateProfile.mockResolvedValue(undefined);
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Make a change
    const allergenInput = screen.getByPlaceholderText('Add avoided ingredient');
    const allergenSection = screen.getByText('Avoided / Allergens').closest('section');
    const addButton = within(allergenSection!).getByRole('button', { name: 'Add' });
    
    await user.type(allergenInput, 'dairy');
    await user.click(addButton);
    
    // Click save
    const saveButton = screen.getByRole('button', { name: 'Save Changes' });
    await user.click(saveButton);
    
    // Should show success toast
    await waitFor(() => {
      expect(screen.getByText('Profile saved successfully!')).toBeInTheDocument();
      expect(screen.getByText('✓')).toBeInTheDocument();
    });
    
    // Should clear unsaved changes
    expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();
  });

  it('should show error toast when profile save fails', async () => {
    mockUpdateProfile.mockRejectedValue(new Error('Network error'));
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Make a change
    const allergenInput = screen.getByPlaceholderText('Add avoided ingredient');
    const allergenSection = screen.getByText('Avoided / Allergens').closest('section');
    const addButton = within(allergenSection!).getByRole('button', { name: 'Add' });
    
    await user.type(allergenInput, 'dairy');
    await user.click(addButton);
    
    // Click save
    const saveButton = screen.getByRole('button', { name: 'Save Changes' });
    await user.click(saveButton);
    
    // Should show error toast
    await waitFor(() => {
      expect(screen.getByText('Failed to save profile. Please try again.')).toBeInTheDocument();
      expect(screen.getByText('✗')).toBeInTheDocument();
    });
  });

  it('should allow resetting changes to original values', async () => {
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Make a change
    const allergenInput = screen.getByPlaceholderText('Add avoided ingredient');
    const allergenSection = screen.getByText('Avoided / Allergens').closest('section');
    const addButton = within(allergenSection!).getByRole('button', { name: 'Add' });
    
    await user.type(allergenInput, 'dairy');
    await user.click(addButton);
    
    // Should show unsaved changes and reset button
    await waitFor(() => {
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    });
    
    // Click reset
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    
    // Should clear unsaved changes
    expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();
  });

  it('should handle keyboard shortcuts for adding tags', async () => {
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Test diet tags
    const dietInput = screen.getByPlaceholderText('Add diet tag (e.g., vegan)');
    await user.type(dietInput, 'keto');
    await user.keyboard('{Enter}');
    
    // Should show unsaved changes
    await waitFor(() => {
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
    });
    
    // Test allergens
    const allergenInput = screen.getByPlaceholderText('Add avoided ingredient');
    await user.type(allergenInput, 'shellfish');
    await user.keyboard('{Enter}');
    
    // Should still show unsaved changes
    expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
  });

  it('should disable add buttons when input is empty', async () => {
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Find sections and their add buttons
    const dietSection = screen.getByText('Diet Tags').closest('section');
    const allergenSection = screen.getByText('Avoided / Allergens').closest('section');
    
    const dietAddButton = within(dietSection!).getByRole('button', { name: 'Add' });
    const allergenAddButton = within(allergenSection!).getByRole('button', { name: 'Add' });
    
    // Should be disabled when inputs are empty
    expect(dietAddButton).toBeDisabled();
    expect(allergenAddButton).toBeDisabled();
    
    // Type in diet input
    const dietInput = screen.getByPlaceholderText('Add diet tag (e.g., vegan)');
    await user.type(dietInput, 'keto');
    
    // Diet button should be enabled, allergen button still disabled
    expect(dietAddButton).toBeEnabled();
    expect(allergenAddButton).toBeDisabled();
  });

  it('should show loading state during save operation', async () => {
    // Mock loading state
    vi.mocked(useProfileStore).mockReturnValue({
      profile: mockProfile,
      loading: true,
      error: null,
      lastSaved: null,
      updateProfile: mockUpdateProfile,
      fetchProfile: mockFetchProfile,
      clearError: mockClearError,
      retryUpdate: mockRetryUpdate,
    });

    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Should show loading spinner and text
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled();
    
    // Should show spinning animation
    const spinner = screen.getByRole('button', { name: 'Save Changes' }).closest('div')?.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should allow users to add and remove allergens', async () => {
    // Arrange
    render(<ProfilePage />);
    
    // Wait for component to load and render profile content
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Find the allergen manager section
    const allergenSection = screen.getByText('Avoided / Allergens').closest('section');
    expect(allergenSection).toBeInTheDocument();
    
    // Verify existing allergen is displayed
    expect(screen.getByText('nuts')).toBeInTheDocument();
    
    // Find the input field for adding allergens
    const allergenInput = screen.getByPlaceholderText('Add avoided ingredient');
    
    // Get the specific "Add" button for allergens (it's within the allergen section)
    const addButton = within(allergenSection!).getByRole('button', { name: 'Add' });

    // Act - Add a new allergen (this should trigger local state update)
    await user.type(allergenInput, 'dairy');
    await user.click(addButton);

    // Should show unsaved changes
    await waitFor(() => {
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
    });

    // Act - Remove an existing allergen (specifically the one in the allergens section)
    const nutsTag = screen.getByText('nuts').closest('span');
    const removeNutsButton = within(nutsTag!).getByText('×');
    await user.click(removeNutsButton);

    // Should still show unsaved changes
    expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
  });

  it('should allow users to update macro targets using sliders and inputs', async () => {
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Find the macro targets section
    const macroSection = screen.getByText('Macro Targets').closest('section');
    expect(macroSection).toBeInTheDocument();
    
    // Find the protein number input
    const proteinInputs = within(macroSection!).getAllByDisplayValue('30');
    const proteinNumberInput = proteinInputs.find(input => input.getAttribute('type') === 'number');
    expect(proteinNumberInput).toBeInTheDocument();

    // Change the protein value
    await user.click(proteinNumberInput!);
    await user.keyboard('{Control>}a{/Control}');
    await user.type(proteinNumberInput!, '40');
    
    // Should show unsaved changes
    await waitFor(() => {
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
    });
  });

  it('should use macro preset buttons', async () => {
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Find and click a preset button
    const balancedButton = screen.getByRole('button', { name: 'Balanced (2000 cal)' });
    await user.click(balancedButton);
    
    // Should show unsaved changes
    await waitFor(() => {
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
    });
  });

  it('should handle error display from the store', async () => {
    // Mock error state
    vi.mocked(useProfileStore).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: 'Failed to connect to database',
      lastSaved: null,
      updateProfile: mockUpdateProfile,
      fetchProfile: mockFetchProfile,
      clearError: mockClearError,
      retryUpdate: mockRetryUpdate,
    });

    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dietary Preferences')).toBeInTheDocument();
    });
    
    // Should display error message
    expect(screen.getByText('Error loading profile:')).toBeInTheDocument();
    expect(screen.getByText('Failed to connect to database')).toBeInTheDocument();
  });
}); 