# Insured Book – Complete Project Knowledge Guide

## 📦 Project Overview
Insured Book is a full-stack platform for user management with a robust admin workflow, role-based access, and audit logging. The frontend is built in React (Vite, TS, TailwindCSS), and Supabase powers the backend (auth, DB, API).

---

## 📁 Application Structure
- **Frontend:** React (TypeScript, Tailwind CSS, Vite)
- **Backend:** Supabase (PostgreSQL + Auth)

**Key directories/files:**
```
/src
  /components    # UI and page logic (AdminPanel, AuthGuard, HoldUser, etc.)
  /contexts      # Context APIs (AuthContext)
  /hooks         # Custom hooks (useProfileCompletion, useAuth, etc.)
  /pages         # Route-specific screens (Dashboard, LoginPage, etc.)
  /lib           # Utilities (supabase.ts)
```

---

## 🛂 Authentication & User Flow
- **Signup:** Email/password or Google OAuth → Email verification → `/profile-completion` for profile details input → `approval_status: pending`
- **Login:** Checks credentials and authenticity, loads profile. Uses `AuthGuard` for all protected routes.
- **Approval:** Users await approval by admin. Admin approves/rejects/puts-hold/suspends via AdminPanel.
- **Statuses:**
  - `active` → Full access
  - `hold` → Temporary block with reactivation timer
  - `suspend` → Permanent lock
  - `pending` approval → wait page
  - `rejected` → locked out


---

## 🗃️ Supabase Database Structure
### Tables
- **user_profiles**
    - id (UUID, PK), user_id (UUID, FK/auth), user_name, email, contact_no, address, city, state, pincode, dob
    - role (admin, manager, employee, supervisor), approval_status (pending/approved/rejected), status (active/hold/suspend), status_reason
    - employee_id, joining_date, hold_days, hold_start/end_date, created_at, updated_at

- **user_activity_logs**
    - id (UUID, PK), user_id, admin_user_id, action_type (see below), previous/new status/role, reason, hold_days, created_at, admin_comment

### Functions (Triggers)
- **update_updated_at_column()** (BEFORE UPDATE on user_profiles): Automates updated_at timestamp
- **generate_employee_id()** (BEFORE INSERT): Auto-generates incremental employee ID
- **check_hold_status()** (BEFORE UPDATE): Auto-reactivate user after hold expiry
- **log_user_activity()**: Logs all status/role/approval changes, recording admin & context info
- **log_profile_changes()**: Triggers audit trail after UPDATE (full admin/user tracking)

### Status & Approval Flow:
```txt
signup → profile-completion → pending approval → approved → active
goes to rejected/hold/suspend via admin
hold auto-reactivates after timer
```
**Admin Actions:**
- Approve: status=active, approval_status=approved
- Reject: approval_status=rejected (requires reason)
- Hold: status=hold + hold_end (restores active when done)
- Suspend: status=suspend (manual restore only)
- Role change: role updates


---

## 🔑 Major Components & Hooks
### Components
- **AdminPanel.tsx**: Main UI + logic for user audits, approval/rejection, hold/suspend, etc. Real-time updates and notification feeds. Can search/filter users.
- **AuthGuard.tsx**: Protects all secure routes. Redirects user based on status/profile. Checks for deleted/disabled users.
- **LoginPage.tsx / SignupPage.tsx**: Handles login/signup with complete error handling, session creation, Google OAuth support.
- **ProfileCompletion.tsx**: Multi-field form. Enforces all user details. Inserts profile with status 'pending'. Redirects if already exists.
- **UserDetails.tsx**: Lets users view & edit profile fields (not role/status/ID).
- **Special Status Pages:**
  - ApprovalPending.tsx
  - RejectionPage.tsx
  - HoldUser.tsx (shows countdown)
  - SuspendedUser.tsx

### Main Hooks
- **useAuth() [AuthContext]**: Exposes user/session, login, signup, Google OAuth, signOut, user existence check (in DB)
- **useProfileCompletion()**: Loads profile, determines if user must complete profile, approval, or is approved/rejected/on-hold/etc. Calculates % complete.
- **useToast()**: For UI notifications

---

## 📈 Application Flow / Route Map
```
/signup → profile-completion → approval-pending → [admin review]
  ↳ if approved: active → dashboard
  ↳ if rejected: rejected → locked out page
  ↳ if hold: hold → countdown, auto-reactivate
  ↳ if suspended: suspended → can only be restored by admin
login: flows through AuthGuard for all checks
/admin: only admin users with approval_status=approved
```

**Route Guarding:** Every secure page is wrapped by `<AuthGuard>`, which will redirect user to login, status, or approval pages vs dashboard based on live profile checks.

---

## 🔗 Admin, Actions, Audit & Real-time
- AdminPanel fetches all users, periodically refreshes, and uses Supabase channel for real-time user DB change events (postgreSQL triggers):
  - On INSERT: highlight and notify for new user needing approval
  - On UPDATE: updates status, logs activities, triggers to DB
  - All actions like approval, rejection, hold, suspend, activate, or delete trigger logs
- **Activity logs**: User activity logs (`user_activity_logs`) display full audit trail per user in AdminPanel

---

## 🧑‍💻 File-by-file Key Functions/Exports
- **/src/components/AdminPanel.tsx**: `AdminPanel`, all functions for approve, reject, hold, suspend, activate, updateUserRole etc.
- **/src/components/AuthGuard.tsx**: `AuthGuard` function, decides all routing and redirect logic
- **/src/contexts/AuthContext.tsx**: `AuthProvider`, `useAuth`, login/signup/Google/signout/checkUserExists logic
- **/src/hooks/useProfileCompletion.ts**: `useProfileCompletion`, status/approval/percent logic
- **/src/pages/LoginPage.tsx / SignupPage.tsx**: Form validation, error reporting, Supabase connection checks
- **/src/components/ProfileCompletion.tsx**: Input/validate/submit all user details, checks for duplication

---

## 🧩 Troubleshooting
- If logs/admin info missing: Run/fix DB triggers
- If hold not auto-activating: DB trigger might not be set
- If users can’t login/see wrong page: check profile status, AuthGuard logic
- RLS (Row Level Security): Ensure admin & proper user access allowed in Supabase policies


---

## 📖 For More Detail
- See `/Md files/INSURED_BOOK_DOCUMENTATION.md` for even deeper table/function/trigger/component breakdowns
- For environment/Supabase config: see `AUTH_SETUP_GUIDE.md`, `.env`, and `src/lib/supabase.ts`

---

> This file summarizes project structure, key components, APIs, flows, hooks, database design, and troubleshooting for Insured Book. Keep this up to date as you add features or refactor code!
