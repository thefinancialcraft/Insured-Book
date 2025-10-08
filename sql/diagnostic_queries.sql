-- =====================================================
-- DIAGNOSTIC QUERIES FOR USER DELETION ISSUE
-- Run these in Supabase SQL Editor to understand the problem
-- =====================================================

-- Query 1: Check all users and their roles
SELECT 
    user_id,
    user_name,
    email,
    role,
    status,
    approval_status,
    created_at
FROM user_profiles 
ORDER BY created_at DESC;

-- Query 2: Count admin users
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
    COUNT(*) FILTER (WHERE role = 'manager') as manager_count,
    COUNT(*) FILTER (WHERE role = 'employee') as employee_count,
    COUNT(*) FILTER (WHERE role = 'supervisor') as supervisor_count
FROM user_profiles;

-- Query 3: List only admin users
SELECT 
    user_id,
    user_name,
    email,
    role,
    status,
    created_at
FROM user_profiles 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Query 4: Test the can_delete_user function for each user
SELECT 
    user_id,
    user_name,
    email,
    role,
    can_delete_user(user_id) as can_be_deleted
FROM user_profiles 
ORDER BY role, created_at DESC;

-- Query 5: Check if the delete_user_with_auth function exists
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name = 'delete_user_with_auth';

-- Query 6: Test the delete_user_with_auth function (replace 'your-user-id' with actual user ID)
-- SELECT delete_user_with_auth('your-user-id', 'your-admin-id', 'Test deletion');

-- Query 7: Check user_activity_logs for recent deletion attempts
SELECT 
    id,
    user_id,
    admin_user_id,
    action_type,
    reason,
    admin_comment,
    created_at
FROM user_activity_logs 
WHERE action_type = 'user_deleted'
ORDER BY created_at DESC
LIMIT 10;

-- Query 8: Check if 'user_deleted' is in the action_type constraint
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'user_activity_logs_action_type_check'; 