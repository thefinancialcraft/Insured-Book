# Insured Book Application - Complete Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Authentication Flow](#authentication-flow)
4. [User Management System](#user-management-system)
5. [Admin Panel Features](#admin-panel-features)
6. [Activity Logging System](#activity-logging-system)
7. [File Structure](#file-structure)
8. [SQL Setup Guide](#sql-setup-guide)
9. [Component Documentation](#component-documentation)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview


The Insured Book application is a comprehensive user management system with role-based access control, approval workflows, and detailed activity logging. It features a modern React frontend with Supabase backend integration.

### Key Features:
- ✅ **Multi-step Authentication** - Email verification → Profile completion → Approval
- ✅ **Role-based Access Control** - Admin, Manager, Employee, Supervisor roles
- ✅ **Status Management** - Active, Hold, Suspend statuses with automatic activation
- ✅ **Admin Panel** - Complete user management with activity tracking
- ✅ **Activity Logging** - Detailed audit trail with admin tracking
- ✅ **Hold System** - Temporary account suspension with countdown timers
- ✅ **Real-time Updates** - Live status changes and notifications

---

## 🗄️ Database Schema

### Tables

#### 1. `user_profiles` Table
```sql
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_no TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    dob DATE,
    
    -- Role Management (Admin-assigned only)
    role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee', 'supervisor')),
    
    -- Approval System (Separate from status)
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    
    -- Status Management System (Separate from approval)
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hold', 'suspend')),
    
    -- Status Reason for rejection, hold, or suspend
    status_reason TEXT DEFAULT NULL,
    
    -- Employee Information
    employee_id TEXT DEFAULT NULL,
    joining_date DATE DEFAULT NULL,
    
    -- Hold Management
    hold_days INTEGER DEFAULT NULL,
    hold_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    hold_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. `user_activity_logs` Table
```sql
CREATE TABLE user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_user_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL CHECK (action_type IN (
        'approval_requested', 'approval_accepted', 'approval_rejected',
        'activated', 'hold_applied', 'hold_removed', 'suspended',
        'unsuspended', 'role_changed', 'profile_updated'
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Database Functions

#### 1. `update_updated_at_column()`
- **Purpose**: Automatically updates the `updated_at` timestamp
- **Trigger**: Fires before UPDATE on `user_profiles`
- **Usage**: Automatic timestamp management

#### 2. `generate_employee_id()`
- **Purpose**: Auto-generates employee IDs in format `EMP{timestamp}`
- **Trigger**: Fires before INSERT on `user_profiles`
- **Usage**: Automatic employee ID generation

#### 3. `check_hold_status()`
- **Purpose**: Automatically activates users when hold period expires
- **Trigger**: Fires before UPDATE on `user_profiles`
- **Logic**: Checks if `hold_end_date <= NOW()` and activates user

#### 4. `log_user_activity()`
- **Purpose**: Logs all user activities with admin tracking
- **Parameters**: User ID, admin ID, action type, status changes, reasons
- **Usage**: Called by triggers to maintain audit trail

#### 5. `log_profile_changes()`
- **Purpose**: Main trigger function for logging profile changes
- **Features**: 
  - Gets admin info using `auth.uid()`
  - Logs status, role, and approval changes
  - Includes admin name and employee ID in logs

### Database Triggers

#### 1. `update_user_profiles_updated_at`
- **Table**: `user_profiles`
- **Event**: BEFORE UPDATE
- **Function**: `update_updated_at_column()`

#### 2. `generate_employee_id_trigger`
- **Table**: `user_profiles`
- **Event**: BEFORE INSERT
- **Function**: `generate_employee_id()`

#### 3. `check_hold_status_trigger`
- **Table**: `user_profiles`
- **Event**: BEFORE UPDATE
- **Function**: `check_hold_status()`

#### 4. `log_profile_changes_trigger`
- **Table**: `user_profiles`
- **Event**: AFTER UPDATE
- **Function**: `log_profile_changes()`

---

## 🔐 Authentication Flow

### 1. Email/Password Signup
```
1. User enters email and password
2. Account created in Supabase Auth
3. Redirected to email verification page
4. User verifies email
5. Redirected to profile completion
6. User fills remaining details
7. Status: pending approval
8. Admin approves/rejects
9. User gets employee ID and access
```

### 2. Google OAuth Signup
```
1. User clicks "Sign in with Google"
2. Google OAuth authentication
3. Redirected to profile completion
4. User fills remaining details
5. Status: pending approval
6. Admin approves/rejects
7. User gets employee ID and access
```

### 3. Login Flow
```
1. User enters credentials
2. AuthGuard checks authentication
3. AuthGuard checks profile status
4. Redirected based on status:
   - pending → /approval-pending
   - rejected → /rejection-page
   - hold → /hold
   - suspend → /suspended
   - active → /dashboard
```

---

## 👥 User Management System

### User Statuses

#### 1. Approval Status
- **`pending`**: Waiting for admin approval
- **`approved`**: Approved by admin, can access system
- **`rejected`**: Rejected by admin, cannot access

#### 2. User Status
- **`active`**: Normal access to system
- **`hold`**: Temporarily suspended with countdown
- **`suspend`**: Permanently suspended

### User Roles

#### 1. Admin
- **Permissions**: Full system access
- **Features**: User management, role assignment, status control
- **Access**: Admin panel, all user data

#### 2. Manager
- **Permissions**: Limited administrative access
- **Features**: User monitoring, basic management
- **Access**: Manager dashboard

#### 3. Employee
- **Permissions**: Standard user access
- **Features**: Basic system usage
- **Access**: Employee dashboard

#### 4. Supervisor
- **Permissions**: Team management access
- **Features**: Team oversight, reporting
- **Access**: Supervisor dashboard

---

## 🛠️ Admin Panel Features

### Core Functions

#### 1. User Approval System
```typescript
const approveUser = async (userId: string) => {
    // Sets approval_status to 'approved'
    // Sets status to 'active'
    // Generates employee ID
    // Sets joining date
    // Logs activity with admin tracking
}
```

#### 2. User Rejection System
```typescript
const rejectUser = async (userId: string) => {
    // Sets approval_status to 'rejected'
    // Requires reason input
    // Logs activity with admin tracking
}
```

#### 3. Hold System
```typescript
const holdUser = async (userId: string, days?: number, customEndDate?: string) => {
    // Sets status to 'hold'
    // Calculates hold period
    // Sets hold_days, hold_start_date, hold_end_date
    // Logs activity with admin tracking
}
```

#### 4. Suspend System
```typescript
const suspendUser = async (userId: string) => {
    // Sets status to 'suspend'
    // Resets hold-related fields
    // Logs activity with admin tracking
}
```

#### 5. Activate System
```typescript
const activateUser = async (userId: string) => {
    // Sets status to 'active'
    // Resets hold-related fields
    // Logs activity with admin tracking
}
```

#### 6. Role Management
```typescript
const updateUserRole = async (userId: string, newRole: string) => {
    // Updates user role
    // Logs activity with admin tracking
}
```

### Hold Duration Options

#### 1. Predefined Periods
- **1 Day**: 24-hour hold
- **2 Days**: 48-hour hold
- **3 Days**: 72-hour hold

#### 2. Custom Period
- **Custom Date & Time**: User-defined hold period
- **Calendar Selection**: Date picker interface
- **Time Input**: Specific time selection

### Activity Logging

#### 1. Log Display
```typescript
const fetchUserLogs = async (userId: string) => {
    // Fetches activity logs for specific user
    // Displays in chronological order
    // Shows admin information, status changes, reasons
}
```

#### 2. Log Information
- **Action Type**: What action was performed
- **Admin Info**: Who performed the action (name + employee ID)
- **Status Changes**: Previous → New status
- **Role Changes**: Previous → New role
- **Reasons**: Why action was taken
- **Timestamps**: When action occurred
- **Hold Details**: Duration and period information

---

## 📊 Activity Logging System

### Log Types

#### 1. Approval Actions
- **`approval_requested`**: User submits for approval
- **`approval_accepted`**: Admin approves user
- **`approval_rejected`**: Admin rejects user

#### 2. Status Actions
- **`hold_applied`**: User put on hold
- **`hold_removed`**: User activated from hold
- **`suspended`**: User suspended
- **`unsuspended`**: User unsuspended
- **`activated`**: User activated

#### 3. Role Actions
- **`role_changed`**: User role updated

#### 4. Profile Actions
- **`profile_updated`**: Profile information changed

### Admin Tracking

#### 1. Automatic Admin Detection
```sql
-- Gets current admin from auth context
current_admin_id := auth.uid();

-- Fetches admin details
SELECT user_name, employee_id INTO current_admin_name, current_admin_employee_id
FROM user_profiles 
WHERE user_id = current_admin_id;
```

#### 2. Admin Comment Format
- **With Employee ID**: "John Doe (EMP1234567890)"
- **Without Employee ID**: "John Doe"
- **Fallback**: "System"

---

## 📁 File Structure

```
src/
├── components/
│   ├── AdminPanel.tsx          # Main admin interface
│   ├── AuthGuard.tsx           # Route protection
│   ├── HoldUser.tsx            # Hold status page
│   ├── SuspendedUser.tsx       # Suspended status page
│   ├── Layout.tsx              # Main layout wrapper
│   └── RejectionPage.tsx       # Rejection status page
├── hooks/
│   ├── useAuth.ts              # Authentication hook
│   └── useProfileCompletion.ts # Profile completion hook
├── pages/
│   ├── AdminPanel.tsx          # Admin panel page
│   ├── ApprovalPending.tsx     # Pending approval page
│   ├── AuthCallback.tsx        # OAuth callback
│   ├── CallPage.tsx            # Call management page
│   ├── Dashboard.tsx           # Main dashboard
│   ├── HoldUser.tsx            # Hold user page
│   ├── LoginPage.tsx           # Login page
│   ├── ProfileCompletion.tsx   # Profile completion
│   ├── RejectionPage.tsx       # Rejection page
│   ├── SignupPage.tsx          # Signup page
│   └── SuspendedUser.tsx       # Suspended user page
├── App.tsx                     # Main app component
└── main.tsx                    # App entry point
```

---

## 🗄️ SQL Setup Guide

### Complete Database Setup

#### 1. Run Complete Setup
```sql
-- Run the complete_database_setup.sql file in Supabase SQL Editor
-- This creates all tables, functions, triggers, and policies
```

#### 2. Create First Admin
```sql
-- After user registration, manually set first admin
UPDATE user_profiles 
SET role = 'admin', approval_status = 'approved', status = 'active'
WHERE email = 'your-admin-email@example.com';
```

#### 3. Fix Admin Tracking (if needed)
```sql
-- Run fix_admin_tracking.sql if admin names not showing
-- Updates trigger to use auth.uid() instead of session variables
```

### Database Functions Explained

#### 1. `update_updated_at_column()`
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';
```
- **Purpose**: Auto-updates timestamp on record changes
- **Trigger**: BEFORE UPDATE on user_profiles

#### 2. `generate_employee_id()`
```sql
CREATE OR REPLACE FUNCTION generate_employee_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.employee_id IS NULL THEN
    NEW.employee_id := 'EMP' || EXTRACT(EPOCH FROM NOW())::BIGINT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
- **Purpose**: Auto-generates unique employee IDs
- **Format**: EMP + Unix timestamp
- **Trigger**: BEFORE INSERT on user_profiles

#### 3. `check_hold_status()`
```sql
CREATE OR REPLACE FUNCTION check_hold_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'hold' AND NEW.hold_end_date IS NOT NULL AND NEW.hold_end_date <= NOW() THEN
    NEW.status := 'active';
    NEW.hold_days := NULL;
    NEW.hold_start_date := NULL;
    NEW.hold_end_date := NULL;
    NEW.status_reason := 'Account automatically activated after hold period';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
- **Purpose**: Auto-activates users when hold period expires
- **Logic**: Checks hold_end_date against current time
- **Trigger**: BEFORE UPDATE on user_profiles

#### 4. `log_user_activity()`
```sql
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
    p_admin_comment TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_activity_logs (
        id, user_id, admin_user_id, action_type, previous_status,
        new_status, previous_role, new_role, reason, hold_days,
        hold_start_date, hold_end_date, admin_comment
    ) VALUES (
        gen_random_uuid(), p_user_id, p_admin_user_id, p_action_type,
        p_previous_status, p_new_status, p_previous_role, p_new_role,
        p_reason, p_hold_days, p_hold_start_date, p_hold_end_date,
        p_admin_comment
    );
END;
$$ LANGUAGE plpgsql;
```
- **Purpose**: Logs all user activities
- **Parameters**: Complete activity information
- **Usage**: Called by triggers for audit trail

#### 5. `log_profile_changes()`
```sql
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS TRIGGER AS $$
DECLARE
    current_admin_id UUID;
    current_admin_name TEXT;
    current_admin_employee_id TEXT;
BEGIN
    -- Get current admin information from auth context
    current_admin_id := auth.uid();
    
    -- Get admin details if available
    IF current_admin_id IS NOT NULL THEN
        SELECT user_name, employee_id INTO current_admin_name, current_admin_employee_id
        FROM user_profiles 
        WHERE user_id = current_admin_id;
    END IF;
    
    -- Log different types of changes...
    -- (Status changes, role changes, approval changes)
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
- **Purpose**: Main trigger function for logging
- **Features**: Admin tracking, status monitoring, role changes
- **Trigger**: AFTER UPDATE on user_profiles

---

## 🧩 Component Documentation

### Core Components

#### 1. `AuthGuard.tsx`
```typescript
// Purpose: Route protection and user redirection
// Features:
// - Checks authentication status
// - Redirects based on user status
// - Prevents infinite redirects
// - Handles loading states
```

#### 2. `AdminPanel.tsx`
```typescript
// Purpose: Complete admin management interface
// Features:
// - User approval/rejection
// - Hold/suspend/activate users
// - Role management
// - Activity log viewing
// - Real-time updates
```

#### 3. `HoldUser.tsx`
```typescript
// Purpose: Hold status page for users
// Features:
// - Countdown timer to hold end
// - Manual activation option
// - Real-time status updates
// - Hold period information
```

#### 4. `SuspendedUser.tsx`
```typescript
// Purpose: Suspended status page
// Features:
// - Suspension information
// - Contact admin option
// - Status explanation
```

#### 5. `RejectionPage.tsx`
```typescript
// Purpose: Rejection status page
// Features:
// - Rejection reason display
// - Appeal information
// - Contact options
```

### Page Components

#### 1. `SignupPage.tsx`
```typescript
// Purpose: User registration
// Features:
// - Email/password signup
// - Google OAuth
// - Form validation
// - Error handling
```

#### 2. `LoginPage.tsx`
```typescript
// Purpose: User authentication
// Features:
// - Email/password login
// - Google OAuth
// - Error handling
// - Redirect logic
```

#### 3. `ProfileCompletion.tsx`
```typescript
// Purpose: Complete user profile
// Features:
// - Additional user details
// - Form validation
// - Database integration
// - Status management
```

#### 4. `ApprovalPending.tsx`
```typescript
// Purpose: Pending approval page
// Features:
// - Approval status display
// - Waiting information
// - Contact options
```

#### 5. `Dashboard.tsx`
```typescript
// Purpose: Main user dashboard
// Features:
// - User information display
// - Navigation menu
// - Status information
```

### Hook Components

#### 1. `useAuth.ts`
```typescript
// Purpose: Authentication state management
// Features:
// - User session management
// - Authentication status
// - Login/logout functions
// - Profile data access
```

#### 2. `useProfileCompletion.ts`
```typescript
// Purpose: Profile completion logic
// Features:
// - Profile data management
// - Form validation
// - Database operations
// - Status tracking
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Admin Names Not Showing
**Problem**: Activity logs show "System" instead of admin name
**Solution**: Run `fix_admin_tracking.sql` to update trigger

#### 2. UUID Constraint Errors
**Problem**: "null value in column 'id' violates not-null constraint"
**Solution**: Ensure `log_user_activity` function includes `gen_random_uuid()`

#### 3. Duplicate Log Entries
**Problem**: Same action logged multiple times
**Solution**: Remove manual RPC calls, let triggers handle logging

#### 4. Hold Not Auto-Activating
**Problem**: Users not automatically activated after hold period
**Solution**: Check `check_hold_status` trigger is properly configured

#### 5. RLS Policy Errors
**Problem**: "new row violates row-level security policy"
**Solution**: Ensure RLS policies are correctly configured for admin access

### Debug Steps

#### 1. Check Database Connection
```typescript
const testDatabaseConnection = async () => {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, user_name, email, role, status, approval_status')
        .limit(1);
    
    if (error) {
        console.error("Database connection test failed:", error);
    } else {
        console.log("Database connection successful, sample data:", data);
    }
};
```

#### 2. Verify Trigger Functions
```sql
-- Check if triggers exist
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'user_profiles';
```

#### 3. Test Activity Logging
```sql
-- Check recent activity logs
SELECT * FROM user_activity_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

#### 4. Verify Admin Tracking
```sql
-- Check admin information in logs
SELECT admin_comment, action_type, created_at
FROM user_activity_logs 
WHERE admin_comment IS NOT NULL
ORDER BY created_at DESC;
```

---

## 📝 Quick Reference

### SQL Files
- **`complete_database_setup.sql`**: Complete database setup
- **`fix_admin_tracking.sql`**: Fix admin name display issue

### Key Functions
- **`approveUser()`**: Approve user and generate employee ID
- **`rejectUser()`**: Reject user with reason
- **`holdUser()`**: Put user on hold with duration
- **`suspendUser()`**: Permanently suspend user
- **`activateUser()`**: Activate user from hold/suspend
- **`updateUserRole()`**: Change user role

### Status Flow
```
pending → approved → active
pending → rejected → rejection page
active → hold → hold page (with countdown)
hold → active → dashboard
active → suspend → suspended page
```

### Admin Actions
1. **Approve**: Sets approval_status to 'approved', status to 'active'
2. **Reject**: Sets approval_status to 'rejected' with reason
3. **Hold**: Sets status to 'hold' with duration
4. **Suspend**: Sets status to 'suspend'
5. **Activate**: Sets status to 'active'
6. **Role Change**: Updates user role

---

## 🎉 Conclusion

This documentation provides a comprehensive overview of the Insured Book application's architecture, functionality, and implementation details. The system is designed to be scalable, secure, and user-friendly with complete audit trails and administrative controls.

For additional support or questions, refer to the troubleshooting section or check the individual component documentation. 