-- =====================================================
-- FIXED RLS POLICIES FOR V4
-- Run this in Supabase SQL Editor to fix login issues
-- =====================================================

-- First disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE designations DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$
BEGIN
    -- User Profiles Policies
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Public can insert profiles" ON user_profiles;
    
    -- Activity Logs Policies
    DROP POLICY IF EXISTS "Users can view own activity logs" ON user_activity_logs;
    DROP POLICY IF EXISTS "Admins can view all activity logs" ON user_activity_logs;
    
    -- Department Policies
    DROP POLICY IF EXISTS "Admins can manage departments" ON departments;
    DROP POLICY IF EXISTS "Users can view departments" ON departments;
    
    -- Designation Policies
    DROP POLICY IF EXISTS "Admins can manage designations" ON designations;
    DROP POLICY IF EXISTS "Users can view designations" ON designations;
END;
$$;

-- Enable RLS again
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;

-- Create fixed RLS policies for user_profiles
CREATE POLICY "Public can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create fixed RLS policies for user_activity_logs
CREATE POLICY "Users can view own activity logs" ON user_activity_logs
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can insert activity logs" ON user_activity_logs
    FOR INSERT WITH CHECK (true);

-- Create fixed RLS policies for departments
CREATE POLICY "Anyone can view departments" ON departments
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage departments" ON departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create fixed RLS policies for designations
CREATE POLICY "Anyone can view designations" ON designations
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage designations" ON designations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Run this to verify policies
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
    AND tablename IN ('user_profiles', 'user_activity_logs', 'departments', 'designations');