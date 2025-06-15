-- Migration: Fix RLS infinite recursion
-- Date: 2025-01-20
-- Description: Fixes infinite recursion in RLS policies by using SECURITY DEFINER functions

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can access all recipes" ON recipes;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Create SECURITY DEFINER functions that bypass RLS
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM users WHERE id = user_id;
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_premium_or_admin(user_id UUID)
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_premium_or_admin(UUID) TO authenticated;

-- Create new policies using the SECURITY DEFINER functions
CREATE POLICY "Admins can access all recipes" ON recipes
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (is_admin(auth.uid()));

-- Update the existing can_access_paid_features function to also use SECURITY DEFINER pattern
DROP FUNCTION IF EXISTS can_access_paid_features(UUID);
CREATE OR REPLACE FUNCTION can_access_paid_features(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN is_premium_or_admin(user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION can_access_paid_features(UUID) TO authenticated; 