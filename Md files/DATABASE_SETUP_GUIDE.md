# Database Setup Guide

## 🚀 **Complete Database Setup for User Management System**

This guide will help you set up the database with all the new features including approval system, status management, and reason tracking.

### **📋 Prerequisites**
- Supabase project created
- Access to Supabase SQL Editor
- Basic understanding of PostgreSQL

---

## **🔧 Step 1: Run the Complete Database Update**

### **1.1 Open Supabase SQL Editor**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### **1.2 Execute the Complete Update Script**
1. Copy the entire content from `database_update_complete.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

### **1.3 Verify the Update**
After running the script, you should see:
- ✅ Success messages in the output
- ✅ New columns added to the table
- ✅ Functions and triggers created

---

## **📊 Step 2: Verify Table Structure**

Run this query to verify your table structure:

```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;
```

**Expected Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `user_name` (text, not null)
- `email` (text, not null)
- `contact_no` (text, not null)
- `address` (text, not null)
- `city` (text, not null)
- `state` (text, not null)
- `pincode` (text, not null)
- `dob` (date, not null)
- `role` (text, default 'employee')
- `approval_status` (text, default 'pending') ⭐ **NEW**
- `status` (text, default 'active') ⭐ **UPDATED**
- `status_reason` (text, nullable) ⭐ **NEW**
- `employee_id` (text, unique)
- `joining_date` (date)
- `hold_days` (integer, nullable) ⭐ **NEW**
- `hold_start_date` (timestamptz, nullable) ⭐ **NEW**
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

---

## **👤 Step 3: Create Your First Admin User**

### **3.1 Sign Up as Admin**
1. Go to your application
2. Sign up with your admin email
3. Complete the profile completion form
4. You'll be redirected to `/approval-pending`

### **3.2 Manually Update Database**
Run this SQL query in Supabase SQL Editor:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE user_profiles 
SET 
    role = 'admin',
    approval_status = 'approved',
    status = 'active',
    employee_id = 'EMP20240001',
    joining_date = CURRENT_DATE
WHERE email = 'your-email@example.com';
```

### **3.3 Verify Admin Setup**
Run this query to check your admin user:

```sql
SELECT 
    user_name,
    email,
    role,
    approval_status,
    status,
    employee_id
FROM user_profiles 
WHERE role = 'admin';
```

---

## **🔐 Step 4: Enable Row Level Security (Optional)**

**⚠️ Warning:** Only enable RLS when you're ready for production. For testing, keep it disabled.

### **4.1 Enable RLS**
Uncomment and run this section in `database_update_complete.sql`:

```sql
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
```

---

## **🧪 Step 5: Test the System**

### **5.1 Test User Flow**
1. **Sign Up**: Create a new user account
2. **Profile Completion**: Fill in all required details
3. **Approval Pending**: Should see pending status
4. **Admin Approval**: Login as admin and approve user
5. **Dashboard Access**: User should be redirected to dashboard

### **5.2 Test Admin Functions**
1. **Login as Admin**: Access `/admin`
2. **View Users**: See all users in the table
3. **Approve User**: Click approve with reason
4. **Hold User**: Put user on hold with reason
5. **Suspend User**: Suspend user with reason
6. **Activate User**: Reactivate suspended/hold users

### **5.3 Test Status Pages**
1. **Rejected User**: Should see `/rejected` page with reason
2. **Hold User**: Should see `/hold` page with reason
3. **Suspended User**: Should see `/suspended` page with reason

---

## **🔍 Troubleshooting**

### **Common Issues:**

#### **1. "Column does not exist" Error**
```sql
-- Check if columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles';
```

#### **2. "Function does not exist" Error**
```sql
-- Recreate functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';
```

#### **3. "Policy already exists" Error**
```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
-- Then recreate them
```

#### **4. RLS Issues**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
```

---

## **📝 Database Schema Summary**

### **Approval System:**
- `approval_status`: `pending` | `approved` | `rejected`
- Controls whether user can access the system

### **Status Management:**
- `status`: `active` | `hold` | `suspend`
- Controls user's current operational status

### **Reason Tracking:**
- `status_reason`: Text field for rejection/hold/suspend reasons
- Displayed to users on respective status pages

### **Hold System:**
- `hold_days`: Number of days for hold period
- `hold_start_date`: When hold started
- Automatic activation after hold period expires

---

## **✅ Success Checklist**

- [ ] Database update script executed successfully
- [ ] All new columns added to user_profiles table
- [ ] Functions and triggers created
- [ ] First admin user created and configured
- [ ] User signup flow tested
- [ ] Admin panel functionality tested
- [ ] Status pages (rejected/hold/suspended) tested
- [ ] Reason input and display working
- [ ] Real-time updates working

---

## **🎯 Next Steps**

1. **Test the complete flow** with multiple users
2. **Configure email templates** for notifications
3. **Set up RLS policies** for production
4. **Monitor system performance**
5. **Backup your database** regularly

---

**🎉 Congratulations! Your user management system is now fully configured with approval system, status management, and reason tracking!** 