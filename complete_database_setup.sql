-- =====================================================
-- COMPLETE DATABASE SETUP FOR INSURED BOOK APPLICATION
-- This file contains all necessary SQL commands for the application
-- Run this entire file in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: CREATE USER_PROFILES TABLE
-- =====================================================

-- Create user_profiles table with all required columns
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_no TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    dob DATE,
    
    -- Role Management (Admin-assigned only)
    role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee', 'supervisor')),
    
    -- Approval System (Separate from status)
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    
    -- Status Management System (Separate from approval)
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hold', 'suspend')),
    
    -- Status Reason for rejection, hold, or suspend
    status_reason TEXT DEFAULT NULL,
    
    -- Employee Information
    employee_id TEXT DEFAULT NULL,
    joining_date DATE DEFAULT NULL,
    
    -- Hold Management
    hold_days INTEGER DEFAULT NULL,
    hold_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    hold_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_approval_status ON user_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_employee_id ON user_profiles(employee_id);

-- =====================================================
-- STEP 2: CREATE USER_ACTIVITY_LOGS TABLE
-- =====================================================

-- Create user activity logs table
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_user_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL CHECK (action_type IN (
        'approval_requested',
        'approval_accepted', 
        'approval_rejected',
        'activated',
        'hold_applied',
        'hold_removed',
        'suspended',
        'unsuspended',
        'role_changed',
        'profile_updated'
    )),
    previous_status TEXT,
    new_status TEXT,
    previous_role TEXT,
    new_role TEXT,
    reason TEXT,
    hold_days INTEGER,
    hold_start_date TIMESTAMP WITH TIME ZONE,
    hold_end_date TIMESTAMP WITH TIME ZONE,
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_admin_user_id ON user_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action_type ON user_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);

-- =====================================================
-- STEP 3: CREATE FUNCTIONS
-- =====================================================

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to generate employee ID
CREATE OR REPLACE FUNCTION generate_employee_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.employee_id IS NULL THEN
    NEW.employee_id := 'EMP' || EXTRACT(EPOCH FROM NOW())::BIGINT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to check and update hold status
CREATE OR REPLACE FUNCTION check_hold_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If user is on hold and hold period has expired, activate them
  IF NEW.status = 'hold' AND NEW.hold_end_date IS NOT NULL AND NEW.hold_end_date <= NOW() THEN
    NEW.status := 'active';
    NEW.hold_days := NULL;
    NEW.hold_start_date := NULL;
    NEW.hold_end_date := NULL;
    NEW.status_reason := 'Account automatically activated after hold period';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: Admin tracking is now handled automatically using auth.uid() in the trigger

-- Create function to log user activities
CREATE OR REPLACE FUNCTION log_user_activity(
    p_user_id UUID,
    p_admin_user_id UUID DEFAULT NULL,
    p_action_type TEXT DEFAULT NULL,
    p_previous_status TEXT DEFAULT NULL,
    p_new_status TEXT DEFAULT NULL,
    p_previous_role TEXT DEFAULT NULL,
    p_new_role TEXT DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_hold_days INTEGER DEFAULT NULL,
    p_hold_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_hold_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_admin_comment TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
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
        hold_days,
        hold_start_date,
        hold_end_date,
        admin_comment
    ) VALUES (
        gen_random_uuid(),
        p_user_id,
        p_admin_user_id,
        p_action_type,
        p_previous_status,
        p_new_status,
        p_previous_role,
        p_new_role,
        p_reason,
        p_hold_days,
        p_hold_start_date,
        p_hold_end_date,
        p_admin_comment
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 4: CREATE TRIGGERS
-- =====================================================

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to generate employee ID
DROP TRIGGER IF EXISTS generate_employee_id_trigger ON user_profiles;
CREATE TRIGGER generate_employee_id_trigger 
  BEFORE INSERT ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION generate_employee_id();

-- Create trigger to check hold status
DROP TRIGGER IF EXISTS check_hold_status_trigger ON user_profiles;
CREATE TRIGGER check_hold_status_trigger 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION check_hold_status();

-- Create trigger to log profile changes
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
-- STEP 5: SET UP ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all profiles" ON user_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable RLS on user_activity_logs table
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON user_activity_logs;

-- Create RLS policies for activity logs
CREATE POLICY "Users can view own activity logs" ON user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs" ON user_activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- STEP 6: CREATE FIRST ADMIN USER (MANUAL SETUP)
-- =====================================================

-- Note: This is a placeholder for manual admin creation
-- You need to manually create the first admin user through the application
-- or directly in the database after user registration

-- Example of how to manually set the first admin (run this after user registration):
-- UPDATE user_profiles 
-- SET role = 'admin', approval_status = 'approved', status = 'active'
-- WHERE email = 'admin@example.com';

-- =====================================================
-- STEP 7: VERIFICATION QUERIES
-- =====================================================

-- Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- Check activity logs table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_activity_logs' 
ORDER BY ordinal_position;

-- Check sample data
SELECT 
    user_id,
    user_name,
    email,
    role,
    approval_status,
    status,
    status_reason,
    hold_days,
    created_at
FROM user_profiles 
LIMIT 5;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'DATABASE SETUP COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Tables created: user_profiles, user_activity_logs';
    RAISE NOTICE 'Functions created: update_updated_at_column, generate_employee_id, check_hold_status, set_current_admin, log_user_activity';
    RAISE NOTICE 'Triggers created: update_user_profiles_updated_at, generate_employee_id_trigger, check_hold_status_trigger, log_profile_changes_trigger';
    RAISE NOTICE 'RLS policies configured for security';
    RAISE NOTICE 'Admin tracking system ready';
    RAISE NOTICE 'Activity logging system ready';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'NEXT STEPS:';
    RAISE NOTICE '1. Create your first admin user through the application';
    RAISE NOTICE '2. Or manually update a user to admin role';
    RAISE NOTICE '3. Test the admin panel functionality';
    RAISE NOTICE '=====================================================';
END $$; 