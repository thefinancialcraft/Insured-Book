-- =====================================================
-- FIX PROFILE INSERTION AND VALIDATION
-- Run this in Supabase SQL Editor to fix profile completion
-- =====================================================

-- First, let's drop and recreate the user_profiles table with relaxed constraints
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_no TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    dob DATE,
    
    -- Role Management with default
    role TEXT DEFAULT 'employee',
    
    -- Approval System with default
    approval_status TEXT DEFAULT 'pending',
    
    -- Status Management with default
    status TEXT DEFAULT 'active',
    status_reason TEXT DEFAULT NULL,
    
    -- Employee Information
    employee_id TEXT DEFAULT NULL,
    joining_date DATE DEFAULT NULL,
    department TEXT DEFAULT NULL,
    designation TEXT DEFAULT NULL,
    
    -- Hold Management
    hold_days INTEGER DEFAULT NULL,
    hold_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    hold_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Basic constraints
    UNIQUE(user_id),
    UNIQUE(email),
    UNIQUE(employee_id)
);

-- Create necessary indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_approval_status ON user_profiles(approval_status);

-- Set up RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Public can insert profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
END;
$$;

-- Create basic policies
CREATE POLICY "Enable read access for all users" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Public can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Create basic trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- Verify policies
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
    AND tablename = 'user_profiles';

-- =====================================================
-- TEST INSERT QUERY
-- =====================================================
-- Try this insert query to test:
/*
INSERT INTO user_profiles (
    user_id,
    user_name,
    email,
    contact_no,
    address,
    city,
    state,
    pincode,
    dob
) VALUES (
    '7895db02-6720-40fb-ab1b-9a71da6af571',
    'Deepak',
    'deepakkumar.official32@gmail.com',
    '8882558932',
    'Deepak house',
    'New Delhi',
    'Delhi',
    '110094',
    '2025-10-08'
) RETURNING *;
*/