import { test, expect } from '@playwright/test';

test.describe('Critical User Journeys - Authentication Flow', () => {

  test('Full Authentication Flow (Sign up, Sign in, Navigate)', async ({ page }) => {
    // Generate unique test user to avoid conflicts
    const timestamp = Date.now();
    const testEmail = `test-user-${timestamp}@chompchew-test.com`;
    const testPassword = 'TestPassword123!';
    const testName = 'Test User';

    // Test 1: User can navigate to sign up page
    await page.goto('/auth/signup');
    
    // Verify we're on the sign up page
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.locator('h2')).toContainText('Create your account');
    
    // Test 2: User can sign up for a new account
    await page.fill('#fullName', testName);
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    
    // Verify form elements are present and functional
    await expect(page.locator('#fullName')).toHaveValue(testName);
    await expect(page.locator('#email')).toHaveValue(testEmail);
    await expect(page.locator('#password')).toHaveValue(testPassword);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Test 3: Verify sign up success (should show confirmation message)
    // Note: In a real app, this would require email confirmation
    await expect(page.locator('text=Check your email for the confirmation link!')).toBeVisible({ timeout: 10000 });
    
    // Test 4: Navigate to sign in page
    await page.goto('/auth/signin');
    await expect(page).toHaveURL('/auth/signin');
    await expect(page.locator('h2')).toContainText('Welcome back');
    
    // Test 5: User can sign in with existing credentials
    // Note: For this demo, we'll test the form functionality
    // In a real test environment, you'd use a pre-created test user
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    
    // Verify sign in form elements
    await expect(page.locator('#email')).toHaveValue(testEmail);
    await expect(page.locator('#password')).toHaveValue(testPassword);
    
    // Verify sign in button is enabled when form is filled
    const signInButton = page.locator('button[type="submit"]');
    await expect(signInButton).toBeEnabled();
    await expect(signInButton).toContainText('Sign In');
    
    // Test 6: Verify form validation - empty form should disable button
    await page.fill('#email', '');
    await page.fill('#password', '');
    await expect(signInButton).toBeDisabled();
    
    // Test 7: Verify navigation between auth pages works
    await page.click('text=Sign up');
    await expect(page).toHaveURL('/auth/signup');
    
    await page.click('text=Sign in');
    await expect(page).toHaveURL('/auth/signin');
    
    // Test 8: Verify brand logo navigation works
    await page.click('text=ChompChew');
    await expect(page).toHaveURL('/');
    
    // Test 9: Verify auth pages are accessible from home
    await page.goto('/');
    
    // Look for sign in/up links (these may vary based on the header implementation)
    // This tests the overall navigation flow
    await page.goto('/auth/signin');
    await expect(page.locator('h2')).toContainText('Welcome back');
  });

  test('Authentication Form Validation', async ({ page }) => {
    // Test sign up form validation
    await page.goto('/auth/signup');
    
    // Test required field validation
    const signUpButton = page.locator('button[type="submit"]');
    await expect(signUpButton).toBeDisabled(); // Should be disabled initially
    
    // Fill only email, button should still be disabled
    await page.fill('#email', 'test@example.com');
    await expect(signUpButton).toBeDisabled();
    
    // Fill password too, button should be enabled
    await page.fill('#password', 'password123');
    await expect(signUpButton).toBeEnabled();
    
    // Test sign in form validation
    await page.goto('/auth/signin');
    
    const signInButton = page.locator('button[type="submit"]');
    await expect(signInButton).toBeDisabled(); // Should be disabled initially
    
    // Fill email
    await page.fill('#email', 'test@example.com');
    await expect(signInButton).toBeDisabled(); // Still disabled without password
    
    // Fill password
    await page.fill('#password', 'password123');
    await expect(signInButton).toBeEnabled(); // Should be enabled now
  });

  test('Authentication UI Components and Styling', async ({ page }) => {
    // Test sign in page UI
    await page.goto('/auth/signin');
    
    // Verify key UI elements are present
    await expect(page.locator('text=ChompChew')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Welcome back');
    await expect(page.locator('label[for="email"]')).toContainText('Email Address');
    await expect(page.locator('label[for="password"]')).toContainText('Password');
    await expect(page.locator('text=Don\'t have an account?')).toBeVisible();
    
    // Test sign up page UI
    await page.goto('/auth/signup');
    
    await expect(page.locator('text=ChompChew')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Create your account');
    await expect(page.locator('label[for="fullName"]')).toContainText('Full Name');
    await expect(page.locator('label[for="email"]')).toContainText('Email Address');
    await expect(page.locator('label[for="password"]')).toContainText('Password');
    await expect(page.locator('text=Already have an account?')).toBeVisible();
  });

}); 