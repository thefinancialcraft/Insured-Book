-- =====================================================
-- INSURED BOOK DATABASE SETUP V3
-- Complete setup script after database reset
-- Run this file in Supabase SQL Editor
-- =====================================================

-- First run the reset.sql to clean the database completely
-- Then run this file to set up everything from scratch

-- =====================================================
-- STEP 1: CREATE TABLES
-- =====================================================

-- Create user_profiles table
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
    
    -- Role Management
    role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee', 'supervisor')),
    
    -- Approval System
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    
    -- Status Management
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hold', 'suspend')),
    
    -- Status Reason
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

-- Create user_activity_logs table
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
        'profile_updated',
        'user_deleted'
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
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_approval_status ON user_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_employee_id ON user_profiles(employee_id);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_admin_user_id ON user_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action_type ON user_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);

-- =====================================================
-- STEP 2: CREATE CORE FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate employee ID
CREATE OR REPLACE FUNCTION generate_employee_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.employee_id IS NULL THEN
        NEW.employee_id := 'EMP' || EXTRACT(EPOCH FROM NOW())::BIGINT;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check hold status
CREATE OR REPLACE FUNCTION check_hold_status()
RETURNS TRIGGER AS $$
BEGIN
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

-- Function to log user activities
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
-- STEP 3: CREATE USER DELETION FUNCTIONS
-- =====================================================

-- Function to check if user can be deleted
CREATE OR REPLACE FUNCTION can_delete_user(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_exists BOOLEAN;
    is_admin BOOLEAN;
    admin_count INTEGER;
BEGIN
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE user_id = p_user_id) INTO user_exists;
    
    IF NOT user_exists THEN
        RETURN FALSE;
    END IF;
    
    SELECT role = 'admin' INTO is_admin FROM user_profiles WHERE user_id = p_user_id;
    
    IF is_admin THEN
        SELECT COUNT(*) INTO admin_count 
        FROM user_profiles 
        WHERE role = 'admin';
        
        IF admin_count <= 1 THEN
            RETURN FALSE;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to delete user with auth
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
BEGIN
    SELECT * INTO user_profile_record 
    FROM user_profiles 
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    IF NOT can_delete_user(p_user_id) THEN
        RETURN FALSE;
    END IF;
    
    IF p_admin_user_id IS NOT NULL THEN
        SELECT user_name, employee_id INTO admin_name, admin_employee_id
        FROM user_profiles 
        WHERE user_id = p_admin_user_id;
    END IF;
    
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
    
    DELETE FROM user_profiles WHERE user_id = p_user_id;
    DELETE FROM auth.users WHERE id = p_user_id;
    
    deletion_success := TRUE;
    RETURN deletion_success;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 4: CREATE PROFILE CHANGES LOGGING
-- =====================================================

-- Function to log profile changes
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS TRIGGER AS $$
DECLARE
    current_admin_id UUID;
    current_admin_name TEXT;
    current_admin_employee_id TEXT;
BEGIN
    current_admin_id := auth.uid();
    
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

-- =====================================================
-- STEP 5: CREATE TRIGGERS
-- =====================================================

-- Trigger for updated_at timestamp
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
BEFORE UPDATE ON user_profiles 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for employee ID generation
DROP TRIGGER IF EXISTS generate_employee_id_trigger ON user_profiles;
CREATE TRIGGER generate_employee_id_trigger 
BEFORE INSERT ON user_profiles 
FOR EACH ROW 
EXECUTE FUNCTION generate_employee_id();

-- Trigger for hold status check
DROP TRIGGER IF EXISTS check_hold_status_trigger ON user_profiles;
CREATE TRIGGER check_hold_status_trigger 
BEFORE UPDATE ON user_profiles 
FOR EACH ROW 
EXECUTE FUNCTION check_hold_status();

-- Trigger for profile changes logging
DROP TRIGGER IF EXISTS log_profile_changes_trigger ON user_profiles;
CREATE TRIGGER log_profile_changes_trigger
AFTER UPDATE ON user_profiles 
FOR EACH ROW 
EXECUTE FUNCTION log_profile_changes();

-- =====================================================
-- STEP 6: SET UP ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON user_activity_logs;

-- Create RLS policies for user_profiles
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

-- Create RLS policies for user_activity_logs
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
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'DATABASE SETUP V3 COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '- user_profiles';
    RAISE NOTICE '- user_activity_logs';
    RAISE NOTICE '';
    RAISE NOTICE 'Functions created:';
    RAISE NOTICE '- Core utility functions';
    RAISE NOTICE '- User deletion functions';
    RAISE NOTICE '- Profile change logging';
    RAISE NOTICE '';
    RAISE NOTICE 'Triggers and RLS policies set up';
    RAISE NOTICE '';
    RAISE NOTICE 'NEXT STEPS:';
    RAISE NOTICE '1. Create first admin user';
    RAISE NOTICE '2. Test user management functionality';
    RAISE NOTICE '3. Verify RLS policies';
    RAISE NOTICE '=====================================================';
END $$;