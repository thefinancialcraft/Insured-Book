-- =====================================================
-- QUICK FIX FOR STATUS CONSTRAINT ISSUE
-- =====================================================

-- Drop the existing status check constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_status_check;

-- Add the new status check constraint
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_status_check 
CHECK (status IN ('active', 'hold', 'suspend'));

-- Update any existing data to match new constraint
UPDATE user_profiles 
SET status = 'active' 
WHERE status NOT IN ('active', 'hold', 'suspend');

-- Verify the fix
SELECT 
    user_name, 
    email, 
    status, 
    approval_status
FROM user_profiles 
LIMIT 5;

DO $$
BEGIN
    RAISE NOTICE 'Status constraint fixed successfully!';
    RAISE NOTICE 'New constraint: status IN (active, hold, suspend)';
END $$; 