-- Admin Setup Script
-- Run this script to manually create the first admin user
-- Replace the values with your actual admin user details

-- First, create the admin user in auth.users (if not already exists)
-- You need to create this user through Supabase Auth UI or API first
-- Then run this script to update their profile

-- Example: Update an existing user to be admin
-- Replace 'your-admin-user-id' with the actual user ID from auth.users

UPDATE user_profiles 
SET 
    role = 'admin',
    status = 'approved',
    employee_id = 'EMP20240001',
    joining_date = CURRENT_DATE
WHERE user_id = 'your-admin-user-id';

-- Or if you want to create a new admin profile directly:
-- INSERT INTO user_profiles (
--     user_id,
--     user_name,
--     email,
--     contact_no,
--     address,
--     city,
--     state,
--     pincode,
--     dob,
--     role,
--     status,
--     employee_id,
--     joining_date,
--     created_at
-- ) VALUES (
--     'your-admin-user-id',
--     'Admin User',
--     'admin@company.com',
--     '1234567890',
--     'Admin Address',
--     'Mumbai',
--     'Maharashtra',
--     '400001',
--     '1990-01-01',
--     'admin',
--     'approved',
--     'EMP20240001',
--     CURRENT_DATE,
--     NOW()
-- );

-- Verify the admin was created
SELECT 
    user_name,
    email,
    role,
    status,
    employee_id,
    joining_date
FROM user_profiles 
WHERE role = 'admin'; 