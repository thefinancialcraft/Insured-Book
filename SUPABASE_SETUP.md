# Supabase Setup Guide

## 🚀 **Quick Setup**

### **1. Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down your **Project URL** and **anon public key**

### **2. Update Environment Variables**
Create `.env.local` file in your project root:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### **3. Setup Database Tables**
Run this SQL in your Supabase SQL Editor:

```sql
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  employee_id TEXT UNIQUE,
  joining_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

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
```

### **4. Configure Authentication**

#### **Email Authentication**
1. Go to **Authentication** → **Settings**
2. Enable **Email confirmations**
3. Set **Site URL** to `http://localhost:8080`

#### **Google OAuth**
1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Add your Google OAuth credentials
4. Set **Redirect URL** to `http://localhost:8080/auth/callback`

#### **Password Reset**
1. Go to **Authentication** → **Settings**
2. Set **Redirect URL** to `http://localhost:8080/approval-pending`

### **5. Setup Admin User**
Follow the detailed guide in `ADMIN_SETUP_GUIDE.md` to create your first admin user.

## 🔧 **Features**

### **Authentication Flow**
- ✅ **Email/password** authentication with verification
- ✅ **Google OAuth** integration
- ✅ **Two-step signup** (email → profile completion)
- ✅ **Approval system** (24-72 hours)
- ✅ **Employee ID generation** after approval
- ✅ **Real-time status updates**
- ✅ **Role-based access control**

### **Role Management**
- ✅ **Admin-only role assignment** (users cannot select their own role)
- ✅ **Role hierarchy**: Admin → Manager → Supervisor → Employee
- ✅ **Visual role indicators** with color coding
- ✅ **Role-based permissions**

### **User Management**
- ✅ **Admin panel** for user management
- ✅ **User approval/rejection** system
- ✅ **Profile completion** workflow
- ✅ **Employee ID generation**
- ✅ **Real-time updates**

## 🧪 **Test the Setup**

### **Email Authentication Flow**
1. **Sign up** with email/password
2. **Verify email** by clicking link
3. **Complete profile** with personal details
4. **Wait for approval** (admin must approve)
5. **Get Employee ID** after approval
6. **Access dashboard**

### **Google OAuth Flow**
1. **Sign in** with Google
2. **Complete profile** with personal details
3. **Wait for approval** (admin must approve)
4. **Get Employee ID** after approval
5. **Access dashboard**

### **Admin Setup**
1. **Create admin user** (follow `ADMIN_SETUP_GUIDE.md`)
2. **Access admin panel** at `/admin`
3. **Assign roles** to users
4. **Approve/reject** user applications

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Foreign Key Constraint Error**
```sql
-- Check if user exists in auth.users
SELECT * FROM auth.users WHERE id = 'your-user-id';

-- Verify user_profiles table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'user_profiles';
```

#### **2. Role Assignment Issues**
- Ensure admin user has `role = 'admin'` in database
- Check RLS policies are correctly set
- Verify admin user is logged in

#### **3. Approval System Issues**
- Check `status` field in `user_profiles` table
- Verify real-time subscriptions are working
- Ensure admin has approved the user

### **Database Verification**
```sql
-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Check user profiles
SELECT user_name, email, role, status, employee_id 
FROM user_profiles 
ORDER BY created_at DESC;
```

## 📚 **Additional Resources**

- **Admin Setup**: See `ADMIN_SETUP_GUIDE.md`
- **Database Schema**: See `database_setup.sql`
- **Role Management**: Only admins can assign roles
- **User Flow**: Email verification → Profile completion → Approval → Dashboard

## ✅ **Verification Checklist**

- [ ] Supabase project created
- [ ] Environment variables set
- [ ] Database tables created
- [ ] RLS policies configured
- [ ] Authentication providers configured
- [ ] Admin user created
- [ ] Email verification working
- [ ] Profile completion working
- [ ] Approval system working
- [ ] Admin panel accessible
- [ ] Role assignment working

---

**Need Help?** Check the troubleshooting section or refer to the admin setup guide.
