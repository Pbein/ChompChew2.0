-- Migration: Add user roles and admin functionality
-- Date: 2024-12-19
-- Description: Adds role column to users table and sets up admin account

-- Add role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'free' 
CHECK (role IN ('free', 'premium', 'admin'));

-- Add subscription columns for future use
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive'
CHECK (subscription_status IN ('active', 'inactive', 'trial', 'cancelled'));

ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier TEXT
CHECK (subscription_tier IN ('basic', 'premium'));

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- Update RLS policies to include admin access

-- Admin users can access all recipes
CREATE POLICY "Admins can access all recipes" ON recipes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Admin users can access all user data (for management)
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Premium/Admin users can generate recipes (for future AI generations table)
-- This will be used when we create the AI generations table
-- CREATE POLICY "Premium users can generate recipes" ON ai_generations
--   FOR INSERT WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM users 
--       WHERE users.id = auth.uid() 
--       AND (users.role IN ('premium', 'admin') OR users.subscription_status = 'active')
--     )
--   );

-- Function to check if user can access paid features
CREATE OR REPLACE FUNCTION can_access_paid_features(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  sub_status TEXT;
BEGIN
  SELECT role, subscription_status INTO user_role, sub_status
  FROM users WHERE id = user_id;
  
  RETURN user_role = 'admin' OR 
         user_role = 'premium' OR 
         sub_status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION can_access_paid_features(UUID) TO authenticated;

-- Comment explaining the admin setup process
-- After running this migration, you'll need to:
-- 1. Sign up with your admin email through the app
-- 2. Run the admin setup script to promote your account to admin
-- 3. Test admin access to paid features 