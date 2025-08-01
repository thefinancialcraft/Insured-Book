-- Update existing user_profiles table to add new status options and hold fields
-- This script should be run in Supabase SQL Editor

-- First, update the status check constraint to include new statuses
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_status_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected', 'hold', 'suspend', 'active'));

-- Add hold-related columns if they don't exist
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS hold_days INTEGER DEFAULT NULL;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS hold_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;

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

-- Create trigger to check hold status (drop if exists first)
DROP TRIGGER IF EXISTS check_hold_status_trigger ON user_profiles;
CREATE TRIGGER check_hold_status_trigger 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION check_hold_status();

-- Update any existing 'approved' status to 'active' for consistency
UPDATE user_profiles SET status = 'active' WHERE status = 'approved';

-- Verify the changes
SELECT status, COUNT(*) as count FROM user_profiles GROUP BY status; 