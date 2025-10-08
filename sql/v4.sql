-- =====================================================
-- INSURED BOOK DATABASE SETUP V4
-- Enhanced setup script with improved functionality
-- Run this file in Supabase SQL Editor after reset
-- =====================================================

-- =====================================================
-- STEP 1: CREATE EXTENSION (if not exists)
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 2: CREATE TABLES WITH ENHANCED CONSTRAINTS
-- =====================================================

-- Create user_profiles table with enhanced validation
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL CHECK (length(user_name) >= 2),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    contact_no TEXT CHECK (contact_no ~* '^\+?[0-9]{10,15}$'),
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT CHECK (pincode ~* '^[0-9]{6}$'),
    dob DATE CHECK (dob <= CURRENT_DATE - INTERVAL '18 years'),
    
    -- Enhanced Role Management with Hierarchy
    role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee', 'supervisor')),
    role_assigned_by UUID REFERENCES auth.users(id),
    role_assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Enhanced Approval System
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Enhanced Status Management
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hold', 'suspend')),
    status_reason TEXT DEFAULT NULL,
    status_changed_by UUID REFERENCES auth.users(id),
    status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Enhanced Employee Information
    employee_id TEXT DEFAULT NULL UNIQUE,
    joining_date DATE DEFAULT NULL,
    department TEXT,
    designation TEXT,
    
    -- Enhanced Hold Management
    hold_days INTEGER DEFAULT NULL CHECK (hold_days > 0),
    hold_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    hold_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    hold_reason TEXT,
    hold_applied_by UUID REFERENCES auth.users(id),
    
    -- Enhanced Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Add constraints
    CONSTRAINT valid_hold_dates CHECK (
        (hold_start_date IS NULL AND hold_end_date IS NULL) OR
        (hold_start_date IS NOT NULL AND hold_end_date IS NOT NULL AND hold_end_date > hold_start_date)
    ),
    CONSTRAINT valid_joining_date CHECK (joining_date >= '2020-01-01')
);

-- Create enhanced user_activity_logs table
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_user_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL CHECK (action_type IN (
        'signup_initiated',
        'profile_completed',
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
        'password_changed',
        'login_success',
        'login_failed',
        'user_deleted',
        'department_changed',
        'designation_changed'
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
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Add metadata JSON for future extensibility
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Create department table for better organization
CREATE TABLE IF NOT EXISTS departments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create designation table for better organization
CREATE TABLE IF NOT EXISTS designations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    department_id UUID REFERENCES departments(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: CREATE ENHANCED INDEXES
-- =====================================================

-- User Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_approval_status ON user_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_employee_id ON user_profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_department ON user_profiles(department);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hold_end_date ON user_profiles(hold_end_date);

-- Activity Logs Indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_admin_user_id ON user_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action_type ON user_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);

-- =====================================================
-- STEP 4: CREATE ENHANCED FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Enhanced function to generate employee ID with department prefix
CREATE OR REPLACE FUNCTION generate_employee_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.employee_id IS NULL THEN
        -- Format: EMP-YYYYMM-SEQUENCE
        NEW.employee_id := 'EMP-' || 
                          TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' ||
                          LPAD(CAST((
                              SELECT COALESCE(MAX(CAST(SPLIT_PART(employee_id, '-', 3) AS INTEGER)), 0) + 1
                              FROM user_profiles
                              WHERE employee_id LIKE 'EMP-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-%'
                          ) AS TEXT), 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enhanced function to check and update hold status
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
        NEW.status_changed_at := NOW();
        NEW.status_changed_by := auth.uid();
        
        -- Log the automatic activation
        PERFORM log_user_activity(
            NEW.user_id,
            auth.uid(),
            'hold_removed',
            'hold',
            'active',
            NULL,
            NULL,
            'Automatic activation after hold period',
            NULL,
            NULL,
            NULL,
            'System Automatic Action'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enhanced function to validate role changes
CREATE OR REPLACE FUNCTION validate_role_change()
RETURNS TRIGGER AS $$
DECLARE
    admin_role TEXT;
BEGIN
    -- Get the role of the user making the change
    SELECT role INTO admin_role
    FROM user_profiles
    WHERE user_id = auth.uid();
    
    -- Only admins can change roles
    IF admin_role != 'admin' THEN
        RAISE EXCEPTION 'Only administrators can change user roles';
    END IF;
    
    -- Prevent changing the role of the last admin
    IF OLD.role = 'admin' AND NEW.role != 'admin' THEN
        IF (SELECT COUNT(*) FROM user_profiles WHERE role = 'admin') <= 1 THEN
            RAISE EXCEPTION 'Cannot change role of the last administrator';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enhanced function to log user activities with IP and user agent
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
    p_admin_comment TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
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
        admin_comment,
        ip_address,
        user_agent,
        metadata
    ) VALUES (
        uuid_generate_v4(),
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
        p_admin_comment,
        p_ip_address,
        p_user_agent,
        jsonb_build_object(
            'timestamp', NOW(),
            'environment', current_setting('application_name', true),
            'session_id', current_setting('app.current_session_id', true)
        )
    )
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Enhanced function to handle user deletion
CREATE OR REPLACE FUNCTION handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
    -- Log the deletion
    PERFORM log_user_activity(
        OLD.user_id,
        auth.uid(),
        'user_deleted',
        OLD.status,
        'deleted',
        OLD.role,
        NULL,
        TG_ARGV[0],
        NULL,
        NULL,
        NULL,
        'User account deleted'
    );
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 5: CREATE ENHANCED TRIGGERS
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

-- Trigger for role change validation
DROP TRIGGER IF EXISTS validate_role_change_trigger ON user_profiles;
CREATE TRIGGER validate_role_change_trigger
    BEFORE UPDATE OF role ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION validate_role_change();

-- Trigger for user deletion logging
DROP TRIGGER IF EXISTS log_user_deletion_trigger ON user_profiles;
CREATE TRIGGER log_user_deletion_trigger
    BEFORE DELETE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_user_deletion('User account deleted');

-- =====================================================
-- STEP 6: ENHANCED ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$
BEGIN
    -- User Profiles Policies
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
    
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

-- Create enhanced RLS policies for user_profiles
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
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all profiles" ON user_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create enhanced RLS policies for user_activity_logs
CREATE POLICY "Users can view own activity logs" ON user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs" ON user_activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for departments
CREATE POLICY "Admins can manage departments" ON departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view departments" ON departments
    FOR SELECT USING (true);

-- Create RLS policies for designations
CREATE POLICY "Admins can manage designations" ON designations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view designations" ON designations
    FOR SELECT USING (true);

-- =====================================================
-- STEP 7: CREATE HELPFUL VIEWS
-- =====================================================

-- Create view for user details with department and designation
CREATE OR REPLACE VIEW user_details AS
SELECT 
    up.*,
    d.name as department_name,
    des.name as designation_name,
    d.description as department_description,
    des.description as designation_description
FROM user_profiles up
LEFT JOIN departments d ON up.department = d.name
LEFT JOIN designations des ON up.designation = des.name;

-- Create view for active admins
CREATE OR REPLACE VIEW active_admins AS
SELECT *
FROM user_profiles
WHERE role = 'admin'
AND status = 'active'
AND approval_status = 'approved';

-- Create view for users on hold
CREATE OR REPLACE VIEW users_on_hold AS
SELECT *
FROM user_profiles
WHERE status = 'hold'
AND hold_end_date > NOW();

-- Create view for activity summary
CREATE OR REPLACE VIEW activity_summary AS
SELECT 
    user_id,
    COUNT(*) as total_activities,
    COUNT(*) FILTER (WHERE action_type = 'login_success') as login_count,
    MAX(created_at) FILTER (WHERE action_type = 'login_success') as last_login,
    COUNT(*) FILTER (WHERE action_type = 'profile_updated') as profile_updates,
    COUNT(*) FILTER (WHERE action_type = 'hold_applied') as hold_count
FROM user_activity_logs
GROUP BY user_id;

-- =====================================================
-- STEP 8: ADD SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
('IT', 'Information Technology Department'),
('HR', 'Human Resources Department'),
('Finance', 'Finance and Accounting Department'),
('Sales', 'Sales and Marketing Department')
ON CONFLICT (name) DO NOTHING;

-- Insert sample designations
INSERT INTO designations (name, description, department_id) 
SELECT 'Software Engineer', 'Develops and maintains software applications', id
FROM departments WHERE name = 'IT'
ON CONFLICT (name) DO NOTHING;

INSERT INTO designations (name, description, department_id)
SELECT 'HR Manager', 'Manages human resources operations', id
FROM departments WHERE name = 'HR'
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- STEP 9: CREATE HELPFUL FUNCTIONS FOR ADMIN USAGE
-- =====================================================

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    pending_approvals BIGINT,
    users_on_hold BIGINT,
    suspended_users BIGINT,
    admin_count BIGINT,
    manager_count BIGINT,
    employee_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE status = 'active') as active_users,
        COUNT(*) FILTER (WHERE approval_status = 'pending') as pending_approvals,
        COUNT(*) FILTER (WHERE status = 'hold') as users_on_hold,
        COUNT(*) FILTER (WHERE status = 'suspend') as suspended_users,
        COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
        COUNT(*) FILTER (WHERE role = 'manager') as manager_count,
        COUNT(*) FILTER (WHERE role = 'employee') as employee_count
    FROM user_profiles;
END;
$$ LANGUAGE plpgsql;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    date DATE,
    login_count BIGINT,
    profile_updates BIGINT,
    role_changes BIGINT,
    status_changes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        DATE(created_at) as date,
        COUNT(*) FILTER (WHERE action_type = 'login_success') as login_count,
        COUNT(*) FILTER (WHERE action_type = 'profile_updated') as profile_updates,
        COUNT(*) FILTER (WHERE action_type = 'role_changed') as role_changes,
        COUNT(*) FILTER (WHERE action_type IN ('activated', 'hold_applied', 'suspended')) as status_changes
    FROM user_activity_logs
    WHERE created_at >= CURRENT_DATE - p_days * INTERVAL '1 day'
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'DATABASE SETUP V4 COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'New Features in V4:';
    RAISE NOTICE '- Enhanced data validation';
    RAISE NOTICE '- Improved employee ID generation';
    RAISE NOTICE '- Better activity logging with metadata';
    RAISE NOTICE '- Department and designation management';
    RAISE NOTICE '- Helpful views for common queries';
    RAISE NOTICE '- Enhanced RLS policies';
    RAISE NOTICE '- Statistical functions for admins';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Create first admin user';
    RAISE NOTICE '2. Add departments and designations';
    RAISE NOTICE '3. Test user management features';
    RAISE NOTICE '4. Monitor system performance';
    RAISE NOTICE '=====================================================';
END $$;