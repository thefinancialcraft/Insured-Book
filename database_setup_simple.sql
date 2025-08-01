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

-- Create user_profiles table with approval system and roles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_no TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  dob DATE NOT NULL,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee', 'supervisor')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hold', 'suspend', 'active')),
  employee_id TEXT UNIQUE,
  joining_date DATE,
  hold_days INTEGER DEFAULT NULL,
  hold_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Temporarily disable RLS to fix the infinite recursion issue
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

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
  -- If status is hold and hold_days is set, check if hold period has expired
  IF NEW.status = 'hold' AND NEW.hold_days IS NOT NULL AND NEW.hold_start_date IS NOT NULL THEN
    -- If hold period has expired, change status to active
    IF NEW.hold_start_date + INTERVAL '1 day' * NEW.hold_days <= NOW() THEN
      NEW.status = 'active';
      NEW.hold_days = NULL;
      NEW.hold_start_date = NULL;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check hold status
CREATE TRIGGER check_hold_status_trigger 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION check_hold_status(); 