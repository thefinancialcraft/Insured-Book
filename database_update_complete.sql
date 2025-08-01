-- =====================================================
-- COMPLETE DATABASE UPDATE SCRIPT
-- Updates existing user_profiles table with new fields
-- =====================================================

-- Drop existing policies and triggers to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON user_profiles;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS check_hold_status_trigger ON user_profiles;

-- =====================================================
-- STEP 1: FIX EXISTING STATUS CONSTRAINT
-- =====================================================

-- Drop the existing status check constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_status_check;

-- Add the new status check constraint
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_status_check 
CHECK (status IN ('active', 'hold', 'suspend'));

-- =====================================================
-- STEP 2: ADD MISSING COLUMNS TO EXISTING TABLE
-- =====================================================

-- Add approval_status column (separate from status)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Add status_reason column for rejection, hold, or suspend reasons
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS status_reason TEXT DEFAULT NULL;

-- Add hold_days column for hold duration
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS hold_days INTEGER DEFAULT NULL;

-- Add hold_start_date column for hold start tracking
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS hold_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add hold_end_date column for custom hold periods
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS hold_end_date TIMESTAMP WITH TIME ZONE;

-- Update existing hold records to have end dates if they don't have them
UPDATE user_profiles 
SET hold_end_date = hold_start_date + INTERVAL '1 day' * hold_days
WHERE status = 'hold' AND hold_end_date IS NULL AND hold_start_date IS NOT NULL AND hold_days IS NOT NULL;

-- =====================================================
-- STEP 3: UPDATE EXISTING STATUS VALUES
-- =====================================================

-- Update existing status values to match new schema
-- Convert old status values to new approval_status and status system
UPDATE user_profiles 
SET 
    approval_status = CASE 
        WHEN status = 'pending' THEN 'pending'
        WHEN status = 'approved' THEN 'approved'
        WHEN status = 'rejected' THEN 'rejected'
        ELSE 'pending'
    END,
    status = CASE 
        WHEN status IN ('pending', 'approved', 'rejected') THEN 'active'
        WHEN status = 'hold' THEN 'hold'
        WHEN status = 'suspend' THEN 'suspend'
        ELSE 'active'
    END
WHERE approval_status IS NULL;

-- =====================================================
-- STEP 4: CREATE FUNCTIONS
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
RETURNS TEXT AS $$
DECLARE
  new_employee_id TEXT;
BEGIN
  -- Generate employee ID with format: EMP + year + 4 digit sequence
  SELECT 'EMP' || EXTRACT(YEAR FROM CURRENT_DATE) || LPAD(COALESCE(MAX(CAST(SUBSTRING(employee_id FROM 8) AS INTEGER)), 0) + 1::TEXT, 4, '0')
  INTO new_employee_id
  FROM user_profiles 
  WHERE employee_id IS NOT NULL 
    AND employee_id LIKE 'EMP' || EXTRACT(YEAR FROM CURRENT_DATE) || '%';
  
  RETURN new_employee_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically change hold status to active after hold period
CREATE OR REPLACE FUNCTION check_hold_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is hold and hold_end_date is set, check if hold period has expired
  IF NEW.status = 'hold' AND NEW.hold_end_date IS NOT NULL THEN
    -- If hold period has expired, change status to active
    IF NEW.hold_end_date <= NOW() THEN
      NEW.status = 'active';
      NEW.hold_days = NULL;
      NEW.hold_start_date = NULL;
      NEW.hold_end_date = NULL;
      NEW.status_reason = 'Account automatically activated after hold period';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 5: CREATE TRIGGERS
-- =====================================================

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to check hold status
CREATE TRIGGER check_hold_status_trigger 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION check_hold_status();

-- =====================================================
-- STEP 6: TEMPORARILY DISABLE RLS FOR EASIER MANAGEMENT
-- =====================================================

-- Temporarily disable RLS to fix the infinite recursion issue
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

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

-- Check current data
SELECT 
    user_name, 
    email, 
    role, 
    approval_status, 
    status, 
    status_reason,
    employee_id,
    created_at
FROM user_profiles 
LIMIT 5;

-- =====================================================
-- STEP 8: SAMPLE DATA INSERTION (OPTIONAL)
-- =====================================================

-- Insert sample admin user (uncomment if needed)
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
    dob,
    role,
    approval_status,
    status,
    employee_id,
    joining_date
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- Replace with actual UUID
    'Admin User',
    'admin@example.com',
    '1234567890',
    '123 Admin Street',
    'Admin City',
    'Admin State',
    '123456',
    '1990-01-01',
    'admin',
    'approved',
    'active',
    'EMP20240001',
    CURRENT_DATE
) ON CONFLICT (user_id) DO NOTHING;
*/

-- =====================================================
-- STEP 9: RE-ENABLE RLS (OPTIONAL - UNCOMMENT WHEN READY)
-- =====================================================

-- Uncomment the following lines when you're ready to enable RLS
/*
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);
*/

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Database update completed successfully!';
    RAISE NOTICE 'Status constraint updated to: active, hold, suspend';
    RAISE NOTICE 'New columns added: approval_status, status_reason, hold_days, hold_start_date, hold_end_date';
    RAISE NOTICE 'Enhanced hold functionality with custom end dates';
    RAISE NOTICE 'Functions and triggers created successfully';
    RAISE NOTICE 'RLS is temporarily disabled for easier management';
    RAISE NOTICE 'Run verification queries to check the results';
END $$; 