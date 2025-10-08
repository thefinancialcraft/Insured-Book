-- =====================================================
-- FIX ADMIN TRACKING ISSUE
-- Run this in Supabase SQL Editor to fix admin name/ID display
-- =====================================================

-- Drop and recreate the trigger with proper admin tracking
DROP TRIGGER IF EXISTS log_profile_changes_trigger ON user_profiles;

CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS TRIGGER AS $$
DECLARE
    current_admin_id UUID;
    current_admin_name TEXT;
    current_admin_employee_id TEXT;
BEGIN
    -- Get current admin information from auth context
    current_admin_id := auth.uid();
    
    -- Get admin details if available
    IF current_admin_id IS NOT NULL THEN
        SELECT user_name, employee_id INTO current_admin_name, current_admin_employee_id
        FROM user_profiles 
        WHERE user_id = current_admin_id;
    END IF;
    
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        PERFORM log_user_activity(
            p_user_id := NEW.user_id,
            p_admin_user_id := current_admin_id,
            p_action_type := CASE 
                WHEN NEW.status = 'active' AND OLD.status = 'hold' THEN 'hold_removed'
                WHEN NEW.status = 'hold' THEN 'hold_applied'
                WHEN NEW.status = 'suspend' THEN 'suspended'
                WHEN NEW.status = 'active' AND OLD.status = 'suspend' THEN 'unsuspended'
                WHEN NEW.status = 'active' AND OLD.status = 'pending' THEN 'activated'
                ELSE 'profile_updated'
            END,
            p_previous_status := OLD.status,
            p_new_status := NEW.status,
            p_previous_role := OLD.role,
            p_new_role := NEW.role,
            p_reason := NEW.status_reason,
            p_hold_days := NEW.hold_days,
            p_hold_start_date := NEW.hold_start_date,
            p_hold_end_date := NEW.hold_end_date,
            p_admin_comment := CASE 
                WHEN current_admin_name IS NOT NULL AND current_admin_employee_id IS NOT NULL 
                THEN current_admin_name || ' (' || current_admin_employee_id || ')'
                WHEN current_admin_name IS NOT NULL 
                THEN current_admin_name
                ELSE 'System'
            END
        );
    END IF;
    
    -- Log role changes
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        PERFORM log_user_activity(
            p_user_id := NEW.user_id,
            p_admin_user_id := current_admin_id,
            p_action_type := 'role_changed',
            p_previous_status := OLD.status,
            p_new_status := NEW.status,
            p_previous_role := OLD.role,
            p_new_role := NEW.role,
            p_reason := NEW.status_reason,
            p_admin_comment := CASE 
                WHEN current_admin_name IS NOT NULL AND current_admin_employee_id IS NOT NULL 
                THEN current_admin_name || ' (' || current_admin_employee_id || ')'
                WHEN current_admin_name IS NOT NULL 
                THEN current_admin_name
                ELSE 'System'
            END
        );
    END IF;
    
    -- Log approval status changes
    IF OLD.approval_status IS DISTINCT FROM NEW.approval_status THEN
        PERFORM log_user_activity(
            p_user_id := NEW.user_id,
            p_admin_user_id := current_admin_id,
            p_action_type := CASE 
                WHEN NEW.approval_status = 'approved' THEN 'approval_accepted'
                WHEN NEW.approval_status = 'rejected' THEN 'approval_rejected'
                ELSE 'approval_requested'
            END,
            p_previous_status := OLD.status,
            p_new_status := NEW.status,
            p_previous_role := OLD.role,
            p_new_role := NEW.role,
            p_reason := NEW.status_reason,
            p_admin_comment := CASE 
                WHEN current_admin_name IS NOT NULL AND current_admin_employee_id IS NOT NULL 
                THEN current_admin_name || ' (' || current_admin_employee_id || ')'
                WHEN current_admin_name IS NOT NULL 
                THEN current_admin_name
                ELSE 'System'
            END
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_profile_changes_trigger
  AFTER UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION log_profile_changes();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Admin tracking fixed successfully!';
    RAISE NOTICE 'Now using auth.uid() to get current admin information';
    RAISE NOTICE 'Admin name and employee ID will now display correctly';
END $$; 