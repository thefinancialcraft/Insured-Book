-- =====================================================
-- SIMPLIFIED RLS POLICIES V2
-- Run this in Supabase SQL Editor to fix login issues
-- =====================================================

-- First disable RLS
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE designations DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$
BEGIN
    -- Drop all policies from user_profiles
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Public can insert profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
    
    -- Drop all policies from user_activity_logs
    DROP POLICY IF EXISTS "Users can view own activity logs" ON user_activity_logs;
    DROP POLICY IF EXISTS "Admins can view all activity logs" ON user_activity_logs;
    DROP POLICY IF EXISTS "Users can insert activity logs" ON user_activity_logs;
    DROP POLICY IF EXISTS "Enable read access for all users" ON user_activity_logs;
END;
$$;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create simplified policies for user_profiles
-- Allow public read access to user_profiles (needed for login)
CREATE POLICY "Enable read access for all users" ON user_profiles
    FOR SELECT USING (true);

-- Allow anyone to insert their own profile
CREATE POLICY "Public can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Create simplified policies for user_activity_logs
-- Allow public read access to activity logs
CREATE POLICY "Enable read access for all users" ON user_activity_logs
    FOR SELECT USING (true);

-- Allow anyone to insert activity logs
CREATE POLICY "Users can insert activity logs" ON user_activity_logs
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- VERIFY POLICIES
-- =====================================================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE
    schemaname = 'public'
    AND tablename IN ('user_profiles', 'user_activity_logs');

-- =====================================================
-- TEST QUERIES
-- =====================================================
-- These queries should now work without authentication:
-- SELECT * FROM user_profiles LIMIT 1;
-- SELECT * FROM user_activity_logs LIMIT 1;