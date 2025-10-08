# Admin Setup Guide

## 🎯 **Overview**
This guide explains how to set up the first admin user in your system. Users can no longer select their own roles - only admins can assign roles to users.

## 📋 **Prerequisites**
- Supabase project set up
- Database tables created (`user_profiles`)
- Application running locally

## 🚀 **Step-by-Step Admin Setup**

### **Step 1: Create Admin User Account**
1. **Sign up normally** through your application
   - Go to `http://localhost:8080/signup`
   - Use admin email (e.g., `admin@company.com`)
   - Complete email verification

2. **Complete profile** with admin details
   - Go to `http://localhost:8080/profile-completion`
   - Fill in admin details (name, contact, address, etc.)
   - Submit the form

### **Step 2: Manually Set Admin Role in Database**

#### **Option A: Using Supabase Dashboard**
1. Go to your **Supabase Dashboard**
2. Navigate to **Table Editor** → **user_profiles**
3. Find your admin user record
4. Update the following fields:
   ```sql
   role = 'admin'
   status = 'approved'
   employee_id = 'EMP20240001'
   joining_date = CURRENT_DATE
   ```

#### **Option B: Using SQL Script**
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this script (replace `your-admin-user-id` with actual user ID):

```sql
-- Get your admin user ID first
SELECT user_id, user_name, email FROM user_profiles WHERE email = 'admin@company.com';

-- Then update the admin user (replace 'your-admin-user-id' with actual ID)
UPDATE user_profiles 
SET 
    role = 'admin',
    status = 'approved',
    employee_id = 'EMP20240001',
    joining_date = CURRENT_DATE
WHERE user_id = 'your-admin-user-id';
```

### **Step 3: Verify Admin Setup**
1. **Check database**: Verify admin record in `user_profiles` table
2. **Login as admin**: Go to `http://localhost:8080/login`
3. **Access admin panel**: Go to `http://localhost:8080/admin`

## 🔧 **Admin Panel Features**

### **Role Management**
- **View all users** with their current roles
- **Change user roles** using "Change Role" button
- **Role hierarchy**: Admin → Manager → Supervisor → Employee
- **Role colors**: 
  - 🔴 Admin (Red)
  - 🔵 Manager (Blue) 
  - 🟣 Supervisor (Purple)
  - ⚪ Employee (Gray)

### **User Approval**
- **Approve users**: Generates Employee ID and sets joining date
- **Reject users**: Changes status to rejected
- **View details**: See complete user information

## 📊 **Role Hierarchy**

```
Admin (🔴)
├── Manager (🔵)
│   ├── Supervisor (🟣)
│   │   └── Employee (⚪)
│   └── Employee (⚪)
└── Employee (⚪)
```

## 🔐 **Security Notes**

### **Role Assignment Rules**
- ✅ **Only admins** can assign roles
- ✅ **Users cannot** select their own role
- ✅ **Default role** is 'employee' for new users
- ✅ **Role changes** require admin approval

### **Admin Privileges**
- **Full access** to admin panel
- **Can assign** any role to any user
- **Can approve/reject** user applications
- **Can view** all user details

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Admin Panel Not Accessible**
- **Check**: User has `role = 'admin'` in database
- **Check**: User has `status = 'approved'` in database
- **Solution**: Update database manually

#### **2. Role Assignment Not Working**
- **Check**: User is logged in as admin
- **Check**: Database permissions are correct
- **Solution**: Verify RLS policies

#### **3. User Stuck in Pending**
- **Check**: Admin has approved the user
- **Check**: User has completed profile
- **Solution**: Approve user through admin panel

### **Database Verification**
```sql
-- Check admin users
SELECT user_name, email, role, status FROM user_profiles WHERE role = 'admin';

-- Check pending users
SELECT user_name, email, role, status FROM user_profiles WHERE status = 'pending';

-- Check all users
SELECT user_name, email, role, status, employee_id FROM user_profiles ORDER BY created_at DESC;
```

## 📝 **Quick Commands**

### **Create Admin (SQL)**
```sql
-- Replace with actual user ID
UPDATE user_profiles 
SET role = 'admin', status = 'approved', employee_id = 'EMP20240001', joining_date = CURRENT_DATE
WHERE user_id = 'your-admin-user-id';
```

### **Assign Role (SQL)**
```sql
-- Replace with actual values
UPDATE user_profiles 
SET role = 'manager' 
WHERE user_id = 'target-user-id';
```

## ✅ **Verification Checklist**

- [ ] Admin user created in auth.users
- [ ] Admin profile completed in user_profiles
- [ ] Admin role set to 'admin' in database
- [ ] Admin status set to 'approved' in database
- [ ] Admin can access `/admin` route
- [ ] Admin can assign roles to other users
- [ ] Admin can approve/reject user applications

## 🎉 **Success Indicators**

✅ **Admin can log in** and access dashboard  
✅ **Admin panel** shows all users  
✅ **Role assignment** works for all users  
✅ **User approval** generates Employee IDs  
✅ **Real-time updates** work correctly  

---

**Need Help?** Check the troubleshooting section or verify your database setup with the provided SQL commands. 