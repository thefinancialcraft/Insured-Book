-- =====================================================
-- CREATE FIRST ADMIN USER
-- Run this in Supabase SQL Editor after v3.sql
-- =====================================================

-- Update the user to admin role
UPDATE user_profiles 
SET 
    role = 'admin',
    approval_status = 'approved',
    status = 'active',
    status_reason = 'Initial admin user setup'
WHERE user_id = 'abc6f8b6-ee49-420e-a63b-57c91cfa3d00';

-- Verify the update
SELECT 
    user_id,
    user_name,
    email,
    role,
    approval_status,
    status,
    created_at
FROM user_profiles 
WHERE user_id = 'abc6f8b6-ee49-420e-a63b-57c91cfa3d00';