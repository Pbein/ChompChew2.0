import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies at the module level with inline factories to prevent hoisting issues.
vi.mock('@/lib/supabase-server', () => ({
  supabaseServiceRole: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  },
}));

vi.mock('@/lib/openai', () => ({
  openai: {
    responses: {
      create: vi.fn(),
    },
  },
}));

vi.mock('uuid', () => ({ v4: () => 'mock-uuid-1234' }));

import { generateRecipeImage } from '@/lib/aiImageService';
import { openai } from '@/lib/openai';
import { supabaseServiceRole } from '@/lib/supabase-server';

// --- Test Suite ---

describe('generateRecipeImage', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    vi.clearAllMocks();
  });

  it('should successfully generate an image, upload it, and return the public URL', async () => {
    // Arrange
    const mockCreate = vi.mocked(openai.responses.create);
    const mockUpload = vi.fn();
    const mockGetPublicUrl = vi.fn();
    
    vi.mocked(supabaseServiceRole.storage.from).mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    } as any);

    mockCreate.mockResolvedValue({
      output: [{ type: 'image_generation_call', status: 'completed', result: 'mock-base64-data' }],
    } as any);
    mockUpload.mockResolvedValue({ error: null, data: { path: 'mock-uuid-1234.png' } });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://test.com/image.png' } });

    // Act
    const result = await generateRecipeImage({ title: 'Test Recipe' });

    // Assert
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockUpload).toHaveBeenCalledWith('mock-uuid-1234.png', expect.any(Buffer), expect.any(Object));
    expect(mockGetPublicUrl).toHaveBeenCalledWith('mock-uuid-1234.png');
    expect(result).toBe('https://test.com/image.png');
  });

  it('should fallback to Unsplash when image generation fails', async () => {
    // Arrange
    const mockCreate = vi.mocked(openai.responses.create);
    mockCreate.mockResolvedValue({
      output: [{ type: 'image_generation_call', status: 'failed', result: null }],
    } as any);

    // Act
    const result = await generateRecipeImage({ title: 'Failed Recipe' });

    // Assert - Should fallback to Unsplash instead of throwing
    expect(result).toContain('unsplash.com');
    expect(result).toContain('failed'); // The fallback URL contains the error indicator
  });

  it('should fallback to Unsplash when Supabase upload fails', async () => {
    // Arrange
    const mockCreate = vi.mocked(openai.responses.create);
    const mockUpload = vi.fn();
    const mockGetPublicUrl = vi.fn();
    
    vi.mocked(supabaseServiceRole.storage.from).mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    } as unknown);

    mockCreate.mockResolvedValue({
      output: [{ type: 'image_generation_call', status: 'completed', result: 'mock-base64-data' }],
    } as unknown);
    mockUpload.mockResolvedValue({ error: new Error('Upload failed'), data: null });

    // Act
    const result = await generateRecipeImage({ title: 'Upload Fail Recipe' });

    // Assert - Should fallback to Unsplash instead of throwing
    expect(result).toContain('unsplash.com');
    expect(result).toContain('upload'); // The fallback URL contains the error indicator
  });

  it('should fallback to Unsplash when getting public URL fails', async () => {
    // Arrange
    const mockCreate = vi.mocked(openai.responses.create);
    const mockUpload = vi.fn();
    const mockGetPublicUrl = vi.fn();
    
    vi.mocked(supabaseServiceRole.storage.from).mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    } as any);

    mockCreate.mockResolvedValue({
      output: [{ type: 'image_generation_call', status: 'completed', result: 'mock-base64-data' }],
    } as any);
    mockUpload.mockResolvedValue({ error: null, data: { path: 'mock-uuid-1234.png' } });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: null } }); // Simulate failure

    // Act
    const result = await generateRecipeImage({ title: 'Public URL Fail' });

    // Assert - Should fallback to Unsplash instead of throwing
    expect(result).toContain('unsplash.com');
    expect(result).toContain('public'); // The fallback URL contains the error indicator
  });
}); 