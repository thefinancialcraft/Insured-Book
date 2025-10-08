# Supabase Setup Guide

## 🚀 **Complete Supabase Configuration for User Management System**

This guide will help you set up Supabase with all the new features including approval system, status management, and reason tracking.

---

## **📋 Prerequisites**

1. **Supabase Account**: Create an account at [supabase.com](https://supabase.com)
2. **New Project**: Create a new Supabase project
3. **Project URL & Keys**: Note down your project URL and anon key

---

## **🔧 Step 1: Database Setup**

### **1.1 Run Database Update Script**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire content from `database_update_complete.sql`
5. Click **Run** to execute the script

### **1.2 Verify Database Structure**
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

**Expected New Columns:**
- `approval_status` (text, default 'pending')
- `status_reason` (text, nullable)
- `hold_days` (integer, nullable)
- `hold_start_date` (timestamptz, nullable)

---

## **🔐 Step 2: Authentication Setup**

### **2.1 Configure Authentication Providers**
1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. **Email Auth**: Enable (default)
3. **Google Auth**: Enable and configure
   - Add your Google OAuth credentials
   - Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### **2.2 Configure Email Templates**
1. Go to **Authentication** → **Email Templates**
2. **Confirm signup**: Customize the email verification template
3. **Reset password**: Customize the password reset template

### **2.3 Set Site URL**
1. Go to **Authentication** → **Settings**
2. Set **Site URL** to your application URL (e.g., `http://localhost:8080`)

---

## **👤 Step 3: Create First Admin User**

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

## **🔧 Step 4: Environment Variables**

### **4.1 Create .env File**
Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### **4.2 Get Your Keys**
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **Project URL** and **anon public** key
3. Replace the values in your `.env` file

---

## **🧪 Step 5: Test the System**

### **5.1 Test User Registration**
1. **Sign Up**: Create a new user account
2. **Email Verification**: Check email and verify
3. **Profile Completion**: Fill in all required details
4. **Approval Pending**: Should see pending status

### **5.2 Test Admin Functions**
1. **Login as Admin**: Access `/admin`
2. **View Users**: See all users in the table
3. **Approve User**: Click approve with reason input
4. **Hold User**: Put user on hold with reason
5. **Suspend User**: Suspend user with reason

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

#### **2. Authentication Issues**
- Check your `.env` file has correct values
- Verify Supabase URL and anon key
- Check browser console for errors

#### **3. RLS (Row Level Security) Issues**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
```

#### **4. Google OAuth Issues**
- Verify redirect URLs in Google Console
- Check Supabase OAuth settings
- Ensure HTTPS for production

---

## **📊 Database Schema Overview**

### **User Profiles Table:**
```sql
CREATE TABLE user_profiles (
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
  
  -- Approval System (Separate from status)
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  
  -- Status Management System (Separate from approval)
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hold', 'suspend')),
  
  -- Status Reason for rejection, hold, or suspend
  status_reason TEXT DEFAULT NULL,
  
  employee_id TEXT UNIQUE,
  joining_date DATE,
  hold_days INTEGER DEFAULT NULL,
  hold_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

---

## **✅ Success Checklist**

- [ ] Database update script executed successfully
- [ ] All new columns added to user_profiles table
- [ ] Authentication providers configured
- [ ] Email templates customized
- [ ] First admin user created and configured
- [ ] Environment variables set correctly
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

**🎉 Congratulations! Your Supabase setup is now complete with approval system, status management, and reason tracking!**
