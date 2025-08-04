-- =====================================================
-- USER DELETE FUNCTIONALITY FOR INSURED BOOK APPLICATION
-- This file contains SQL commands to handle user deletion
-- Run this in Supabase SQL Editor after the main database setup
-- =====================================================

-- =====================================================
-- STEP 1: UPDATE USER_ACTIVITY_LOGS TABLE TO SUPPORT DELETION
-- =====================================================

-- Add 'user_deleted' to the action_type check constraint
-- First, check if the constraint already includes 'user_deleted'
DO $$
BEGIN
    -- Check if 'user_deleted' is already in the constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'user_activity_logs_action_type_check'
        AND check_clause LIKE '%user_deleted%'
    ) THEN
        -- Only modify if 'user_deleted' is not already included
        ALTER TABLE user_activity_logs DROP CONSTRAINT IF EXISTS user_activity_logs_action_type_check;

        ALTER TABLE user_activity_logs ADD CONSTRAINT user_activity_logs_action_type_check 
        CHECK (action_type IN (
            'approval_requested',
            'approval_accepted', 
            'approval_rejected',
            'activated',
            'hold_applied',
            'hold_removed',
            'suspended',
            'unsuspended',
            'role_changed',
            'profile_updated',
            'user_deleted'
        ));
        
        RAISE NOTICE 'Added user_deleted to action_type constraint';
    ELSE
        RAISE NOTICE 'user_deleted already exists in action_type constraint, skipping modification';
    END IF;
END $$;

-- =====================================================
-- STEP 2: CREATE USER DELETION FUNCTION
-- =====================================================

-- Function to handle complete user deletion with logging
CREATE OR REPLACE FUNCTION delete_user_complete(
    p_user_id UUID,
    p_admin_user_id UUID DEFAULT NULL,
    p_delete_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_profile_record RECORD;
    admin_name TEXT;
    admin_employee_id TEXT;
    deletion_success BOOLEAN := FALSE;
BEGIN
    -- Get user profile information before deletion
    SELECT * INTO user_profile_record 
    FROM user_profiles 
    WHERE user_id = p_user_id;
    
    -- If user doesn't exist, return false
    IF NOT FOUND THEN
        RAISE NOTICE 'User with ID % not found', p_user_id;
        RETURN FALSE;
    END IF;
    
    -- Get admin information if provided
    IF p_admin_user_id IS NOT NULL THEN
        SELECT user_name, employee_id INTO admin_name, admin_employee_id
        FROM user_profiles 
        WHERE user_id = p_admin_user_id;
    END IF;
    
    -- Log the deletion action BEFORE deleting the user
    PERFORM log_user_activity(
        p_user_id := p_user_id,
        p_admin_user_id := p_admin_user_id,
        p_action_type := 'user_deleted',
        p_previous_status := user_profile_record.status,
        p_new_status := 'deleted',
        p_previous_role := user_profile_record.role,
        p_new_role := NULL,
        p_reason := p_delete_reason,
        p_admin_comment := CASE 
            WHEN admin_name IS NOT NULL AND admin_employee_id IS NOT NULL 
            THEN admin_name || ' (' || admin_employee_id || ')'
            WHEN admin_name IS NOT NULL 
            THEN current_admin_name
            ELSE 'System'
        END
    );
    
    -- Delete user profile from user_profiles table
    DELETE FROM user_profiles WHERE user_id = p_user_id;
    
    -- Delete user from auth.users table
    DELETE FROM auth.users WHERE id = p_user_id;
    
    deletion_success := TRUE;
    
    RAISE NOTICE 'User % deleted successfully. Profile and auth entry removed from database.', p_user_id;
    RETURN deletion_success;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error deleting user %: %', p_user_id, SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 3: CREATE FUNCTION TO LOG DELETION EVENTS
-- =====================================================

-- Function to handle both database and auth deletion together
CREATE OR REPLACE FUNCTION delete_user_with_auth(
    p_user_id UUID,
    p_admin_user_id UUID DEFAULT NULL,
    p_delete_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_profile_record RECORD;
    admin_name TEXT;
    admin_employee_id TEXT;
    deletion_success BOOLEAN := FALSE;
    admin_count INTEGER;
BEGIN
    -- Get user profile information before deletion
    SELECT * INTO user_profile_record 
    FROM user_profiles 
    WHERE user_id = p_user_id;
    
    -- If user doesn't exist, return false
    IF NOT FOUND THEN
        RAISE NOTICE 'User with ID % not found', p_user_id;
        RETURN FALSE;
    END IF;
    
    -- Check if user is admin and count total admins
    IF user_profile_record.role = 'admin' THEN
        -- Count total admin users
        SELECT COUNT(*) INTO admin_count 
        FROM user_profiles 
        WHERE role = 'admin';
        
        -- Prevent deletion if this is the last admin
        IF admin_count <= 1 THEN
            RAISE NOTICE 'Cannot delete the last admin user: %', p_user_id;
            RETURN FALSE;
        END IF;
        
        -- Log a warning about admin deletion
        RAISE NOTICE 'WARNING: Deleting admin user % (Total admins before deletion: %)', p_user_id, admin_count;
    END IF;
    
    -- Get admin information if provided
    IF p_admin_user_id IS NOT NULL THEN
        SELECT user_name, employee_id INTO admin_name, admin_employee_id
        FROM user_profiles 
        WHERE user_id = p_admin_user_id;
    END IF;
    
    -- Log the deletion action BEFORE deleting the user
    PERFORM log_user_activity(
        p_user_id := p_user_id,
        p_admin_user_id := p_admin_user_id,
        p_action_type := 'user_deleted',
        p_previous_status := user_profile_record.status,
        p_new_status := 'deleted',
        p_previous_role := user_profile_record.role,
        p_new_role := NULL,
        p_reason := p_delete_reason,
        p_admin_comment := CASE 
            WHEN admin_name IS NOT NULL AND admin_employee_id IS NOT NULL 
            THEN admin_name || ' (' || admin_employee_id || ')'
            WHEN admin_name IS NOT NULL 
            THEN admin_name
            ELSE 'System'
        END
    );
    
    -- Delete user profile from user_profiles table
    DELETE FROM user_profiles WHERE user_id = p_user_id;
    
    -- Delete user from auth.users table
    DELETE FROM auth.users WHERE id = p_user_id;
    
    deletion_success := TRUE;
    
    RAISE NOTICE 'User % deleted successfully. Profile and auth entry removed from database.', p_user_id;
    RETURN deletion_success;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error deleting user %: %', p_user_id, SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to log user deletion events (called by the application)
CREATE OR REPLACE FUNCTION log_user_deletion(
    p_user_id UUID,
    p_admin_user_id UUID DEFAULT NULL,
    p_delete_reason TEXT DEFAULT NULL,
    p_user_email TEXT DEFAULT NULL,
    p_user_name TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    admin_name TEXT;
    admin_employee_id TEXT;
BEGIN
    -- Get admin information if provided
    IF p_admin_user_id IS NOT NULL THEN
        SELECT user_name, employee_id INTO admin_name, admin_employee_id
        FROM user_profiles 
        WHERE user_id = p_admin_user_id;
    END IF;
    
    -- Log the deletion event
    INSERT INTO user_activity_logs (
        id,
        user_id,
        admin_user_id,
        action_type,
        previous_status,
        new_status,
        previous_role,
        new_role,
        reason,
        admin_comment,
        created_at
    ) VALUES (
        gen_random_uuid(),
        p_user_id,
        p_admin_user_id,
        'user_deleted',
        'active', -- Assuming user was active before deletion
        'deleted',
        NULL, -- We don't know the previous role after deletion
        NULL,
        p_delete_reason,
        CASE 
            WHEN admin_name IS NOT NULL AND admin_employee_id IS NOT NULL 
            THEN admin_name || ' (' || admin_employee_id || ')'
            WHEN admin_name IS NOT NULL 
            THEN admin_name
            ELSE 'System'
        END,
        NOW()
    );
    
    RAISE NOTICE 'User deletion logged for user: % (Email: %)', p_user_name, p_user_email;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 4: CREATE CLEANUP FUNCTION FOR ORPHANED RECORDS
-- =====================================================

-- Function to clean up orphaned activity logs (when auth.users records are deleted)
CREATE OR REPLACE FUNCTION cleanup_orphaned_activity_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete activity logs for users that no longer exist in auth.users
    DELETE FROM user_activity_logs 
    WHERE user_id NOT IN (
        SELECT id FROM auth.users
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE 'Cleaned up % orphaned activity log records', deleted_count;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 5: CREATE VIEW FOR DELETION AUDIT TRAIL
-- =====================================================

-- Create a view to track user deletions
CREATE OR REPLACE VIEW user_deletion_audit AS
SELECT 
    ual.id,
    ual.user_id,
    ual.admin_user_id,
    ual.action_type,
    ual.reason as deletion_reason,
    ual.admin_comment,
    ual.created_at as deletion_date,
    -- Admin information
    admin_profile.user_name as admin_name,
    admin_profile.employee_id as admin_employee_id,
    admin_profile.email as admin_email
FROM user_activity_logs ual
LEFT JOIN user_profiles admin_profile ON ual.admin_user_id = admin_profile.user_id
WHERE ual.action_type = 'user_deleted'
ORDER BY ual.created_at DESC;

-- =====================================================
-- STEP 6: CREATE RLS POLICY FOR DELETION AUDIT
-- =====================================================

-- Grant access to deletion audit view for admins
DROP POLICY IF EXISTS "Admins can view deletion audit" ON user_activity_logs;

CREATE POLICY "Admins can view deletion audit" ON user_activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- STEP 7: CREATE FUNCTION TO GET DELETION STATISTICS
-- =====================================================

-- Function to get deletion statistics
CREATE OR REPLACE FUNCTION get_deletion_statistics(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    total_deletions BIGINT,
    deletions_today BIGINT,
    deletions_this_week BIGINT,
    deletions_this_month BIGINT,
    most_common_reason TEXT,
    admin_with_most_deletions TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_deletions,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as deletions_today,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as deletions_this_week,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as deletions_this_month,
        (SELECT reason FROM user_activity_logs 
         WHERE action_type = 'user_deleted' 
         AND (p_start_date IS NULL OR created_at >= p_start_date)
         AND (p_end_date IS NULL OR created_at <= p_end_date)
         GROUP BY reason 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as most_common_reason,
        (SELECT admin_profile.user_name 
         FROM user_activity_logs ual
         LEFT JOIN user_profiles admin_profile ON ual.admin_user_id = admin_profile.user_id
         WHERE ual.action_type = 'user_deleted'
         AND (p_start_date IS NULL OR ual.created_at >= p_start_date)
         AND (p_end_date IS NULL OR ual.created_at <= p_end_date)
         GROUP BY admin_profile.user_name
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as admin_with_most_deletions
    FROM user_activity_logs 
    WHERE action_type = 'user_deleted'
    AND (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 8: CREATE SAFETY CHECKS
-- =====================================================

-- Function to check if user can be deleted (safety check)
CREATE OR REPLACE FUNCTION can_delete_user(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_exists BOOLEAN;
    is_admin BOOLEAN;
    admin_count INTEGER;
BEGIN
    -- Check if user exists
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE user_id = p_user_id) INTO user_exists;
    
    IF NOT user_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user is an admin
    SELECT role = 'admin' INTO is_admin FROM user_profiles WHERE user_id = p_user_id;
    
    IF is_admin THEN
        -- Count total admin users
        SELECT COUNT(*) INTO admin_count 
        FROM user_profiles 
        WHERE role = 'admin';
        
        -- Prevent deletion if this is the last admin
        IF admin_count <= 1 THEN
            RAISE NOTICE 'Cannot delete the last admin user: %', p_user_id;
            RETURN FALSE;
        END IF;
        
        -- Allow deletion of admin users if there are multiple admins
        RAISE NOTICE 'WARNING: User is an admin, but deletion allowed (Total admins: %)', admin_count;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 9: VERIFICATION QUERIES
-- =====================================================

-- Check if deletion action type was added
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'user_activity_logs_action_type_check';

-- Check if functions were created
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name IN (
    'delete_user_complete',
    'delete_user_with_auth',
    'log_user_deletion',
    'cleanup_orphaned_activity_logs',
    'get_deletion_statistics',
    'can_delete_user'
);

-- Check if view was created
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'user_deletion_audit';

-- =====================================================
-- STEP 10: SAMPLE USAGE EXAMPLES
-- =====================================================

-- Example 1: Check if a user can be deleted
-- SELECT can_delete_user('user-uuid-here');

-- Example 2: Get deletion statistics for the last 30 days
-- SELECT * FROM get_deletion_statistics(CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE);

-- Example 3: View recent deletions
-- SELECT * FROM user_deletion_audit LIMIT 10;

-- Example 4: Clean up orphaned records
-- SELECT cleanup_orphaned_activity_logs();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'USER DELETE FUNCTIONALITY SETUP COMPLETED!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Added action_type: user_deleted';
    RAISE NOTICE 'Created functions:';
    RAISE NOTICE '  - delete_user_complete()';
    RAISE NOTICE '  - delete_user_with_auth() - Handles both DB and Auth deletion';
    RAISE NOTICE '  - log_user_deletion()';
    RAISE NOTICE '  - cleanup_orphaned_activity_logs()';
    RAISE NOTICE '  - get_deletion_statistics()';
    RAISE NOTICE '  - can_delete_user()';
    RAISE NOTICE 'Created view: user_deletion_audit';
    RAISE NOTICE 'Added safety checks for admin protection';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'NEXT STEPS:';
    RAISE NOTICE '1. Test the deletion functionality in your application';
    RAISE NOTICE '2. Monitor the user_deletion_audit view';
    RAISE NOTICE '3. Run cleanup_orphaned_activity_logs() periodically';
    RAISE NOTICE '4. Use get_deletion_statistics() for reporting';
    RAISE NOTICE '=====================================================';
END $$; 