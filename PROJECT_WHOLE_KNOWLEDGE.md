# Project Description

This project is an Insurance Book containing customer details and phone logs. Basically, it acts as a CRM (Customer Relationship Management) system, and also functions similar to an RMS (Record Management System).

---

# Project Overview

Insured Book is a comprehensive insurance policy management system built with React, TypeScript, and Supabase. The application provides a robust platform for managing customer policies, tracking calls, handling approvals, and managing communication through WhatsApp integration.

## Architecture Overview

The application follows a modern React architecture with the following key components:

### Core Components

1. **Authentication Layer**

   - Centralized authentication via `AuthContext.tsx` provider
   - `AuthGuard` component for route protection
   - Multiple authentication flows (email/password, Google OAuth)
   - Supabase Auth integration via `supabase.ts`
   - User session and state management

2. **Routing & Layout**

   - React Router v6 with nested routes
   - Protected route layout with shared navigation
   - Centralized layout management (`Layout.tsx`)
   - Mobile-responsive navigation system
   - Route-based component rendering

3. **User Profile Management**
   - `useProfileCompletion` hook for profile tracking
   - Multi-stage approval workflow
   - Role-based access control with status tracking
   - Profile completion enforcement
   - Account status management (active, suspended, hold)

### Feature Components

1. **Customer Management**

   - Customer registration and tracking
   - Policy expiry management
   - Communication tools (WhatsApp integration)

2. **Call Management**

   - Call tracking and timeline
   - Customer interaction history
   - Follow-up management

3. **Analytics and Reporting**
   - Performance metrics
   - Sales tracking
   - Call statistics

## System Relationships

### Authentication Flow

```
AuthContext → useProfileCompletion → Profile States
    ↓                    ↓              ↓
Pages → Protected Routes → User Access → Features
```

### Data Flow

```
Supabase Client → Real-time Updates → UI Components
    ↓                    ↓              ↓
Database → State Management → User Interface
```

### Component Hierarchy

```
App
├── AuthContext
│   └── Layout
│       ├── Header
│       ├── Navigation
│       └── Pages
└── Profile Management
    ├── Approval Workflow
    ├── Status Management
    └── Access Control
```

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Build Tool**: Vite

## Key Features

1. **User Management**

   - Multi-stage registration
   - Role-based access control
   - Profile completion tracking

2. **Policy Management**

   - Policy lifecycle tracking
   - Expiry alerts
   - Renewal management

3. **Communication**

   - WhatsApp integration
   - Call management
   - Customer interaction tracking

4. **Analytics**

   - Performance metrics
   - Sales tracking
   - Customer insights

5. **Admin Tools**
   - User approval workflow
   - Status management
   - System monitoring

## Common Workflows

### User Registration and Approval

1. User signs up → AuthCallback.tsx
2. Profile completion → ProfileCompletion.tsx
3. Admin approval → AdminPanel.tsx
4. Access granted → Dashboard.tsx

### Customer Management

1. Add customer → CustomerRegistration.tsx
2. Track interactions → CallManagement.tsx
3. Send messages → WhatsAppTemplates.tsx
4. Monitor expiry → ExpiryAlerts.tsx

### Call Handling

1. Record call → CallManagement.tsx
2. Update timeline → CallTimeline.tsx
3. Set follow-up → CallPage.tsx
4. Track performance → StatsCards.tsx

# Project Documentation

## Table of Contents

1. Project Overview

   - Architecture Overview
   - System Relationships
   - Tech Stack
   - Key Features
   - Common Workflows

2. Core System

   - Authentication (AuthContext)
   - State Management
   - Profile Management
   - Database Integration

3. User Interface Components

   - Layout and Navigation
   - Form Components
   - Data Display Components
   - Interactive Elements

4. Pages and Routing

   - Authentication Pages
   - Dashboard and Analytics
   - Customer Management
   - Call Management
   - Settings and Configuration

5. Business Logic

   - Profile Completion Flow
   - Approval Workflows
   - Communication System
   - Analytics and Reporting

6. Developer Guide

   - Project Setup
   - Development Workflow
   - Testing Strategy
   - Deployment Process

7. Troubleshooting Guide
   - Common Issues
   - Error Messages
   - Performance Optimization
   - Security Considerations

# Function and Hook Relationships

## Authentication Flow

### Components and Dependencies

```
AuthContext.tsx
├── useAuth (hook)
│   ├── signIn()
│   ├── signUp()
│   ├── signInWithGoogle()
│   └── signOut()
└── Components Using Auth
    ├── LoginPage.tsx
    ├── SignupPage.tsx
    ├── AuthCallback.tsx
    └── Protected Routes
```

### Profile Management Flow

```
useProfileCompletion.ts
├── AuthContext Integration
│   └── Current User State
├── Profile States
│   ├── Pending
│   ├── Approved
│   ├── Rejected
│   └── Suspended
└── Components Using Profiles
    ├── ProfileCompletion.tsx
    ├── ApprovalPending.tsx
    ├── RejectionPage.tsx
    └── SuspendedUser.tsx
```

## Customer Management Flow

### Components and Dependencies

```
CustomerList.tsx
├── UI Components
│   ├── Card Components
│   │   ├── Avatar
│   │   ├── Badge
│   │   └── Input
│   ├── Dialog Components
│   │   ├── AlertDialog
│   │   └── DropdownMenu
│   └── Button Components
│       └── Button
├── Custom Components
│   ├── CustomerDetails
│   ├── CustomerRegistration
│   └── WhatsAppTemplates
├── Routing
│   └── useNavigate (React Router)
└── Utilities
    ├── Toast Notifications
    └── Icon Components (Lucide)
```

#### Features

1. Customer Grid Display

   - Responsive card-based layout (1/2/3 columns)
   - Customer avatars with initials
   - Status badges and icons
   - Expiry and birthday indicators

2. Search and Filtering

   - Real-time search by name/contact/RC
   - Desktop filter buttons
   - Mobile filter dropdown
   - Status-based filtering (critical, warning, active)

3. Actions

   - View customer details
   - Edit customer information
   - Delete customer (with confirmation)
   - Call management
   - WhatsApp communication
   - Quick copy functionality

4. Mobile Optimization

   - Responsive grid layout
   - Filter dropdown menu
   - Optimized action buttons
   - Touch-friendly cards

5. Status Management
   - Color-coded status indicators
   - Expiry date tracking
   - Birthday notifications
   - Status statistics

The component uses mock data but is designed for integration with a backend database.

### Call Management Flow

```
CallManagement.tsx
├── Timeline Integration
│   └── CallTimeline.tsx
├── State Management
│   └── Call Context
└── Related Components
    ├── CallPage.tsx
    ├── StatsCards.tsx
    └── QuickActions.tsx
```

## Communication System

### WhatsApp Integration

```
WhatsAppTemplates.tsx
├── Template Management
│   ├── Birthday Templates
│   ├── Expiry Templates
│   └── Custom Templates
├── Message Processing
│   └── Dynamic Content
└── Integration Points
    ├── CustomerDetails.tsx
    ├── ExpiryAlerts.tsx
    └── QuickActions.tsx
```

## Hook Dependencies

### useProfileCompletion

Dependencies:

- AuthContext (user authentication)
- supabase.ts (database operations)
- Navigation (routing based on status)

Used by:

- ProfileCompletion.tsx
- Dashboard.tsx
- AuthGuard.tsx
- Layout.tsx

### use-mobile

Dependencies:

- Browser APIs
- Window sizing

Used by:

- Layout.tsx
- MobileNavigation.tsx
- ResponsiveComponents

### use-toast

Dependencies:

- React state management
- DOM manipulation

Used by:

- All components needing notifications
- Error handling
- Success messages

## Common Data Flows

### User Registration

1. SignupPage.tsx

   - Uses: AuthContext (signUp)
   - Next: ProfileCompletion.tsx

2. ProfileCompletion.tsx

   - Uses: useProfileCompletion
   - Next: ApprovalPending.tsx

3. ApprovalPending.tsx
   - Uses: Real-time updates
   - Next: Dashboard.tsx

### Customer Registration

1. CustomerRegistration.tsx

   - Uses: supabase.ts
   - Next: CustomerDetails.tsx

2. CustomerDetails.tsx

   - Uses: Real-time updates
   - Related: CallManagement.tsx

3. ExpiryAlerts.tsx
   - Uses: Automated checks
   - Related: WhatsAppTemplates.tsx

### Call Management

1. CallManagement.tsx

   - Uses: Real-time updates
   - Related: CallTimeline.tsx

2. CallTimeline.tsx

   - Uses: Historical data
   - Related: CustomerDetails.tsx

3. StatsCards.tsx
   - Uses: Aggregated data
   - Related: Dashboard.tsx

# Visual Workflows

## Authentication and Profile Workflow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Sign Up   │ ──► │   Complete   │ ──► │  Await Admin    │
│    Page     │     │   Profile    │     │    Approval     │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                   │                      │
       │                   │                      │
       ▼                   ▼                      ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Auth Call  │     │   Profile    │     │    Real-time    │
│    back     │     │ Validation   │     │    Updates      │
└─────────────┘     └──────────────┘     └─────────────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │    Dashboard    │
                                         │     Access      │
                                         └─────────────────┘
```

## Customer Management Workflow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Customer   │ ──► │  Customer    │ ──► │    Policy       │
│Registration │     │  Details     │     │ Documentation   │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                   │                      │
       │                   │                      │
       ▼                   ▼                      ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Database   │     │    Call      │     │    Expiry       │
│   Update    │     │Management    │     │    Alerts       │
└─────────────┘     └──────────────┘     └─────────────────┘
                           │                      │
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐     ┌─────────────────┐
                    │  WhatsApp    │     │   Renewal       │
                    │  Messages    │     │   Process       │
                    └──────────────┘     └─────────────────┘
```

## Call Management Workflow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Start     │ ──► │  Record      │ ──► │    Update       │
│    Call     │     │  Details     │     │   Timeline      │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                   │                      │
       │                   │                      │
       ▼                   ▼                      ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Customer   │     │   Set        │     │    Schedule     │
│  History    │     │Follow-up     │     │   Next Call     │
└─────────────┘     └──────────────┘     └─────────────────┘
                           │                      │
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐     ┌─────────────────┐
                    │   Update     │     │    Generate     │
                    │   Stats      │     │    Report       │
                    └──────────────┘     └─────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────┐
│                  User Interface                      │
├─────────────┬──────────────┬─────────────┬─────────┤
│  Pages      │  Components  │   Forms     │ Modals  │
└─────────────┴──────────────┴─────────────┴─────────┘
                      │
┌─────────────────────────────────────────────────────┐
│                  Business Logic                      │
├─────────────┬──────────────┬─────────────┬─────────┤
│   Hooks     │  Contexts    │  Services   │ Utils   │
└─────────────┴──────────────┴─────────────┴─────────┘
                      │
┌─────────────────────────────────────────────────────┐
│                  Data Layer                         │
├─────────────┬──────────────┬─────────────┬─────────┤
│  Supabase   │  Real-time   │   Storage   │  Auth   │
└─────────────┴──────────────┴─────────────┴─────────┘
```

## Component Interaction Map

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Layout     │ ◄─► │   Header     │ ◄─► │   Navigation    │
└─────────────┘     └──────────────┘     └─────────────────┘
       ▲                   ▲                      ▲
       │                   │                      │
       │                   │                      │
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Pages     │ ◄─► │  Components  │ ◄─► │     Hooks       │
└─────────────┘     └──────────────┘     └─────────────────┘
       ▲                   ▲                      ▲
       │                   │                      │
       │                   │                      │
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Context    │ ◄─► │   Services   │ ◄─► │    Database     │
└─────────────┘     └──────────────┘     └─────────────────┘
```

# Troubleshooting Guide

## Authentication Issues

### 1. Sign In Failures

```
Problem: Unable to sign in with correct credentials
Solutions:
- Check if email is verified
- Verify password requirements are met
- Clear browser cache and try again
- Check network connectivity
```

### 2. OAuth Issues

```
Problem: Google sign-in not working
Solutions:
- Clear browser cookies
- Ensure pop-ups are allowed
- Check OAuth configuration in Supabase
- Verify redirect URIs
```

### 3. Session Management

```
Problem: Frequent session timeouts
Solutions:
- Check session duration settings
- Verify token refresh logic
- Clear local storage
- Update authentication context
```

## Profile Management

### 1. Profile Completion Stuck

```
Problem: Profile completion not proceeding
Solutions:
- Verify all required fields
- Check database connectivity
- Clear form validation errors
- Check console for errors
```

### 2. Approval Status Issues

```
Problem: Status not updating in real-time
Solutions:
- Check real-time subscription
- Verify database triggers
- Refresh profile data manually
- Check webhook configuration
```

## Customer Management

### 1. Registration Issues

```
Problem: Unable to register new customers
Solutions:
- Validate form data
- Check database constraints
- Verify user permissions
- Check network connectivity
```

### 2. Data Synchronization

```
Problem: Customer data not syncing
Solutions:
- Check real-time connection
- Verify database state
- Refresh data manually
- Check error logs
```

## Call Management

### 1. Call Recording Issues

```
Problem: Calls not being recorded
Solutions:
- Check form validation
- Verify database connection
- Check user permissions
- Validate required fields
```

### 2. Timeline Updates

```
Problem: Timeline not updating
Solutions:
- Check real-time subscription
- Verify data consistency
- Refresh timeline manually
- Check console errors
```

## WhatsApp Integration

### 1. Message Sending Issues

```
Problem: Unable to send WhatsApp messages
Solutions:
- Check phone number format
- Verify WhatsApp Web connection
- Check browser permissions
- Validate message content
```

### 2. Template Issues

```
Problem: Templates not working correctly
Solutions:
- Check template format
- Verify placeholder data
- Check character limits
- Validate dynamic content
```

## Performance Issues

### 1. Slow Loading

```
Problem: Pages loading slowly
Solutions:
- Check network speed
- Optimize database queries
- Reduce data payload
- Implement caching
```

### 2. Real-time Delays

```
Problem: Real-time updates delayed
Solutions:
- Check websocket connection
- Verify subscription status
- Optimize payload size
- Check server performance
```

## Common Error Messages

### 1. Database Errors

```
Error: "Could not connect to database"
Solutions:
- Check database URL
- Verify credentials
- Check network connectivity
- Review database logs
```

### 2. Authentication Errors

```
Error: "Invalid credentials"
Solutions:
- Verify email/password
- Check account status
- Clear cached credentials
- Reset password if needed
```

### 3. Permission Errors

```
Error: "Insufficient permissions"
Solutions:
- Check user role
- Verify RLS policies
- Review access controls
- Update user permissions
```

## Security Issues

### 1. Access Control

```
Problem: Unauthorized access attempts
Solutions:
- Review RLS policies
- Check role assignments
- Audit access logs
- Update security rules
```

### 2. Data Protection

```
Problem: Sensitive data exposure
Solutions:
- Review data encryption
- Check access patterns
- Update security policies
- Implement data masking
```

## Environment Setup

### 1. Development Setup

```
Problem: Environment not working
Solutions:
- Check .env variables
- Verify dependencies
- Update node modules
- Clear build cache
```

### 2. Build Issues

```
Problem: Build failures
Solutions:
- Check syntax errors
- Update dependencies
- Clear build cache
- Review build logs
```

## Maintenance Tasks

### Regular Checks

1. Monitor error logs
2. Review performance metrics
3. Check security alerts
4. Update dependencies
5. Backup database
6. Clean up old data
7. Review access patterns
8. Update documentation

### Monthly Tasks

1. Security audit
2. Performance review
3. Database optimization
4. Code cleanup
5. Update templates
6. Review analytics
7. User feedback review
8. System updates

## Best Practices

### Code Management

1. Follow consistent naming conventions
2. Write clear comments and documentation
3. Use proper error handling
4. Implement logging
5. Regular code reviews
6. Version control best practices
7. Clean code principles
8. Testing protocols

### Data Management

1. Regular backups
2. Data validation
3. Error logging
4. Performance monitoring
5. Security checks
6. Access control
7. Data cleanup
8. Audit trails

# Components ----------------------------------------------------------

## AdminPanel.tsx – Functions & Workflow

### Core Functions & Logic

Below is a structured explanation of all major functions and logic in the `AdminPanel.tsx` React component, including how they interact within the app flow:

### 1. Data Fetching & Initialization

- **fetchUsers**: Loads all user profiles from the Supabase database and refreshes the list. Also sets the last refresh time and handles error states.
- **fetchCurrentAdmin**: Loads the currently logged-in admin's details/profile from the database.
- **testDatabaseConnection**: Runs a simple query for debugging to ensure the database is connected and schema is accessible.
- **useEffect (init, real-time, cleanup)**: On mount, calls fetchUsers and fetchCurrentAdmin, subscribes to real-time changes (insert/update on `user_profiles`), and cleans up subscriptions on unmount. Also, periodically refetches users every 30 seconds to keep data fresh.

### 2. User Approval & Status Management

- **openApprovalModal**: Opens the modal to approve a user, pre-selects their data.
- **approveUser**: Finds a user by given ID and opens approval modal.
- **handleApprove**: This is the main function for approving new users:
  - Assigns a role and generates a unique employee ID if the role is "employee".
  - Updates role, approval status, status (`active`), employee ID, and joining date in the database table.
  - Verifies the update, logs the activity (to `user_activity_logs`), sends a notification, and refreshes the list.
  - Handles modal and local state resets on completion.
- **rejectUser**: Updates user record to mark as rejected (sets `approval_status` & `status_reason`). Closes modals, resets states, and refreshes the list. Activity log handled by trigger.
- **holdUser**: Puts a user on hold for a set or custom duration by updating `status`, `hold_days`, and related fields. Handles UI state/reset on completion. Activity log handled by trigger.
- **suspendUser**: Marks user as suspended by updating their status. Clears hold fields.
- **activateUser**: Re-activates a user (status → `active`), clearing any hold fields.
- **updateUserRole**: Updates the user's role. Activity log handled via database trigger.
- **deleteUser**: Deletes a user profile via a Supabase function (removing profile, login, logs) and logs the deletion. Updates UI and shows notification.

### 3. UI Functions (modals, forms, helpers)

- **openDeleteModal**: Prepares and opens deletion confirmation modal for a user.
- **openRoleModal**: Opens the modal to edit a user's role.
- **showReasonModal, setActionType**: Used to trigger reason modals for reject/hold/suspend actions.
- **handleConfirmAction**: Executes reject/hold/suspend logic based on action selected in modal.
- **handleViewLogs & fetchUserLogs**: Opens and populates the modal showing all activity logs for a user.
- **Notification and sound helpers**: Play sound on notification, manage notifications for admin actions (including clear/clear all).
- **UI helpers**: Functions like getStatusIcon, getRoleLabel, getStatusColor etc. provide consistent badge/color/icon behavior across all user cards.

### 4. Search, Filter, and Analytics

- **State and controls for searchTerm, statusFilter, roleFilter**: Control search and filter interfaces for the user table.
- **Dashboard statistics (`stats`)**: Calculate total users, by approval status, by role, currently active/hold/suspended etc.
- **UI cards/tabs**: Driven by these stats and states; enables admin to navigate between users, analytics, activity logs, recent notifications etc.

### Flow/Sequence (High Level):

1. On mount: users & admin info fetched, real-time sync established, UI loading state until ready.
2. Admin sees the dashboard, manages users through modals (approve, hold, suspend, reject, delete, etc.).
3. UI provides feedback immediately (modals, badges, notifications, sound, activity logs).
4. All actions have DB writes and verification. User list is kept current in real-time and via refreshes.
5. Analytics and logs available via tabs for insight and audit.

For further details, please refer to inline code comments in `AdminPanel.tsx`.

---

## ApprovalPending.tsx – Functions & Workflow

The `ApprovalPending.tsx` component manages the workflow when a user is waiting for admin approval, as well as profile state transitions (approved, rejected, on hold, etc.). This ensures the user always sees relevant feedback about their account status. Below is a breakdown of functions and their working:

### 1. Data Fetching and State Updates

- **fetchUserProfile**: Loads the user's profile from the database using their authenticated user ID. If the profile is present and status changes (approved/hold/suspended), redirects user to the applicable route (`/`, `/hold`, `/suspended`). Handles error and sets the state accordingly.

### 2. Authentication and Navigation Flow

- **useEffect (main logic on mount/user change)**: Waits for authentication to finish loading, then:
  - Redirects to login if there is no user.
  - Fetches user profile if user exists.
  - Subscribes to real-time updates on the user's profile (so any admin approval or change is reflected in real-time without reload). Cleans up the subscription on unmount.

### 3. Logout and Navigation Helpers

- **handleBackToLogin**: Signs the current user out (via the context) and navigates to the login screen. Also handles fallback navigation on error.

### 4. Rendering/UI Helper Functions

- **getApprovalIcon, getApprovalText, getApprovalDescription, getApprovalColor**: These helpers return the appropriate icon, text, message, and color classes based on the current approval status (`pending`, `approved`, `rejected`). Used to keep the UI reactive and consistent.
- **getRoleColor, getRoleLabel**: Helpers for badge color and label for a user's role (admin, manager, supervisor, employee, etc.).

### 5. Conditional Rendering (UX Feedback for Various States)

- Displays different screens based on user state:
  - Loading spinner if authentication or profile is loading.
  - Error or profile completion prompt if no user/profile is found.
  - Shows pending-approval, approved, rejected (with guidance), or hold/suspend user messages based on latest profile state.
  - Shows profile and contact info in a user-friendly format.
  - Action buttons for dashboard navigation, profile completion, manual status check, or contact support, depending on the status.
- **Manual Profile Check:** Button to manually re-query status from the DB (for user debugging/assurance).

### 6. Real-Time Profile Sync

- Uses Supabase's real-time features so any admin change is auto-reflected (no refresh needed). E.g., if user is approved by admin, the screen immediately updates and redirects to dashboard.

### Flow/Sequence (High Level):

1. On component mount, waits for auth, fetches user profile, and sets up a real-time listener for profile updates.
2. If status changes due to admin actions, the user is automatically redirected to the correct page (dashboard, hold, suspended, etc.).
3. UI presents the correct instructions and feedback at all times based on profile state, with appropriate colors/icons for clarity.
4. User can log out or manually check their status if needed; feedback is immediate and accurate.

Refer to the code in `ApprovalPending.tsx` for deeper details and further inline comments.

---

## AuthGuard.tsx – Functions & Workflow

The `AuthGuard.tsx` component is a React higher-order component for protecting routes and enforcing user authentication, account status, and profile completion before users access protected parts of the app. Key logics and functions are detailed below:

### 1. User Existence Check (Deleted Users)

- **useEffect (User Existence Validation)**: When the component loads, and periodically every 30 seconds for logged-in users, checks if the current user (auth) still exists in the app database (not deleted by admin). If the user is found deleted, logs them out and redirects to login with a message.
- **setUserExistenceChecked State**: Ensures all redirect and logic runs only after user existence has been checked at least once after login/auth load.

### 2. Authentication, Profile, and Status Validation

- **useEffect (Main Routing & Status Logic)**: Central logic runs after loading, performing:
  - Wait for both authentication and profile info to load.
  - Redirects to `/login` for unauthenticated users, except on public routes.
  - If authenticated but user is not present in the app's user_profiles, waits for DB to load.
  - If the user exists and is an admin (with approved status), enforces redirect to `/admin` and blocks access elsewhere.
  - If user is rejected, pending, on hold, or suspended, redirects to `/rejected`, `/approval-pending`, `/hold`, or `/suspended` accordingly (always enforcing the correct "page for state").
  - If user is approved and active (non-admin), allows all standard pages except `/admin` (redirects back to dashboard if trying to access admin panel).
  - If user needs to complete their profile, redirects forcibly to `/profile-completion` until that's done.
  - Includes anti-infinite-redirect logic to ensure the user is never stuck in a loop due to repeated redirects; tracks last redirect path.

### 3. Periodic Health Check

- **Periodic Interval**: For logged-in users, a 30-second interval is established to re-check (in background) if the user still exists (i.e. isn't deleted by the admin during a session), ensuring the session is secure and revoked if needed.

### 4. Loading and Children Rendering

- Renders a loading spinner whenever authentication/profile check is incomplete or just initialized.
- Only renders children (protected content) once all checks are passed.

### Flow/Sequence (High Level):

1. On each render or user/profile state change, all authentication, approval, profile, and existence checks are run in priority order.
2. User is always redirected to the correct page for their status:
   - Deleted user → login (with message)
   - Needs approval → approval pending
   - Rejected → rejected page
   - On hold/suspended → relevant page
   - Admin → admin panel only
   - Profile incomplete → profile completion
   - Otherwise (approved/active) → dashboard or allowed user pages.
3. Keeps session secure by auto-logout and forced redirects for deleted/invalid users.

Refer to code comments and hooks in `AuthGuard.tsx` for implementation-level detail.

---

## CallManagement.tsx – Functions & Workflow

The `CallManagement.tsx` component handles telecalling logic, call sessions, daily call dashboards, as well as call history and scheduling within the CRM. Here is a breakdown of its major functions and workflow:

### 1. State & Data Management

- **customers**: Local/mock customer list; in real deployments, would come from the database.
- **callHistory**: List of call records (activity about each customer call, disposition, notes, schedule, etc.).
- **State variables**: Track current call (customer), active/inactive call session, show detail/dialog states, call durations, UI states, and selected outcomes (dispositions).

### 2. Call Session & Effect Hooks

- **useEffect (pending/active call recovery)**: On component mount, restores pending or in-progress calls from localStorage. This allows call sessions to resume after a page reload and ensures no call is "lost" if the page is refreshed or navigated away.
- **useEffect (auto-call via URL param)**: If component is opened with a `customerId` param in the URL (i.e. user selected "call" from the customer list elsewhere), pre-populates and auto-triggers call logic for smoother workflow.
- **useEffect (timer)**: When a call is active and status is "connected", increments call timer every second to display live call duration. Cleans up interval on end.

### 3. Main Call Workflow Functions

- **initiateCall(customer)**: Prepares a customer for the call, loads previous call history, and opens confirmation dialog before the call actually starts.
- **startCall**: Begins the connected call session and navigates to the calling UI, updating the route and state as required.
- **holdCall**: Toggles current call between 'connected' and 'hold', updating UI and optionally displaying corresponding toast notifications for feedback.
- **endCall**: Ends the call, clears active call state, removes local storage flags, and opens the call outcome (disposition) dialog for further action.
- **saveCallRecord**: On completion of the call dialog, saves the call record including disposition (call outcome), notes, duration, and whether further follow-up is required. Resets the UI for the next session.

### 4. Supporting Logic and Helpers

- **loadCustomerHistory**: Retrieves all previous call records for the currently selected customer and sets up their history (for use in dialogs, dashboards, timeline, etc).
- **getDispositionColor**: Utility to get color class for UI badges based on call disposition (interested, callback, converted, etc.).
- **formatDuration**: Converts integer seconds to MM:SS format for UI.
- **getInitials**: Returns capitalized initials from a user's name; used for Avatars.
- **getCallStats**: Calculates basic call stats (total, connected, scheduled, converted) for dashboard cards.

### 5. Dashboard & UI Logic

- Uses dashboard cards to show call stats: total calls, connected, scheduled, and converted.
- **Tabs (`Tabs`):** Switches between Dashboard, Calling, Scheduled, Overdues, and History views, each with its view-specific list and UI.
- **Scheduled, Overdue, Upcoming Calls:** Filters `callHistory` by dates/status for section-wise display, with call-to-action for quick engagement.
- **Dialogs:** Uses modals for call preparation (with timeline/history), active call UI, and post-call disposition submission.
- **CallTimeline:** Renders visual timeline/detail on each call as part of activity view and dialogs.

### 6. Event Flows

1. User selects or is routed to a customer for calling.
2. Call preparation UI appears; on "connect call", call session starts and the live session UI slides in.
3. During call: call duration tracked, previous activity history shown.
4. Call can be put on hold/resumed.
5. On call end: disposition dialog prompts for outcome, notes, and (optionally) schedules a follow-up.
6. Completed calls update the dashboard, history, and stats in real time.
7. User can view, resume, or start calls, and audit all activities from the dashboard and tabbed sub-views.

Refer to `CallManagement.tsx` for inline UI and logic comments or deeper technical implementation details.

---

## CallTimeline.tsx – Functions & Workflow

The `CallTimeline.tsx` component provides a visual timeline of a customer's call activity/history, showing each call record as a timeline event with details, summary, and status badges. This is highly useful for tracking engagement and outcomes for any customer.

### 1. Props

- **customerId, customerName**: The ID and name of the customer whose timeline is being visualized. (History is mocked in this component, but in real usage would come from an API/database.)

### 2. Internal Logic

- **callHistory**: An array of mock call records, each containing call type (incoming/outgoing), disposition (call result), notes, duration, timestamp, and next call date.

### 3. Helper Functions

- **getDispositionColor**: Returns a color class for badges based on the disposition. Keeps UI consistent and meaningful (e.g., green for "interested", red for "not interested").
- **getDispositionLabel**: Returns a user-friendly label for a disposition value.
- **formatDuration**: Formats a call duration (in seconds) as MM:SS.

### 4. Timeline & Display

- Each call record is displayed as a timeline event featuring:
  - Colored dot based on call direction (outgoing/incoming)
  - Call type and disposition badges
  - Notes if available
  - Next call date if scheduled
  - Duration (or 'No answer')
  - Timestamp in human-readable format
  - Vertical connectors for timeline continuity
- If there are no calls, a placeholder is shown.

### 5. Summary Dashboard

- At the bottom, key summary stats are shown:
  - Total calls
  - Connected calls (those with duration > 0)
  - Total call time (in minutes)

### Flow/Use:

- Used as a child component in call management UIs to provide agents/admins instant visibility into a customer’s complete call engagement and follow-up status.
- All logic is encapsulated; can be extended to receive dynamic real data.

See `CallTimeline.tsx` for specific styles, logic, and mock data structure.

---

## CustomerDetails.tsx – Functions & Workflow

The `CustomerDetails.tsx` component provides a comprehensive modal dialog for viewing and managing individual customer information within the CRM system. It displays all customer data in an organized, interactive format with various utility functions for data manipulation and navigation. Below is a detailed breakdown of all functions and their workflow:

### 1. Interface Definitions

#### **Customer Interface**

- **Purpose**: Defines the type structure for customer data
- **Properties**:
  - Basic Info: `id`, `name`, `contact`, `email`
  - Vehicle Info: `vehicleType`, `brand`, `model`, `rcNumber`
  - Policy Info: `expiryDate`, `daysToExpiry`
  - Personal Info: `birthday`, `status`
  - Optional Info: `aadharNo`, `panNo`
  - Nominee Info: `nomineeName`, `nomineeDOB`, `nomineeRelation`
  - Company Info: `previousCompany`
  - Documents Object: Optional document URLs/references
- **Usage**: Ensures type safety and consistent data structure throughout the component

#### **CustomerDetailsProps Interface**

- **Purpose**: Defines the component's props structure
- **Properties**:
  - `customer`: Customer object or null
  - `isOpen`: Boolean for dialog visibility
  - `onClose`: Function to close the dialog
- **Working**: Controls component initialization and dialog behavior

### 2. Core Utility Functions

#### **getInitials(name: string)**

- **Purpose**: Generates user initials for avatar display
- **Working**:
  - Takes a name string as input
  - Splits by spaces and extracts first characters
  - Converts to uppercase
  - Returns "??" if no name provided
- **Usage**: Avatar component fallback display

#### **copyToClipboard(text: string, label: string)**

- **Purpose**: Copies data to clipboard with feedback
- **Working**:
  - Uses navigator.clipboard API
  - Shows toast notification on success
- **Usage**: Copy button functionality throughout

#### **getStatusColor(status: string)**

- **Purpose**: Maps status to style classes
- **Working**:
  - Maps status ('critical', 'warning', 'active') to Tailwind classes
  - Returns text, background, and border color classes
- **Usage**: Status badges and indicators

### 3. PDF Generation Function

#### **generatePDF()**

- **Purpose**: Creates PDF of customer details
- **Working**:
  - Dynamic import of jsPDF and html2canvas
  - Captures dialog content as high-res canvas
  - Creates multi-page PDF if needed
  - Handles scaling and pagination
  - Shows success/error toast
- **Flow**: Import → Capture → Convert → Save → Notify

### 4. UI Components

#### **FieldWithCopy Component**

- **Purpose**: Reusable field display with copy
- **Props**: icon, label, value
- **Working**:
  - Shows field with icon and label
  - Includes copy button
  - Consistent styling across component
- **Usage**: Contact, vehicle, document info display

### 5. Layout Structure

#### **Action Bar**

- **Purpose**: Quick access to main actions
- **Features**:
  - Edit customer button
  - Generate PDF button
  - Call management button
  - Sticky positioning
  - Responsive design (icon-only on mobile)
- **Integration**: Navigation to edit/call workflows

#### **Main Content Sections**

1. **Customer Header**:

   - Large avatar with initials
   - Customer name
   - Status badge

2. **Contact Information**:

   - Phone with call/copy actions
   - Email with copy
   - Birthday with copy

3. **Vehicle Information**:

   - RC number
   - Vehicle type
   - Brand & model
   - Expiry date

4. **Document Information** (conditional):

   - Aadhar number
   - PAN number
   - Previous company

5. **Nominee Information** (conditional):

   - Nominee name
   - DOB
   - Relationship

6. **Documents Grid** (conditional):

   - RC front/back
   - Aadhar front/back
   - PAN card
   - Previous policy

7. **Policy Status**:

   - Days remaining
   - Status indicator

8. **Call Management**:
   - Call timeline integration
   - Call history display

### 6. Visual Design Features

#### **Glass Morphism Effect**

- **Purpose**: Modern, depth-based design
- **Implementation**:
  - Background blur
  - Gradient backgrounds
  - Semi-transparent surfaces
  - Subtle shadows
- **Usage**: Dialog and section backgrounds

#### **Responsive Behaviors**

- **Purpose**: Optimal display across devices
- **Features**:
  - Full-screen dialog on mobile
  - Column layout adaptation
  - Responsive grids (1/2/3 columns)
  - Dynamic padding and spacing
  - Text label visibility control

#### **Interactive Elements**

- **Purpose**: Clear user feedback
- **Features**:
  - Button hover states
  - Shadow transitions
  - Toast notifications
  - Copy feedback
  - Loading states

### 7. Integration Points

#### **Navigation Integration**

- **Purpose**: Seamless workflow transitions
- **Features**:
  - Edit mode navigation
  - Call management routing
  - Parameter passing
  - State preservation

#### **CallTimeline Integration**

- **Purpose**: Call history display
- **Features**:
  - Timeline component embedding
  - Real-time updates
  - Call record display
  - Quick call initiation

### Flow/Sequence (High Level):

1. **Dialog Open**:

   - Validate customer data
   - Initialize UI state
   - Render content sections

2. **User Interactions**:

   - View customer information
   - Copy data with feedback
   - Generate PDF
   - Navigate to edit/call
   - View documents
   - Check call history

3. **Dialog Close**:
   - Clean up state
   - Execute onClose callback
   - Handle navigation if needed

### Key Features:

- **Comprehensive Display**: All customer information in organized sections
- **Modern UI**: Glass morphism, gradients, and smooth animations
- **Interactive Elements**: Copy, PDF, navigation actions
- **Responsive Design**: Mobile and desktop optimized
- **Conditional Rendering**: Smart section display
- **Document Management**: Visual document grid
- **Call Integration**: Timeline and history
- **Visual Feedback**: Status indicators and notifications

### Technical Implementation:

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **Components**: Dialog, Button, Badge, Avatar from shadcn/ui
- **Icons**: Lucide React icons
- **Navigation**: React Router v6
- **PDF Generation**: jsPDF + html2canvas
- **Notifications**: Custom toast system

Refer to `CustomerDetails.tsx` for specific implementation details, styling, and component structure.

---

## CustomerList.tsx – Functions & Workflow

The `CustomerList.tsx` component serves as the main interface for displaying, managing, and interacting with customer data in the CRM system. It provides a comprehensive grid-based view of customers with advanced filtering, search capabilities, and integrated action management. Below is a detailed breakdown of all functions and their workflow:

### 1. State Management Functions

#### **useState Hooks for Component State**

- **Purpose**: Manages all component-level state for UI interactions and data handling
- **State Variables**:
  - `searchTerm`: Controls search input value for filtering customers
  - `filterBy`: Manages active filter selection (all, expiring, critical, birthday)
  - `selectedCustomer`: Stores currently selected customer for modal operations
  - `showDetails`: Controls customer details modal visibility
  - `editingCustomer`: Stores customer being edited
  - `showEdit`: Controls edit modal visibility
  - `showWhatsApp`: Controls WhatsApp templates modal visibility
  - `whatsAppType`: Manages WhatsApp message type selection
  - `deleteCustomer`: Stores customer marked for deletion
  - `showDeleteDialog`: Controls delete confirmation dialog
  - `customers`: Main customer data array (mock data in current implementation)
  - `showMobileFilter`: Controls mobile filter dropdown visibility
  - `customFilter`: Manages custom filter state

### 2. Event Handler Functions

#### **handleViewDetails(customer: any)**

- **Purpose**: Opens customer details modal for viewing complete customer information
- **Working**:
  - Sets the selected customer in state
  - Opens the customer details modal
- **Flow**: Customer selection → State update → Modal display

#### **handleEditCustomer(customer: any)**

- **Purpose**: Initiates customer editing workflow
- **Working**:
  - Sets the customer to be edited in state
  - Opens the edit modal with pre-populated data
- **Flow**: Edit action → Customer selection → Edit modal display

#### **handleDeleteCustomer(customer: any)**

- **Purpose**: Initiates customer deletion workflow with confirmation
- **Working**:
  - Sets the customer to be deleted in state
  - Opens delete confirmation dialog
- **Flow**: Delete action → Customer selection → Confirmation dialog

#### **confirmDelete()**

- **Purpose**: Executes customer deletion after confirmation
- **Working**:
  - Removes customer from the customers array using filter method
  - Shows success toast notification
  - Closes delete dialog and resets state
- **Flow**: Confirmation → Array update → UI refresh → Notification

#### **handleWhatsApp(customer: any, type: string)**

- **Purpose**: Opens WhatsApp templates modal for customer communication
- **Working**:
  - Sets selected customer and message type
  - Opens WhatsApp templates modal
- **Parameters**:
  - `customer`: Customer object
  - `type`: Message type ('general', 'birthday', 'expiry', 'sales', 'festival')
- **Flow**: WhatsApp action → Customer/type selection → Templates modal

#### **handleCall(contact: string, customer: any)**

- **Purpose**: Initiates call management workflow for customer
- **Working**:
  - Navigates to call management page
  - Passes customer ID as URL parameter for pre-population
- **Flow**: Call action → Navigation → Call management interface

#### **updateCustomer(updatedCustomer: any)**

- **Purpose**: Updates customer data in the local state after editing
- **Working**:
  - Maps through customers array and updates matching customer
  - Shows success toast notification
- **Flow**: Edit completion → State update → UI refresh → Notification

### 3. Utility Functions

#### **getStatusColor(status: string)**

- **Purpose**: Returns appropriate CSS classes for status-based styling
- **Working**:
  - Takes status string as input ('critical', 'warning', 'active', default)
  - Returns corresponding Tailwind CSS classes for text, background, and border colors
- **Usage**: Applied to status badges throughout the component

#### **getInitials(name: string)**

- **Purpose**: Generates customer initials for avatar display
- **Working**:
  - Splits name by spaces and extracts first character of each word
  - Converts to uppercase
- **Usage**: Used in Avatar components for customer cards

#### **isDaysToBirthday(birthday: string)**

- **Purpose**: Determines if customer's birthday is within 7 days
- **Working**:
  - Calculates next birthday date from current date
  - Compares with today's date to determine if within 7 days
  - Handles year transitions for past birthdays
- **Returns**: Boolean indicating if birthday is approaching
- **Usage**: Shows birthday gift icon on customer cards

### 4. Data Filtering and Search Functions

#### **filteredCustomers (Computed Property)**

- **Purpose**: Filters and searches customer data based on user input
- **Working**:
  - **Search Filtering**: Matches against name, contact, or RC number (case-insensitive)
  - **Status Filtering**: Filters by various criteria:
    - `expiring`: Customers with ≤30 days to expiry
    - `critical`: Customers with critical status
    - `birthday`: Customers with birthdays within 7 days
    - `all`: Shows all customers
  - **Combined Logic**: Applies both search and filter conditions
- **Flow**: User input → Filter application → Display update

### 5. UI Component Functions

#### **Mobile Filter Management**

- **Purpose**: Handles mobile-specific filter dropdown functionality
- **Working**:
  - `setShowMobileFilter()`: Toggles mobile filter dropdown visibility
  - Mobile filter options: All Customers, Expiring Soon, Critical, Birthday, Custom
  - Custom filter chips for advanced filtering options
- **Flow**: Filter button click → Dropdown display → Option selection → Filter application

#### **Responsive Design Functions**

- **Purpose**: Adapts UI layout and functionality for different screen sizes
- **Working**:
  - Desktop: Shows filter buttons in horizontal layout
  - Mobile: Shows filter dropdown with compact options
  - Grid layout: 1 column on mobile, 2 on tablet, 3 on desktop
- **Implementation**: Uses Tailwind responsive classes (md:, lg: prefixes)

### 6. Modal and Dialog Management

#### **Customer Details Modal**

- **Purpose**: Displays comprehensive customer information
- **Working**:
  - Controlled by `showDetails` state
  - Uses `CustomerDetails` component
  - Passes selected customer data as props
- **Flow**: View action → Modal open → Customer details display

#### **WhatsApp Templates Modal**

- **Purpose**: Provides WhatsApp message templates for customer communication
- **Working**:
  - Controlled by `showWhatsApp` state
  - Uses `WhatsAppTemplates` component
  - Passes customer and message type as props
- **Flow**: WhatsApp action → Templates modal → Message selection

#### **Edit Customer Modal**

- **Purpose**: Provides inline editing capability for customer data
- **Working**:
  - Custom modal implementation (not using Dialog component)
  - Uses `CustomerRegistration` component in edit mode
  - Handles customer data updates and state management
- **Flow**: Edit action → Modal open → Form pre-population → Update → State refresh

#### **Delete Confirmation Dialog**

- **Purpose**: Provides confirmation before customer deletion
- **Working**:
  - Uses `AlertDialog` component
  - Shows customer name in confirmation message
  - Handles confirmation and cancellation actions
- **Flow**: Delete action → Confirmation dialog → User choice → Action execution

### 7. Data Display Functions

#### **Customer Card Rendering**

- **Purpose**: Renders individual customer cards with comprehensive information
- **Working**:
  - **Header Section**: Avatar, name, contact, birthday gift icon, dropdown menu
  - **Vehicle Information**: Brand, model, vehicle type, RC number
  - **Expiry Status**: Expiry date with color-coded status badge
  - **Birthday Information**: Birthday date with gift icon
  - **Action Buttons**: Call and WhatsApp buttons
- **Interactive Elements**:
  - Click to view details
  - Dropdown menu for additional actions
  - Individual action buttons for call/WhatsApp

#### **Summary Statistics**

- **Purpose**: Displays customer count and status breakdown
- **Working**:
  - Shows filtered vs total customer count
  - Displays count by status (Critical, Warning, Active)
  - Uses color-coded indicators for status visualization
- **Flow**: Data filtering → Statistics calculation → Display update

### 8. Integration Functions

#### **Navigation Integration**

- **Purpose**: Integrates with React Router for page navigation
- **Working**:
  - Uses `useNavigate` hook for programmatic navigation
  - Passes customer ID as URL parameters
  - Enables deep linking to specific customer actions
- **Routes**:
  - `/call-management?customerId=${id}`: Call management page
  - `/registration?edit=true&customerId=${id}`: Edit customer page

#### **Component Integration**

- **Purpose**: Integrates with other CRM components
- **Components Used**:
  - `CustomerDetails`: For detailed customer view
  - `WhatsAppTemplates`: For customer communication
  - `CustomerRegistration`: For customer editing
- **Data Flow**: Parent component → Child components → State updates → UI refresh

### Flow/Sequence (High Level):

1. **Component Mount**: Initializes with mock customer data and default states
2. **User Interaction**:
   - Search/filter customers using various criteria
   - View customer details in modal
   - Edit customer information inline
   - Delete customers with confirmation
   - Initiate calls or WhatsApp communication
3. **Data Management**:
   - Local state updates for all customer operations
   - Real-time filtering and search results
   - Modal state management for various dialogs
4. **UI Updates**:
   - Responsive layout adaptation
   - Dynamic content rendering based on filters
   - Interactive feedback through toasts and modals
5. **Navigation**: Seamless integration with other CRM pages and workflows

### Key Features:

- **Advanced Filtering**: Multiple filter options with real-time search
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Interactive Cards**: Rich customer information display with action buttons
- **Modal Management**: Multiple modal types for different operations
- **State Management**: Comprehensive local state handling
- **Integration**: Seamless connection with other CRM components
- **User Experience**: Intuitive interface with immediate feedback
- **Data Visualization**: Status indicators and summary statistics

Refer to `CustomerList.tsx` for specific implementation details, styling, and component structure.

---

## CustomerRegistration.tsx – Functions & Workflow

The `CustomerRegistration.tsx` component provides a comprehensive form interface for registering new customers or editing existing customer information in the CRM system. It offers two registration modes (Quick and Full) with different levels of detail collection, responsive design, and integrated validation. Below is a detailed breakdown of all functions and their workflow:

### 1. Component Props and State Management

#### **Component Props Interface**

- **Purpose**: Defines the component's external interface and data flow
- **Props**:
  - `onComplete`: Callback function executed when registration is completed
  - `customer`: Optional existing customer data for edit mode
  - `isEdit`: Boolean flag indicating if component is in edit mode
- **Working**: Enables the component to be used for both new registrations and editing existing customers

#### **State Management Functions**

- **Purpose**: Manages all form data and UI state within the component
- **State Variables**:
  - `registrationType`: Controls whether "quick" or "full" registration is active
  - `formData`: Comprehensive object containing all form field values
- **Working**:
  - Initializes with existing customer data if in edit mode
  - Provides default empty values for new registrations
  - Maintains form state throughout user interactions

### 2. Form Data Management Functions

#### **handleInputChange(field: string, value: string)**

- **Purpose**: Updates form data when user inputs values in form fields
- **Working**:
  - Takes field name and new value as parameters
  - Uses functional state update to merge new value with existing form data
  - Preserves all other form fields while updating the specific field
- **Flow**: User input → Field identification → State update → UI refresh
- **Usage**: Called by all input fields, selects, and date pickers

#### **handleSubmit(e: React.FormEvent)**

- **Purpose**: Processes form submission with validation and data transformation
- **Working**:
  - Prevents default form submission behavior
  - Performs basic validation on required fields (RC Number, Name, Contact)
  - Transforms form data to match expected customer object structure
  - Shows success toast notification
  - Calls onComplete callback with processed data
- **Validation Logic**:
  - Checks for required fields: RC Number, Name, Contact
  - Shows error toast if validation fails
  - Proceeds with submission if validation passes
- **Data Transformation**:
  - Maps form field names to customer object properties
  - Handles field name differences (dob → birthday, vehicleCategory → vehicleType)
- **Flow**: Form submission → Validation → Data transformation → Success notification → Callback execution

### 3. Registration Type Management

#### **Registration Type Selection**

- **Purpose**: Allows users to choose between Quick and Full registration modes
- **Working**:
  - **Quick Registration**: Essential fields only (5-minute process)
    - Personal information (name, contact, DOB, RC number)
    - Vehicle information (category, brand, model)
    - Policy information (expiry date)
  - **Full Registration**: Complete profile (15-minute process)
    - All Quick registration fields
    - Additional personal details (email, Aadhar, PAN)
    - Previous company information
    - Nominee details
    - Document upload functionality
- **UI Implementation**:
  - Desktop: Card-based selection with detailed descriptions
  - Mobile: Simple button-based selection
  - Visual feedback with badges showing estimated time

### 4. Utility Functions

#### **getVehicleIcon(category: string)**

- **Purpose**: Returns appropriate icon component for vehicle categories
- **Working**:
  - Searches through vehicleCategories array to find matching category
  - Returns the associated icon component
  - Falls back to default Car icon if category not found
- **Usage**: Used in Select components to display vehicle type icons

#### **Vehicle Data Arrays**

- **vehicleCategories**: Array of vehicle types with icons and labels
  - 2-Wheeler, 3-Wheeler, 4-Wheeler, Bus, Passenger Car, Commercial Vehicle
  - Each category includes value, label, and icon component
- **vehicleBrands**: Array of popular vehicle manufacturers
  - Includes Indian and international brands
  - Used in brand selection dropdown

### 5. Form Rendering Functions

#### **Quick Registration Form**

- **Purpose**: Renders essential customer information form
- **Sections**:
  - **Personal Information**: Name, contact, DOB, RC number
  - **Vehicle Information**: Category, brand, model selection
  - **Policy Information**: Expiry date selection
- **Working**:
  - Uses responsive grid layout (1 column on mobile, 2 on desktop)
  - Implements date picker with calendar component
  - Provides vehicle category selection with icons
  - Includes brand selection dropdown

#### **Full Registration Form**

- **Purpose**: Renders comprehensive customer registration form
- **Sections**:
  - **Personal Information**: Extended details including email, Aadhar, PAN
  - **Vehicle & Policy Information**: Complete vehicle and policy details
  - **Nominee Information**: Nominee details with relationship selection
  - **Document Upload**: File upload interface for various documents
- **Working**:
  - More detailed form with additional fields
  - Document upload with drag-and-drop interface
  - Relationship selection dropdown for nominee
  - File type validation and size limits

### 6. UI Component Functions

#### **Responsive Design Management**

- **Purpose**: Adapts form layout and functionality for different screen sizes
- **Working**:
  - **Desktop**: Shows detailed registration type cards with descriptions
  - **Mobile**: Shows compact button-based registration type selection
  - **Grid Layouts**: Responsive grids that adapt to screen size
  - **Form Fields**: Optimized spacing and sizing for mobile devices
- **Implementation**: Uses Tailwind responsive classes (md:, lg: prefixes)

#### **Date Picker Integration**

- **Purpose**: Provides calendar-based date selection for DOB and expiry dates
- **Working**:
  - Uses Popover and Calendar components
  - Formats dates using date-fns library
  - Provides visual calendar interface
  - Handles date selection and formatting
- **Flow**: Date field click → Calendar popup → Date selection → Format and store

#### **File Upload Management**

- **Purpose**: Handles document upload functionality in full registration
- **Working**:
  - Drag-and-drop interface for file uploads
  - File type validation (PDF, JPG, PNG)
  - Size limit enforcement (5MB max)
  - Visual feedback for file selection
  - Toast notifications for upload status
- **Documents Supported**:
  - RC Front/Back (required)
  - Aadhar Front/Back (optional)
  - PAN Card (optional)
  - Previous Policy (optional)

### 7. Form Validation Functions

#### **Basic Validation**

- **Purpose**: Ensures required fields are filled before submission
- **Working**:
  - Checks for RC Number, Name, and Contact Number
  - Shows error toast if validation fails
  - Prevents form submission until validation passes
- **Validation Rules**:
  - RC Number: Required, uppercase formatting
  - Name: Required, full name expected
  - Contact: Required, phone number format
  - Email: Optional, email format validation
  - Aadhar: Optional, 12-digit format
  - PAN: Optional, alphanumeric format

#### **Input Formatting**

- **Purpose**: Applies consistent formatting to form inputs
- **Working**:
  - RC Number: Automatic uppercase conversion
  - PAN Number: Automatic uppercase conversion
  - Contact: Phone number formatting
  - Email: Email format validation
- **Implementation**: Applied through CSS classes and input handlers

### 8. Integration Functions

#### **Parent Component Integration**

- **Purpose**: Integrates with parent components for data flow
- **Working**:
  - Receives existing customer data for edit mode
  - Calls onComplete callback with processed data
  - Handles cancel functionality
  - Provides success/error feedback
- **Data Flow**: Parent → Props → Form → Processing → Callback → Parent

#### **Component Reusability**

- **Purpose**: Enables component to be used in multiple contexts
- **Working**:
  - Edit mode: Pre-populates form with existing data
  - New registration: Starts with empty form
  - Modal integration: Works within dialog containers
  - Page integration: Works as standalone page component

### 9. User Experience Functions

#### **Visual Feedback**

- **Purpose**: Provides immediate feedback for user actions
- **Working**:
  - Toast notifications for form submission
  - Visual indicators for required fields
  - Hover effects on interactive elements
  - Loading states during form processing
- **Feedback Types**:
  - Success: Registration/update completion
  - Error: Validation failures
  - Info: File upload status

#### **Form Navigation**

- **Purpose**: Enables easy navigation between form sections
- **Working**:
  - Tab-based navigation between Quick and Full registration
  - Smooth transitions between form sections
  - Clear visual hierarchy and organization
  - Intuitive form flow and progression

### Flow/Sequence (High Level):

1. **Component Initialization**:
   - Receives props (customer data, edit mode)
   - Initializes form state with existing or default data
   - Sets up registration type selection
2. **User Interaction**:
   - Selects registration type (Quick/Full)
   - Fills form fields with customer information
   - Uploads documents (Full registration only)
   - Reviews and submits form
3. **Form Processing**:
   - Validates required fields
   - Transforms data to expected format
   - Shows success notification
   - Calls parent callback with processed data
4. **Integration**:
   - Parent component receives updated customer data
   - UI updates to reflect new/updated customer
   - Navigation to appropriate next step

### Key Features:

- **Dual Registration Modes**: Quick (5 min) and Full (15 min) registration options
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Form Validation**: Comprehensive validation with user feedback
- **Document Upload**: Drag-and-drop file upload with type validation
- **Edit Mode**: Pre-populated forms for existing customer updates
- **Visual Design**: Modern gradient cards with intuitive layout
- **Integration**: Seamless integration with parent components
- **User Experience**: Clear navigation, immediate feedback, and intuitive flow

Refer to `CustomerRegistration.tsx` for specific implementation details, styling, and component structure.

---

## ExpiryAlerts.tsx – Functions & Workflow

The `ExpiryAlerts.tsx` component provides a focused dashboard widget for displaying and managing insurance policy expiry alerts within the CRM system. It presents expiring policies in an organized, actionable format with urgency-based visual indicators and quick action buttons for customer outreach. Below is a detailed breakdown of all functions and their workflow:

### 1. Data Management Functions

#### **Mock Data Structure**

- **Purpose**: Provides sample data for expiring policies demonstration
- **Working**:
  - Contains array of policy objects with customer information
  - Each policy includes: ID, customer name, contact, RC number, expiry date, days left, urgency level
  - Simulates real-world policy expiry scenarios
- **Data Fields**:
  - `id`: Unique identifier for each policy
  - `customerName`: Full name of the policyholder
  - `contact`: Phone number for customer contact
  - `rcNumber`: Vehicle registration certificate number
  - `expiryDate`: Policy expiration date
  - `daysLeft`: Number of days remaining until expiry
  - `urgency`: Priority level (high, medium, low)

### 2. Utility Functions

#### **getUrgencyColor(urgency: string)**

- **Purpose**: Returns appropriate CSS classes for urgency-based styling
- **Working**:
  - Takes urgency level as input parameter
  - Returns corresponding Tailwind CSS classes for text, background, and border colors
  - Provides visual consistency for urgency indicators
- **Color Mapping**:
  - `high`: Red color scheme (text-red-600, bg-red-50, border-red-200)
  - `medium`: Orange color scheme (text-orange-600, bg-orange-50, border-orange-200)
  - `low`: Yellow color scheme (text-yellow-600, bg-yellow-50, border-yellow-200)
  - `default`: Gray color scheme (text-gray-600, bg-gray-50, border-gray-200)
- **Usage**: Applied to urgency badges and status indicators

#### **getUrgencyIcon(urgency: string)**

- **Purpose**: Returns appropriate icon color classes for urgency indicators
- **Working**:
  - Takes urgency level as input parameter
  - Returns corresponding text color classes for icons
  - Provides visual consistency for icon styling
- **Color Mapping**:
  - `high`: Red icon color (text-red-500)
  - `medium`: Orange icon color (text-orange-500)
  - `low`: Yellow icon color (text-yellow-500)
  - `default`: Gray icon color (text-gray-500)
- **Usage**: Applied to clock icons and other urgency-related visual elements

### 3. UI Rendering Functions

#### **Header Section Rendering**

- **Purpose**: Displays component title, description, and alert count
- **Working**:
  - Shows gradient icon with AlertTriangle
  - Displays "Expiring Policies" title with subtitle
  - Shows alert count badge with total number of expiring policies
- **Visual Elements**:
  - Gradient background icon (red gradient)
  - White AlertTriangle icon
  - Alert count badge with red styling
- **Layout**: Flex layout with space-between alignment

#### **Policy List Rendering**

- **Purpose**: Renders individual policy cards with customer information and actions
- **Working**:
  - Maps through expiringPolicies array
  - Creates individual policy cards with customer details
  - Displays customer avatar, name, contact, RC number, and expiry information
  - Includes action buttons for call and message
- **Card Structure**:
  - Customer avatar with initials
  - Customer name with urgency badge
  - Contact information with phone icon
  - RC number with calendar icon
  - Expiry date with clock icon
  - Action buttons (Call and Message)

### 4. Customer Information Display Functions

#### **Avatar Generation**

- **Purpose**: Creates customer avatars with initials
- **Working**:
  - Splits customer name by spaces
  - Extracts first character of each word
  - Joins characters to create initials
  - Displays in gradient-styled avatar component
- **Styling**: Purple gradient background with white text

#### **Customer Details Layout**

- **Purpose**: Organizes customer information in a readable format
- **Working**:
  - Responsive layout (column on mobile, row on desktop)
  - Customer name with urgency badge
  - Contact information with phone icon
  - RC number with calendar icon
  - Expiry date with urgency-colored clock icon
- **Responsive Behavior**:
  - Mobile: Stacked layout with full-width elements
  - Desktop: Horizontal layout with proper spacing

### 5. Action Button Functions

#### **Call Button**

- **Purpose**: Provides quick access to call customer functionality
- **Working**:
  - Displays phone icon with "Call" text
  - Responsive text (full "Call" on desktop, "Call" on mobile)
  - Styled with outline variant and hover effects
- **Integration**: Ready for navigation to call management system

#### **Message Button**

- **Purpose**: Provides quick access to message customer functionality
- **Working**:
  - Displays message circle icon with "Message" text
  - Responsive text (full "Message" on desktop, "Msg" on mobile)
  - Styled with outline variant and hover effects
- **Integration**: Ready for navigation to messaging system

### 6. Responsive Design Functions

#### **Mobile-First Layout**

- **Purpose**: Optimizes component display for different screen sizes
- **Working**:
  - **Mobile Layout**:
    - Stacked customer information
    - Full-width action buttons
    - Compact text labels
  - **Desktop Layout**:
    - Horizontal customer information layout
    - Side-by-side action buttons
    - Full text labels
- **Implementation**: Uses Tailwind responsive classes (md: prefix)

#### **Text Truncation**

- **Purpose**: Handles long text content gracefully
- **Working**:
  - Applies truncate class to customer names
  - Limits maximum width for contact information
  - Ensures consistent layout across different content lengths
- **Responsive Behavior**:
  - Mobile: Shorter max-width for compact display
  - Desktop: Longer max-width for better readability

### 7. Visual Design Functions

#### **Gradient and Glass Effects**

- **Purpose**: Creates modern, visually appealing interface
- **Working**:
  - Main container: White/80 background with backdrop blur
  - Policy cards: White/60 background with backdrop blur
  - Action buttons: White/50 background with hover effects
  - Gradient icons and avatars for visual hierarchy
- **Styling Elements**:
  - Backdrop blur effects for modern glass morphism
  - Gradient backgrounds for icons and avatars
  - Subtle shadows and borders for depth

#### **Color-Coded Urgency System**

- **Purpose**: Provides immediate visual feedback for policy urgency
- **Working**:
  - High urgency: Red color scheme
  - Medium urgency: Orange color scheme
  - Low urgency: Yellow color scheme
  - Consistent color application across badges, icons, and text
- **Visual Hierarchy**: Creates clear priority indication for user attention

### 8. Integration Functions

#### **View All Policies Button**

- **Purpose**: Provides navigation to comprehensive policy management
- **Working**:
  - Full-width button at bottom of component
  - Styled consistently with other action buttons
  - Ready for navigation to full policy management interface
- **Integration**: Can be connected to policy management page or modal

#### **Action Button Integration**

- **Purpose**: Enables quick customer outreach actions
- **Working**:
  - Call buttons ready for phone system integration
  - Message buttons ready for messaging system integration
  - Consistent styling and behavior across all buttons
- **Future Integration**: Can be connected to call management and messaging systems

### Flow/Sequence (High Level):

1. **Component Mount**:
   - Loads mock policy data
   - Initializes urgency color mappings
   - Renders component structure
2. **Data Processing**:
   - Maps through expiring policies
   - Applies urgency-based styling
   - Generates customer avatars and information
3. **UI Rendering**:
   - Displays header with alert count
   - Renders individual policy cards
   - Shows action buttons for each policy
4. **User Interaction**:
   - Users can view policy details
   - Click call buttons for customer contact
   - Click message buttons for customer communication
   - Click "View All" for comprehensive policy management

### Key Features:

- **Urgency-Based Alerts**: Color-coded system for policy priority
- **Responsive Design**: Optimized for mobile and desktop viewing
- **Quick Actions**: Direct access to call and message functionality
- **Visual Hierarchy**: Clear organization of information and actions
- **Modern Design**: Glass morphism effects and gradient styling
- **Customer Focus**: Easy access to customer contact information
- **Integration Ready**: Prepared for connection to call and messaging systems
- **Scalable Layout**: Handles varying amounts of policy data

Refer to `ExpiryAlerts.tsx` for specific implementation details, styling, and component structure.

---

## Header.tsx – Functions & Workflow

The `Header.tsx` component serves as the main navigation header for the CRM application, providing responsive navigation, user authentication controls, and brand identity across all pages. It adapts between desktop and mobile layouts while maintaining consistent functionality and user experience. Below is a detailed breakdown of all functions and their workflow:

### 1. Component Initialization and Dependencies

#### **React Router Integration**

- **Purpose**: Enables navigation and route-based active state management
- **Working**:
  - Uses `useLocation` hook to track current route
  - Provides `Link` components for navigation
  - Enables programmatic navigation and route detection
- **Integration**: Connects with React Router for seamless page navigation

#### **Authentication Context Integration**

- **Purpose**: Accesses user authentication state and logout functionality
- **Working**:
  - Uses `useAuth` hook to access user data and signOut function
  - Provides user information for display and avatar generation
  - Enables secure logout functionality
- **Data Access**: User metadata, email, avatar URL, and authentication state

### 2. Navigation Configuration Functions

#### **Navigation Array Definition**

- **Purpose**: Defines the main navigation structure for the application
- **Working**:
  - Contains array of navigation objects with name, href, and icon
  - Maps navigation items to their respective routes and icons
  - Provides consistent navigation structure across the application
- **Navigation Items**:
  - Dashboard: Main dashboard page
  - Customers: Customer management page
  - Call Management: Call handling interface
  - Registration: Customer registration page
  - Profile: User profile page
- **Icon Integration**: Each navigation item includes a Lucide React icon

#### **Active Route Detection**

- **Purpose**: Determines which navigation item is currently active
- **Working**:
  - `isActive(path: string)` function compares current route with navigation paths
  - Returns boolean indicating if the path matches current location
  - Used for applying active styling to navigation items
- **Flow**: Route change → Location update → Active state calculation → UI update

### 3. User Information Functions

#### **getUserInitials()**

- **Purpose**: Generates user initials for avatar display
- **Working**:
  - Checks for first_name and last_name in user metadata
  - Falls back to full_name if available
  - Uses email first character as final fallback
  - Returns "U" as default if no user data available
- **Priority Order**:
  1. First name + Last name initials
  2. Full name initials
  3. Email first character
  4. Default "U"
- **Usage**: Used in Avatar components for user identification

#### **getUserName()**

- **Purpose**: Generates display name for user
- **Working**:
  - Checks for first_name and last_name in user metadata
  - Falls back to full_name if available
  - Uses email username (before @) as fallback
  - Returns "User" as default if no user data available
- **Priority Order**:
  1. First name + Last name
  2. Full name
  3. Email username
  4. Default "User"
- **Usage**: Used in dropdown menus and user display areas

### 4. Desktop Header Rendering Functions

#### **Logo and Brand Section**

- **Purpose**: Displays application branding and logo
- **Working**:
  - Shows gradient-styled car icon as logo
  - Displays "MotorKavach" brand name
  - Includes "Insurance Management" subtitle
  - Links to dashboard page
- **Visual Elements**:
  - Purple gradient background for logo
  - White car icon
  - Brand name and subtitle
  - Responsive visibility (hidden on small screens)

#### **Desktop Navigation Menu**

- **Purpose**: Renders main navigation links for desktop users
- **Working**:
  - Maps through navigation array
  - Creates Link components for each navigation item
  - Applies active state styling based on current route
  - Includes icons and text labels
- **Styling Logic**:
  - Active items: Purple gradient background with white text
  - Inactive items: Gray text with hover effects
  - Smooth transitions and hover states
- **Layout**: Horizontal navigation bar with proper spacing

#### **Desktop Action Buttons**

- **Purpose**: Provides quick access to search, notifications, and user menu
- **Working**:
  - Search button with search icon
  - Notification button with bell icon and notification count
  - User avatar with dropdown menu
- **Features**:
  - Notification badge showing count (hardcoded as "3")
  - User avatar with profile image or initials
  - Dropdown menu for user actions

### 5. User Dropdown Menu Functions

#### **User Profile Dropdown**

- **Purpose**: Provides user account management options
- **Working**:
  - Shows user name and email in header
  - Provides profile, settings, and logout options
  - Includes proper separators and icons
- **Menu Items**:
  - Profile: User profile management
  - Settings: Application settings
  - Logout: Sign out functionality
- **Integration**: Connects with authentication context for logout

#### **User Information Display**

- **Purpose**: Shows user details in dropdown header
- **Working**:
  - Displays user name using getUserName() function
  - Shows user email address
  - Provides visual hierarchy with proper typography
- **Layout**: Two-line display with name and email

### 6. Mobile Header Rendering Functions

#### **Mobile Layout Structure**

- **Purpose**: Provides optimized header layout for mobile devices
- **Working**:
  - Three-section layout: Avatar, Title, Logout
  - Compact design with essential elements only
  - Responsive typography and spacing
- **Layout Sections**:
  - Left: User avatar
  - Center: App title and subtitle
  - Right: Logout button

#### **Mobile User Avatar**

- **Purpose**: Displays user avatar on mobile header
- **Working**:
  - Shows user profile image or initials
  - Uses same avatar generation logic as desktop
  - Compact size appropriate for mobile
- **Styling**: Gradient background with user initials

#### **Mobile Brand Display**

- **Purpose**: Shows application branding on mobile
- **Working**:
  - Displays "MotorKavach" title
  - Shows "Insurance Management" subtitle
  - Centered layout for visual balance
- **Typography**: Responsive text sizing for mobile screens

#### **Mobile Logout Button**

- **Purpose**: Provides quick logout access on mobile
- **Working**:
  - Red-colored logout icon
  - Direct signOut function call
  - Accessible with proper aria-label
- **Styling**: Ghost button with red hover state

### 7. Responsive Design Functions

#### **Breakpoint Management**

- **Purpose**: Handles different layouts for desktop and mobile
- **Working**:
  - Desktop: Full navigation with all features
  - Mobile: Simplified layout with essential elements
  - Uses Tailwind responsive classes (md: prefix)
- **Implementation**: Conditional rendering based on screen size

#### **Responsive Navigation**

- **Purpose**: Adapts navigation for different screen sizes
- **Working**:
  - Desktop: Horizontal navigation bar
  - Mobile: Navigation handled by separate mobile navigation component
  - Maintains functionality across all screen sizes
- **User Experience**: Consistent navigation regardless of device

### 8. Visual Design Functions

#### **Gradient and Styling**

- **Purpose**: Creates modern, visually appealing header design
- **Working**:
  - Purple gradient theme throughout header
  - Glass morphism effect with backdrop blur
  - Consistent color scheme and typography
- **Visual Elements**:
  - Gradient backgrounds for active states
  - Backdrop blur for modern glass effect
  - Consistent purple color scheme

#### **Icon Integration**

- **Purpose**: Provides visual context for navigation and actions
- **Working**:
  - Uses Lucide React icons throughout
  - Consistent icon sizing and styling
  - Proper icon-text alignment
- **Icon Usage**: Navigation items, user actions, and brand elements

### 9. Accessibility Functions

#### **Accessibility Features**

- **Purpose**: Ensures header is accessible to all users
- **Working**:
  - Proper aria-labels for buttons
  - Semantic HTML structure
  - Keyboard navigation support
  - Screen reader compatibility
- **Implementation**: ARIA attributes and semantic markup

### Flow/Sequence (High Level):

1. **Component Mount**:
   - Initializes with authentication context
   - Sets up navigation configuration
   - Renders appropriate layout based on screen size
2. **User Interaction**:
   - Navigation clicks update active state
   - User dropdown provides account options
   - Logout functionality signs user out
3. **Responsive Behavior**:
   - Adapts layout for desktop and mobile
   - Maintains functionality across screen sizes
   - Provides consistent user experience
4. **State Management**:
   - Tracks current route for active navigation
   - Manages user authentication state
   - Updates UI based on user data

### Key Features:

- **Responsive Design**: Optimized layouts for desktop and mobile
- **User Authentication**: Integrated user management and logout
- **Navigation System**: Comprehensive navigation with active states
- **Brand Identity**: Consistent branding and visual design
- **Accessibility**: Proper ARIA labels and semantic markup
- **Modern Design**: Glass morphism effects and gradient styling
- **User Experience**: Intuitive navigation and user controls
- **Integration**: Seamless connection with authentication and routing systems

Refer to `Header.tsx` for specific implementation details, styling, and component structure.

---

## HoldUser.tsx – Functions & Workflow

The `HoldUser.tsx` component manages the user experience when an account is placed on hold, providing a countdown timer, account activation functionality, and comprehensive profile information display. It handles real-time updates and automatic redirection based on account status changes. Below is a detailed breakdown of all functions and their workflow:

### 1. Component State Management

#### **State Variables**

- **Purpose**: Manages component state for user profile, loading, errors, and timer functionality
- **State Variables**:
  - `profile`: User profile data from database
  - `loading`: Loading state for data fetching
  - `error`: Error messages for failed operations
  - `timeRemaining`: Milliseconds remaining in hold period
  - `canActivate`: Boolean indicating if account can be activated
  - `activating`: Loading state for activation process
- **Working**: Provides comprehensive state management for all component functionality

### 2. Data Fetching Functions

#### **fetchUserProfile()**

- **Purpose**: Retrieves user profile data from Supabase database
- **Working**:
  - Queries `user_profiles` table using authenticated user ID
  - Handles errors and sets appropriate error messages
  - Updates profile state with fetched data
  - Calls `calculateTimeRemaining()` to initialize timer
- **Flow**: User authentication → Database query → Data processing → State update
- **Error Handling**: Sets error state for failed database operations

### 3. Timer Management Functions

#### **calculateTimeRemaining(userProfile: UserProfile)**

- **Purpose**: Calculates remaining time in hold period
- **Working**:
  - Compares current time with hold end date
  - Sets `timeRemaining` state with milliseconds remaining
  - Updates `canActivate` state based on hold period completion
  - Handles cases where hold period has expired
- **Logic**: Current time vs hold_end_date comparison
- **State Updates**: timeRemaining, canActivate

#### **formatTimeRemaining(milliseconds: number)**

- **Purpose**: Formats milliseconds into human-readable time format
- **Working**:
  - Converts milliseconds to days, hours, minutes, seconds
  - Returns formatted string with appropriate time units
  - Handles zero or negative values
- **Format Options**:
  - Days > 0: "Xd HH:MM:SS"
  - Days = 0: "HH:MM:SS"
  - Zero/negative: "00:00:00"
- **Usage**: Display in countdown timer UI

### 4. Account Activation Functions

#### **handleActivateAccount()**

- **Purpose**: Activates user account after hold period completion
- **Working**:
  - Updates user profile in database with active status
  - Clears hold-related fields (hold_days, hold_start_date, hold_end_date)
  - Sets status_reason with activation timestamp
  - Updates local state immediately for responsive UI
  - Redirects to dashboard after successful activation
- **Database Updates**:
  - status: 'active'
  - hold_days: null
  - hold_start_date: null
  - hold_end_date: null
  - status_reason: activation timestamp
- **Flow**: Activation request → Database update → Local state update → Redirect

### 5. Real-Time Updates Functions

#### **Real-Time Subscription Setup**

- **Purpose**: Listens for profile updates from database
- **Working**:
  - Creates Supabase real-time channel for profile updates
  - Listens for UPDATE events on user_profiles table
  - Filters updates for current user only
  - Handles various status changes with appropriate redirects
- **Status Change Handling**:
  - 'active': Redirect to dashboard
  - 'approved': Redirect to dashboard
  - 'rejected': Redirect to rejection page
  - 'suspend': Redirect to suspended page
  - 'hold' updates: Refresh page for hold modifications
- **Cleanup**: Removes channel subscription on component unmount

### 6. Navigation and Authentication Functions

#### **handleBackToLogin()**

- **Purpose**: Signs out user and redirects to login page
- **Working**:
  - Calls signOut function from authentication context
  - Navigates to login page
  - Handles signOut errors with fallback navigation
- **Error Handling**: Fallback navigation if signOut fails

### 7. UI Helper Functions

#### **getRoleColor(role: string)**

- **Purpose**: Returns appropriate CSS classes for role-based styling
- **Working**:
  - Maps role values to color schemes
  - Returns Tailwind CSS classes for background, text, and border
- **Role Mappings**:
  - 'admin': Red color scheme
  - 'manager': Blue color scheme
  - 'supervisor': Purple color scheme
  - Default: Gray color scheme

#### **getRoleLabel(role: string)**

- **Purpose**: Returns human-readable role labels
- **Working**:
  - Maps role values to display labels
  - Capitalizes role names for UI display
- **Role Mappings**:
  - 'admin': 'Admin'
  - 'manager': 'Manager'
  - 'supervisor': 'Supervisor'
  - 'employee': 'Employee'

### 8. Effect Hooks

#### **Main useEffect Hook**

- **Purpose**: Handles component initialization and real-time subscriptions
- **Working**:
  - Waits for authentication loading to complete
  - Redirects to login if no user authenticated
  - Fetches user profile on authentication
  - Sets up real-time subscription for profile updates
  - Handles cleanup on component unmount
- **Dependencies**: user, authLoading, navigate

#### **Countdown Timer useEffect**

- **Purpose**: Manages countdown timer functionality
- **Working**:
  - Sets up interval to update timer every second
  - Decrements timeRemaining by 1000ms each second
  - Sets canActivate to true when timer reaches zero
  - Cleans up interval on component unmount
- **Dependencies**: timeRemaining

### 9. Conditional Rendering Functions

#### **Loading State Rendering**

- **Purpose**: Shows loading spinner while fetching data
- **Working**:
  - Displays centered loading spinner
  - Uses orange color scheme consistent with hold theme
- **UI**: Animated spinner with orange border

#### **Error State Rendering**

- **Purpose**: Shows error message when profile cannot be loaded
- **Working**:
  - Displays error icon and message
  - Provides back to login button
  - Handles cases where profile data is unavailable
- **UI**: Alert icon, error message, action button

#### **Active User Redirect**

- **Purpose**: Redirects users who are already active
- **Working**:
  - Checks if user status is 'active'
  - Redirects to dashboard if already active
  - Prevents unnecessary hold page display
- **Logic**: Early return with navigation

### Flow/Sequence (High Level):

1. **Component Mount**:
   - Waits for authentication
   - Fetches user profile
   - Sets up real-time subscription
2. **Timer Management**:
   - Calculates remaining hold time
   - Updates countdown display
   - Enables activation when time expires
3. **User Interaction**:
   - User can activate account when eligible
   - User can return to login
   - Real-time updates handle status changes
4. **Status Changes**:
   - Admin changes trigger real-time updates
   - Automatic redirects based on new status
   - Local state updates for responsive UI

### Key Features:

- **Real-Time Updates**: Live status change notifications
- **Countdown Timer**: Visual countdown to hold period end
- **Account Activation**: Self-service account activation
- **Profile Display**: Comprehensive user information
- **Responsive Design**: Mobile-optimized layout
- **Error Handling**: Graceful error management
- **Status Management**: Handles various account states
- **Navigation Integration**: Seamless routing and redirects

---

## Layout.tsx – Functions & Workflow

The `Layout.tsx` component serves as the main layout wrapper for the CRM application, providing consistent structure with header, main content area, and mobile navigation across all pages. It integrates authentication context and responsive design for optimal user experience.

### 1. Component Structure Functions

#### **Layout Wrapper**

- **Purpose**: Provides consistent page structure across the application
- **Working**:
  - Wraps all page content with consistent layout
  - Includes Header, main content area, and MobileNavigation
  - Uses gradient background for visual appeal
- **Structure**:
  - Header component at top
  - Main content area with Outlet for page content
  - Mobile navigation at bottom (mobile only)

#### **Authentication Integration**

- **Purpose**: Accesses user authentication state
- **Working**:
  - Uses `useAuth` hook to access user data
  - Enables authentication-aware layout rendering
  - Provides user context to child components
- **Data Access**: User authentication state

### 2. Responsive Design Functions

#### **Mobile Layout Management**

- **Purpose**: Handles responsive layout for different screen sizes
- **Working**:
  - Desktop: Standard layout with header only
  - Mobile: Header + bottom navigation
  - Adjusts padding to accommodate mobile navigation
- **Implementation**:
  - `pb-20 md:pb-0`: Bottom padding for mobile navigation
  - Conditional mobile navigation display

#### **Background Styling**

- **Purpose**: Provides consistent visual theme
- **Working**:
  - Gradient background from gray to purple to blue
  - Creates modern, appealing visual foundation
  - Consistent across all pages
- **Styling**: `bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50`

### 3. Component Integration Functions

#### **Header Integration**

- **Purpose**: Includes main navigation header
- **Working**:
  - Renders Header component at top of layout
  - Provides navigation and user controls
  - Consistent across all pages
- **Features**: Navigation, user menu, branding

#### **Outlet Integration**

- **Purpose**: Renders page-specific content
- **Working**:
  - Uses React Router Outlet for dynamic content
  - Renders current route's component
  - Maintains layout structure around page content
- **Implementation**: `<Outlet />` for route rendering

#### **Mobile Navigation Integration**

- **Purpose**: Provides mobile-specific navigation
- **Working**:
  - Renders MobileNavigation component
  - Only visible on mobile devices
  - Provides bottom navigation bar
- **Responsive**: Hidden on desktop (`md:hidden`)

### Flow/Sequence (High Level):

1. **Layout Rendering**:
   - Renders header with navigation
   - Sets up main content area
   - Includes mobile navigation
2. **Page Content**:
   - Outlet renders current route component
   - Maintains consistent layout structure
3. **Responsive Behavior**:
   - Adapts layout for mobile and desktop
   - Provides appropriate navigation for each screen size

### Key Features:

- **Consistent Structure**: Uniform layout across all pages
- **Responsive Design**: Optimized for mobile and desktop
- **Authentication Integration**: User-aware layout rendering
- **Navigation Integration**: Header and mobile navigation
- **Visual Consistency**: Gradient background and styling
- **Route Management**: Dynamic content rendering with Outlet

---

## MobileNavigation.tsx – Functions & Workflow

The `MobileNavigation.tsx` component provides a bottom navigation bar for mobile devices, offering quick access to main application features with a floating action button for customer registration. It ensures consistent mobile navigation experience across the CRM application.

### 1. Navigation Configuration Functions

#### **Navigation Array Definition**

- **Purpose**: Defines mobile navigation structure
- **Working**:
  - Contains array of navigation objects with name, href, and icon
  - Maps navigation items to their respective routes and icons
  - Provides consistent mobile navigation structure
- **Navigation Items**:
  - Dashboard: Main dashboard page
  - Customers: Customer management page
  - Calls: Call management interface
  - Registration: Customer registration page
- **Icon Integration**: Each navigation item includes a Lucide React icon

#### **Active Route Detection**

- **Purpose**: Determines which navigation item is currently active
- **Working**:
  - `isActive(path: string)` function compares current route with navigation paths
  - Returns boolean indicating if the path matches current location
  - Used for applying active styling to navigation items
- **Flow**: Route change → Location update → Active state calculation → UI update

### 2. UI Rendering Functions

#### **Bottom Navigation Bar**

- **Purpose**: Renders fixed bottom navigation for mobile devices
- **Working**:
  - Fixed positioning at bottom of screen
  - Grid layout with 4 navigation items
  - Glass morphism effect with backdrop blur
  - Responsive design for mobile screens only
- **Styling**:
  - Fixed bottom positioning
  - White/95 background with backdrop blur
  - Border top with shadow
  - Grid layout for navigation items

#### **Navigation Item Rendering**

- **Purpose**: Renders individual navigation items
- **Working**:
  - Maps through navigation array
  - Creates Link components for each navigation item
  - Applies active state styling based on current route
  - Includes icons and text labels
- **Styling Logic**:
  - Active items: Purple text color
  - Inactive items: Gray text with hover effects
  - Smooth transitions and hover states
- **Layout**: Flex column with icon and text

### 3. Floating Action Button Functions

#### **Floating Action Button (FAB)**

- **Purpose**: Provides quick access to customer registration
- **Working**:
  - Positioned above navigation bar
  - Centered horizontally with transform positioning
  - Links to registration page
  - Gradient styling with shadow effects
- **Features**:
  - Plus icon for add/create action
  - Gradient background (purple)
  - Elevated shadow for floating effect
  - Hover animations and transitions

#### **FAB Positioning**

- **Purpose**: Positions floating action button above navigation
- **Working**:
  - Absolute positioning relative to navigation bar
  - Centered horizontally with transform
  - Elevated above navigation bar
  - Responsive positioning
- **Implementation**: `absolute -top-6 left-1/2 transform -translate-x-1/2`

### 4. Responsive Design Functions

#### **Mobile-Only Display**

- **Purpose**: Ensures navigation only shows on mobile devices
- **Working**:
  - Uses `md:hidden` class to hide on desktop
  - Provides mobile-specific navigation experience
  - Prevents duplication with desktop header navigation
- **Implementation**: Tailwind responsive classes

#### **Grid Layout Management**

- **Purpose**: Organizes navigation items in grid layout
- **Working**:
  - 4-column grid for navigation items
  - Equal spacing and sizing
  - Responsive grid behavior
- **Layout**: `grid grid-cols-4 gap-1 p-2`

### 5. Visual Design Functions

#### **Glass Morphism Effect**

- **Purpose**: Creates modern, visually appealing navigation
- **Working**:
  - Semi-transparent background with backdrop blur
  - Creates glass-like appearance
  - Modern design aesthetic
- **Styling**: `bg-white/95 backdrop-blur-xl`

#### **Shadow and Border Effects**

- **Purpose**: Provides visual depth and separation
- **Working**:
  - Top border with subtle color
  - Shadow for elevation effect
  - Visual separation from content
- **Styling**: `border-t border-gray-200/50 shadow-2xl`

### 6. Icon and Typography Functions

#### **Icon Integration**

- **Purpose**: Provides visual context for navigation items
- **Working**:
  - Uses Lucide React icons throughout
  - Consistent icon sizing and styling
  - Proper icon-text alignment
- **Icon Usage**: Navigation items and floating action button

#### **Typography Management**

- **Purpose**: Ensures readable text in compact mobile layout
- **Working**:
  - Small text size for navigation labels
  - Medium font weight for readability
  - Proper text hierarchy
- **Typography**: `text-xs font-medium`

### Flow/Sequence (High Level):

1. **Component Mount**:
   - Initializes with current route
   - Sets up navigation configuration
   - Renders navigation items
2. **User Interaction**:
   - Navigation clicks update active state
   - FAB provides quick registration access
   - Smooth transitions between states
3. **Responsive Behavior**:
   - Only displays on mobile devices
   - Maintains consistent functionality
   - Provides optimal mobile experience

### Key Features:

- **Mobile-First Design**: Optimized for mobile devices only
- **Quick Access**: Easy navigation to main features
- **Floating Action Button**: Prominent registration access
- **Active State Management**: Visual feedback for current page
- **Modern Design**: Glass morphism and gradient effects
- **Responsive Layout**: Grid-based navigation organization
- **Smooth Animations**: Transitions and hover effects
- **Icon Integration**: Visual context for navigation items

Refer to `HoldUser.tsx`, `Layout.tsx`, and `MobileNavigation.tsx` for specific implementation details, styling, and component structure.

---

## ProfileCompletion.tsx – Functions & Workflow

The `ProfileCompletion.tsx` component manages the initial user profile setup process for new users in the CRM system. It provides a comprehensive form for collecting essential user information, validates input data, and handles the profile creation workflow with proper error handling and success feedback. Below is a detailed breakdown of all functions and their workflow:

### 1. Component State Management

#### **State Variables**

- **Purpose**: Manages component state for form data, loading, errors, and success states
- **State Variables**:
  - `loading`: Loading state for form submission
  - `userData`: Form data object containing all user information
  - `error`: Error messages for validation and submission failures
  - `success`: Success state for completed profile creation
- **Working**: Provides comprehensive state management for form functionality and user feedback

#### **UserData Interface**

- **Purpose**: Defines the structure of user profile data
- **Fields**:
  - `userName`: Full name of the user
  - `email`: User's email address
  - `contactNo`: 10-digit phone number
  - `address`: Street address and locality
  - `city`: City name
  - `state`: State name
  - `pincode`: 6-digit postal code
  - `dob`: Date of birth
- **Working**: Ensures type safety and consistent data structure

### 2. Geographic Data Management

#### **Indian States and Cities Data**

- **Purpose**: Provides comprehensive geographic data for Indian locations
- **Working**:
  - `indianStates`: Array of all Indian states and union territories
  - `indianCities`: Object mapping states to their cities
  - Enables dynamic city selection based on state selection
- **Data Structure**:
  - 37 states and union territories
  - 10 major cities per state/territory
  - Hierarchical state-city relationship

#### **getCitiesForState(state: string)**

- **Purpose**: Returns cities for a selected state
- **Working**:
  - Takes state name as parameter
  - Returns array of cities for that state
  - Handles cases where state is not found
- **Usage**: Used in city dropdown to filter cities based on selected state

### 3. Authentication and Navigation Functions

#### **useEffect Hook for Authentication**

- **Purpose**: Handles component initialization and authentication checks
- **Working**:
  - Redirects to login if no user is authenticated
  - Calls `checkExistingProfile()` to verify if user already has profile
  - Ensures proper authentication flow
- **Dependencies**: user, navigate

#### **checkExistingProfile()**

- **Purpose**: Verifies if user already has a profile in the database
- **Working**:
  - Queries `user_profiles` table for existing user data
  - Redirects to approval-pending page if profile exists
  - Allows profile completion if no existing profile found
- **Flow**: Database query → Profile check → Conditional redirect

### 4. Form Management Functions

#### **handleInputChange(e: React.ChangeEvent)**

- **Purpose**: Updates form data when user inputs values
- **Working**:
  - Extracts name and value from input event
  - Updates userData state with new value
  - Preserves all other form fields
- **Parameters**: Event from input, textarea, or select elements
- **Flow**: User input → Event extraction → State update → UI refresh

#### **handleSubmit(e: React.FormEvent)**

- **Purpose**: Processes form submission with validation and database insertion
- **Working**:
  - Prevents default form submission
  - Performs comprehensive validation
  - Authenticates user with Supabase
  - Inserts profile data into database
  - Verifies successful insertion
  - Redirects to approval-pending page
- **Validation Steps**:
  1. User authentication check
  2. Required fields validation
  3. Phone number format validation (10 digits)
  4. Pincode format validation (6 digits)
- **Database Operations**:
  - User authentication verification
  - Profile data insertion
  - Insert verification
  - Profile data refresh

### 5. Validation Functions

#### **Required Fields Validation**

- **Purpose**: Ensures all mandatory fields are filled
- **Working**:
  - Checks for userName, contactNo, address, city, state, pincode, dob
  - Sets error message if any required field is missing
  - Prevents form submission until all fields are complete
- **Validation Logic**: Boolean check for empty or undefined values

#### **Phone Number Validation**

- **Purpose**: Validates phone number format
- **Working**:
  - Uses regex pattern `/^[0-9]{10}$/`
  - Ensures exactly 10 digits
  - Sets error message for invalid format
- **Regex**: Matches exactly 10 numeric digits

#### **Pincode Validation**

- **Purpose**: Validates postal code format
- **Working**:
  - Uses regex pattern `/^[0-9]{6}$/`
  - Ensures exactly 6 digits
  - Sets error message for invalid format
- **Regex**: Matches exactly 6 numeric digits

### 6. Database Operations Functions

#### **User Authentication Verification**

- **Purpose**: Verifies user exists in Supabase auth system
- **Working**:
  - Calls `supabase.auth.getUser()`
  - Validates user authentication status
  - Sets error if authentication fails
- **Error Handling**: Redirects to login if authentication fails

#### **Profile Data Insertion**

- **Purpose**: Inserts user profile data into database
- **Working**:
  - Creates profileData object with all form fields
  - Sets default approval_status to 'pending'
  - Sets default status to 'active'
  - Inserts data into `user_profiles` table
- **Profile Data Structure**:
  - user_id: Authenticated user ID
  - user_name: Full name
  - email: Email address
  - contact_no: Phone number
  - address: Street address
  - city: City name
  - state: State name
  - pincode: Postal code
  - dob: Date of birth
  - approval_status: 'pending'
  - status: 'active'

#### **Insert Verification**

- **Purpose**: Verifies profile was successfully inserted
- **Working**:
  - Waits for database transaction to commit
  - Queries database to verify profile exists
  - Checks approval_status is 'pending'
  - Sets success state if verification passes
- **Verification Steps**:
  1. Wait for transaction commit
  2. Query profile by user_id
  3. Verify approval_status
  4. Set success state

### 7. Error Handling Functions

#### **Database Error Handling**

- **Purpose**: Handles various database errors gracefully
- **Working**:
  - Checks error codes and messages
  - Provides specific error messages for different error types
  - Handles foreign key constraint errors (23503)
  - Sets appropriate error messages for user feedback
- **Error Types**:
  - Authentication errors
  - Foreign key constraint errors
  - General database errors
  - Network/connection errors

#### **Validation Error Handling**

- **Purpose**: Handles form validation errors
- **Working**:
  - Sets error messages for validation failures
  - Prevents form submission on validation errors
  - Provides clear feedback to users
- **Error Messages**:
  - Required fields missing
  - Invalid phone number format
  - Invalid pincode format

### 8. Success Handling Functions

#### **Success State Management**

- **Purpose**: Manages successful profile completion
- **Working**:
  - Sets success state to true
  - Clears error messages
  - Refreshes profile data
  - Redirects to approval-pending page
- **Success Flow**: Profile creation → Verification → Success state → Redirect

#### **Profile Data Refresh**

- **Purpose**: Refreshes profile data after successful creation
- **Working**:
  - Calls `refreshProfile()` from useProfileCompletion hook
  - Waits for profile data to be updated
  - Ensures data consistency
- **Integration**: Uses custom hook for profile management

### 9. UI Rendering Functions

#### **Form Rendering**

- **Purpose**: Renders the profile completion form
- **Working**:
  - Displays form fields with proper labels and icons
  - Shows validation errors
  - Handles loading states
  - Provides proper form accessibility
- **Form Fields**:
  - Full Name (text input)
  - Email (disabled, pre-filled)
  - Contact Number (tel input)
  - Address (textarea)
  - State (select dropdown)
  - City (select dropdown, dependent on state)
  - Pincode (text input)
  - Date of Birth (date input)

#### **Success State Rendering**

- **Purpose**: Renders success message and verification options
- **Working**:
  - Shows success message with checkmark icon
  - Provides manual profile check button
  - Displays redirect notification
- **UI Elements**:
  - Success message with green styling
  - Check profile status button
  - Redirect notification

#### **Error State Rendering**

- **Purpose**: Renders error messages and validation feedback
- **Working**:
  - Shows error messages with alert icon
  - Uses red color scheme for errors
  - Provides clear error descriptions
- **Error Display**: Red background with alert icon and error text

### 10. Responsive Design Functions

#### **Grid Layout Management**

- **Purpose**: Handles responsive layout for form fields
- **Working**:
  - Single column layout on mobile
  - Three-column grid on desktop (state, city, pincode)
  - Responsive spacing and sizing
- **Implementation**: `grid grid-cols-1 md:grid-cols-3 gap-3`

#### **Form Field Styling**

- **Purpose**: Provides consistent styling for form elements
- **Working**:
  - Gray background for inputs
  - Green focus ring for active fields
  - Proper spacing and typography
  - Disabled state styling
- **Styling**: Tailwind CSS classes for consistent appearance

### Flow/Sequence (High Level):

1. **Component Initialization**:
   - Checks user authentication
   - Verifies existing profile
   - Initializes form state
2. **Form Interaction**:
   - User fills form fields
   - Real-time validation feedback
   - State-dependent city selection
3. **Form Submission**:
   - Comprehensive validation
   - User authentication verification
   - Database insertion
   - Insert verification
4. **Success Handling**:
   - Success state display
   - Profile data refresh
   - Redirect to approval page

### Key Features:

- **Comprehensive Validation**: Required fields, phone, and pincode validation
- **Geographic Data**: Complete Indian states and cities database
- **Database Integration**: Secure profile creation with verification
- **Error Handling**: Graceful error management with user feedback
- **Responsive Design**: Mobile-optimized form layout
- **Authentication Integration**: Secure user verification
- **Success Management**: Clear success feedback and redirection
- **Form Accessibility**: Proper labels, icons, and keyboard navigation

Refer to `ProfileCompletion.tsx` for specific implementation details, styling, and component structure.

---

## QuickActions.tsx – Functions & Workflow

The `QuickActions.tsx` component provides a dashboard widget with quick access buttons for common CRM operations and displays daily performance summary metrics. It offers a streamlined interface for users to perform frequent tasks and monitor their daily progress. Below is a detailed breakdown of all functions and their workflow:

### 1. Component Props and Interface

#### **QuickActionsProps Interface**

- **Purpose**: Defines the component's external interface
- **Props**:
  - `onAddCustomer`: Callback function for adding new customers
- **Working**: Enables parent components to handle customer addition functionality
- **Integration**: Connects with parent component's customer management logic

### 2. Actions Configuration Functions

#### **Actions Array Definition**

- **Purpose**: Defines the available quick actions with their properties
- **Working**:
  - Contains array of action objects with title, description, icon, action, gradient, and textColor
  - Maps each action to its respective functionality and styling
  - Provides consistent action structure across the component
- **Action Properties**:
  - `title`: Display name for the action
  - `description`: Brief description of the action
  - `icon`: Lucide React icon component
  - `action`: Function to execute when clicked
  - `gradient`: CSS gradient classes for styling
  - `textColor`: Text color classes

#### **Available Actions**

1. **Add Customer**:

   - Description: "Register new policy"
   - Icon: Plus
   - Action: Calls `onAddCustomer` prop function
   - Gradient: Purple gradient
   - Purpose: Quick access to customer registration

2. **Send Messages**:

   - Description: "Bulk WhatsApp"
   - Icon: MessageCircle
   - Action: Console log (placeholder)
   - Gradient: Green gradient
   - Purpose: Bulk messaging functionality

3. **Generate Report**:

   - Description: "Monthly analytics"
   - Icon: Download
   - Action: Console log (placeholder)
   - Gradient: Blue gradient
   - Purpose: Report generation

4. **View Analytics**:
   - Description: "Performance insights"
   - Icon: BarChart3
   - Action: Console log (placeholder)
   - Gradient: Orange gradient
   - Purpose: Analytics viewing

### 3. UI Rendering Functions

#### **Header Section Rendering**

- **Purpose**: Displays component title and icon
- **Working**:
  - Shows gradient-styled Settings icon
  - Displays "Quick Actions" title
  - Creates visual hierarchy and branding
- **Visual Elements**:
  - Purple gradient background for icon
  - White Settings icon
  - Bold title text
- **Layout**: Flex layout with icon and title

#### **Action Buttons Rendering**

- **Purpose**: Renders individual action buttons with styling
- **Working**:
  - Maps through actions array
  - Creates Button components for each action
  - Applies gradient backgrounds and hover effects
  - Includes icons and text content
- **Button Structure**:
  - Full-width button with custom height
  - Gradient background with hover opacity
  - Icon with semi-transparent background
  - Title and description text
  - Shadow effects and transitions

#### **Action Button Layout**

- **Purpose**: Organizes action button content
- **Working**:
  - Flex layout with icon and text sections
  - Icon in semi-transparent white background
  - Text content with title and description
  - Proper spacing and alignment
- **Layout Structure**:
  - Icon section with background
  - Text section with title and description
  - Responsive spacing

### 4. Summary Section Functions

#### **Today's Summary Header**

- **Purpose**: Displays summary section title and icon
- **Working**:
  - Shows gradient-styled TrendingUp icon
  - Displays "Today's Summary" title
  - Creates visual separation from actions
- **Visual Elements**:
  - Emerald gradient background for icon
  - White TrendingUp icon
  - Semibold title text

#### **Summary Metrics Rendering**

- **Purpose**: Displays daily performance metrics
- **Working**:
  - Renders three key performance indicators
  - Uses color-coded metrics with gradients
  - Shows progress and achievement data
- **Metrics Displayed**:
  1. **Sales Target**: 85% completion
  2. **Calls Made**: 47/50 calls
  3. **New Leads**: 12 new leads

### 5. Metric Display Functions

#### **Sales Target Metric**

- **Purpose**: Shows sales target completion percentage
- **Working**:
  - Green color scheme for positive metric
  - Displays 85% completion rate
  - Uses green gradient background
- **Styling**: Green gradient background with green text and indicator

#### **Calls Made Metric**

- **Purpose**: Shows call activity progress
- **Working**:
  - Blue color scheme for activity metric
  - Displays current calls vs target (47/50)
  - Uses blue gradient background
- **Styling**: Blue gradient background with blue text and indicator

#### **New Leads Metric**

- **Purpose**: Shows new lead acquisition count
- **Working**:
  - Purple color scheme for lead metric
  - Displays total new leads (12)
  - Uses purple gradient background
- **Styling**: Purple gradient background with purple text and indicator

### 6. Visual Design Functions

#### **Gradient Styling System**

- **Purpose**: Provides consistent gradient styling across components
- **Working**:
  - Each action has unique gradient color scheme
  - Summary metrics use color-coded gradients
  - Creates visual hierarchy and categorization
- **Gradient Schemes**:
  - Purple: Add Customer, New Leads
  - Green: Send Messages, Sales Target
  - Blue: Generate Report, Calls Made
  - Orange: View Analytics
  - Emerald: Summary header

#### **Glass Morphism Effect**

- **Purpose**: Creates modern, visually appealing interface
- **Working**:
  - Semi-transparent white background
  - Backdrop blur effect
  - Subtle borders and shadows
- **Styling**: `bg-white/80 backdrop-blur-sm` with border and shadow

#### **Hover and Transition Effects**

- **Purpose**: Provides interactive feedback for user actions
- **Working**:
  - Hover opacity changes for buttons
  - Shadow transitions on hover
  - Smooth duration transitions
- **Effects**: Opacity changes, shadow elevation, smooth transitions

### 7. Layout and Spacing Functions

#### **Container Layout**

- **Purpose**: Organizes component content with proper spacing
- **Working**:
  - Rounded corners with shadow
  - Proper padding and margins
  - Responsive spacing
- **Layout**: Centered content with consistent spacing

#### **Action Button Spacing**

- **Purpose**: Provides proper spacing between action buttons
- **Working**:
  - Vertical spacing between buttons
  - Consistent button heights
  - Proper internal padding
- **Spacing**: `space-y-3` for vertical spacing

#### **Summary Section Separation**

- **Purpose**: Visually separates summary from actions
- **Working**:
  - Top border with subtle color
  - Proper margin and padding
  - Clear visual hierarchy
- **Separation**: Border top with margin and padding

### 8. Icon Integration Functions

#### **Icon Usage**

- **Purpose**: Provides visual context for actions and metrics
- **Working**:
  - Uses Lucide React icons throughout
  - Consistent icon sizing and styling
  - Proper icon-background contrast
- **Icon Types**:
  - Action icons: Plus, MessageCircle, Download, BarChart3
  - Header icons: Settings, TrendingUp
  - Metric indicators: Colored dots

#### **Icon Styling**

- **Purpose**: Ensures consistent icon appearance
- **Working**:
  - White icons on gradient backgrounds
  - Consistent sizing (h-4 w-4, h-5 w-5)
  - Proper contrast and visibility
- **Styling**: White icons with consistent sizing

### Flow/Sequence (High Level):

1. **Component Rendering**:
   - Renders header with title and icon
   - Maps through actions array to create buttons
   - Renders summary section with metrics
2. **User Interaction**:
   - User clicks action buttons
   - Actions execute respective functions
   - Visual feedback through hover effects
3. **Data Display**:
   - Shows daily performance metrics
   - Updates summary information
   - Provides visual progress indicators

### Key Features:

- **Quick Access**: Streamlined access to common CRM operations
- **Visual Hierarchy**: Clear organization of actions and metrics
- **Performance Tracking**: Daily summary with key metrics
- **Modern Design**: Glass morphism effects and gradient styling
- **Interactive Elements**: Hover effects and smooth transitions
- **Responsive Layout**: Proper spacing and organization
- **Color Coding**: Consistent color schemes for different action types
- **Integration Ready**: Prepared for connection to actual functionality

Refer to `QuickActions.tsx` for specific implementation details, styling, and component structure.

---

## RejectionPage.tsx – Functions & Workflow

The `RejectionPage.tsx` component handles the user experience when their application has been rejected by an admin. It provides detailed feedback about the rejection, displays user profile information, and manages navigation flow based on user status changes. Below is a comprehensive breakdown of all functions and their workflow:

### 1. Component State Management

#### **UserProfile Interface**

- **Purpose**: Defines the structure of user profile data
- **Properties**:
  - `id`, `user_name`, `email`, `contact_no`, `address`, `city`, `state`, `pincode`, `dob`, `role`
  - `approval_status`: 'pending' | 'approved' | 'rejected'
  - `status`: 'active' | 'hold' | 'suspend'
  - `status_reason`: Optional reason for rejection/hold/suspend
  - `employee_id`, `joining_date`, `hold_days`, `hold_start_date`, `created_at`
- **Working**: Provides type safety and structure for user profile data
- **Integration**: Used throughout the component for data handling and display

#### **State Variables**

- **`profile`**: Stores the current user's profile data
- **`loading`**: Manages loading state during data fetching
- **`error`**: Handles error messages for user feedback
- **Working**: Manages component state and user experience during data operations

### 2. Data Fetching and Profile Management

#### **fetchUserProfile Function**

- **Purpose**: Fetches user profile data from Supabase database
- **Working**:
  - Queries `user_profiles` table using authenticated user ID
  - Handles database errors and sets error state
  - Implements automatic redirection logic based on approval status
  - Updates profile state with fetched data
- **Flow**:
  1. Checks if user exists
  2. Queries database for user profile
  3. Handles errors and sets error state
  4. Updates profile state
  5. Redirects based on approval status if not rejected
- **Integration**: Called in useEffect and real-time subscription handlers

### 3. Authentication and Navigation Flow

#### **useEffect Hook (Main Logic)**

- **Purpose**: Manages component lifecycle, authentication, and real-time updates
- **Working**:
  - Waits for authentication to complete
  - Redirects to login if no user exists
  - Fetches user profile when user is available
  - Sets up real-time subscription for profile updates
  - Handles cleanup on component unmount
- **Flow**:
  1. Debug logging for troubleshooting
  2. Wait for auth loading to complete
  3. Redirect to login if no user
  4. Fetch profile if user exists
  5. Set up real-time subscription
  6. Clean up subscription on unmount
- **Real-time Features**: Listens for profile updates and redirects accordingly

#### **Real-time Subscription**

- **Purpose**: Provides live updates when admin changes user status
- **Working**:
  - Subscribes to `user_profiles` table updates
  - Filters updates for current user only
  - Automatically redirects based on status changes
  - Updates local profile state
- **Events Handled**:
  - Approval status changes (pending → approved)
  - Status changes (active, hold, suspend)
  - Automatic redirection to appropriate pages

### 4. User Interface Helper Functions

#### **handleBackToLogin Function**

- **Purpose**: Handles user logout and navigation to login page
- **Working**:
  - Calls signOut from auth context
  - Navigates to login page
  - Handles errors with fallback navigation
- **Flow**:
  1. Attempt to sign out user
  2. Navigate to login page
  3. Handle errors gracefully
- **Integration**: Connected to logout button in UI

#### **getRoleColor Function**

- **Purpose**: Returns appropriate CSS classes for role-based styling
- **Parameters**: `role` (string) - User's role
- **Working**:
  - Maps roles to specific color schemes
  - Returns Tailwind CSS classes for consistent styling
- **Role Mappings**:
  - `admin`: Red color scheme
  - `manager`: Blue color scheme
  - `supervisor`: Purple color scheme
  - `employee`: Gray color scheme (default)
- **Integration**: Used in role badge display

#### **getRoleLabel Function**

- **Purpose**: Converts role codes to human-readable labels
- **Parameters**: `role` (string) - User's role code
- **Working**:
  - Maps role codes to display names
  - Capitalizes first letter for consistency
- **Role Mappings**:
  - `admin` → 'Admin'
  - `manager` → 'Manager'
  - `supervisor` → 'Supervisor'
  - `employee` → 'Employee'
- **Integration**: Used in role badge text display

### 5. Conditional Rendering and User Experience

#### **Loading State Management**

- **Purpose**: Provides user feedback during data loading
- **Working**:
  - Shows spinner while auth or profile is loading
  - Displays loading message
  - Prevents premature rendering
- **UI Elements**:
  - Animated spinner
  - Loading message
  - Centered layout

#### **Error State Handling**

- **Purpose**: Manages various error scenarios
- **Scenarios**:
  - No authenticated user (session expired)
  - Profile not found
  - Database errors
- **Working**:
  - Shows appropriate error messages
  - Provides action buttons for recovery
  - Maintains user-friendly interface
- **Error Types**:
  - Session expired → Login button
  - Profile not found → Profile completion button
  - General errors → Error message display

#### **Status-based Redirection Logic**

- **Purpose**: Automatically redirects users based on their current status
- **Working**:
  - Checks approval status and user status
  - Redirects to appropriate pages
  - Prevents rendering if redirecting
- **Redirection Rules**:
  - `approved` + `active` → Dashboard (/)
  - `approved` + `hold` → Hold page (/hold)
  - `approved` + `suspend` → Suspended page (/suspended)
  - `pending` → Approval pending page (/approval-pending)
  - `rejected` → Stay on rejection page

### 6. User Interface Components

#### **Rejection Information Display**

- **Purpose**: Shows rejection details and reason
- **Working**:
  - Displays rejection status with icon
  - Shows rejection reason if available
  - Provides default message if no reason
- **UI Elements**:
  - Red warning icon
  - Rejection status badge
  - Reason text in highlighted box
  - Default guidance messages

#### **Profile Details Section**

- **Purpose**: Displays user's profile information
- **Working**:
  - Shows comprehensive profile data
  - Uses icons for visual clarity
  - Organizes information in grid layout
- **Information Displayed**:
  - Personal details (name, email, phone)
  - Role with color-coded badge
  - Location information (city, state, pincode)
  - Date of birth
- **Layout**: Responsive grid with icon-text pairs

#### **Action Buttons**

- **Purpose**: Provides user actions and navigation
- **Buttons**:
  - "Back to Login" - Logout and return to login
  - Support contact information
- **Working**:
  - Handles logout functionality
  - Provides support guidance
  - Maintains consistent styling

### 7. Flow and Sequence (High Level)

#### **Component Mount Flow**:

1. **Authentication Check**: Wait for auth loading to complete
2. **User Validation**: Redirect to login if no user exists
3. **Profile Fetching**: Load user profile from database
4. **Status Validation**: Redirect if not rejected
5. **Real-time Setup**: Subscribe to profile updates
6. **UI Rendering**: Display rejection page with profile details

#### **Real-time Update Flow**:

1. **Profile Change**: Admin updates user status
2. **Database Trigger**: Supabase sends update event
3. **Component Update**: Local state updated with new data
4. **Status Check**: Evaluate new approval/status
5. **Auto-redirect**: Navigate to appropriate page if status changed

#### **User Interaction Flow**:

1. **View Rejection**: User sees rejection details and profile
2. **Review Information**: User can review their submitted data
3. **Contact Support**: User can contact support if needed
4. **Logout**: User can return to login page
5. **Re-application**: User can reapply after addressing issues

### Key Features:

- **Real-time Updates**: Live status changes without page refresh
- **Comprehensive Error Handling**: Graceful handling of all error scenarios
- **User-friendly Interface**: Clear rejection feedback with profile details
- **Automatic Navigation**: Smart redirection based on status changes
- **Responsive Design**: Mobile-optimized layout and styling
- **Security Integration**: Proper authentication and session management
- **Database Integration**: Secure profile data fetching and updates
- **Visual Feedback**: Icons, colors, and badges for clear status indication
- **Support Integration**: Clear guidance for user support and re-application

### Integration Points:

- **AuthContext**: User authentication and logout functionality
- **Supabase**: Database queries and real-time subscriptions
- **React Router**: Navigation and routing management
- **Lucide Icons**: Consistent iconography throughout the interface
- **Tailwind CSS**: Responsive styling and design system

Refer to `RejectionPage.tsx` for specific implementation details, styling, and component structure.

---

## StatsCards.tsx – Functions & Workflow

The `StatsCards.tsx` component provides a comprehensive dashboard widget that displays key performance indicators (KPIs) and metrics across three main categories: Customer Overview, Sales Performance, and Call Management. It offers an interactive interface with visual charts, trend indicators, and clickable tiles for detailed analysis. Below is a detailed breakdown of all functions and their workflow:

### 1. Component Interface and Props

#### **StatsCardsProps Interface**

- **Purpose**: Defines the component's external interface for parent component integration
- **Properties**:
  - `onTileClick?: (type: string) => void` - Optional callback function for tile click events
- **Working**: Enables parent components to handle specific tile interactions and navigation
- **Integration**: Connects with parent component's navigation or detail view logic

### 2. Data Configuration and Structure

#### **Main Stats Array (Customer Overview)**

- **Purpose**: Defines customer-related metrics and KPIs
- **Properties per stat**:
  - `title`: Display name for the metric
  - `value`: Current numerical value
  - `change`: Change indicator (percentage or descriptive text)
  - `changeType`: Visual indicator type ('increase', 'warning', 'neutral')
  - `icon`: Lucide React icon component
  - `gradient`: CSS gradient classes for styling
  - `color`: Text color classes
- **Metrics Included**:
  1. **Total Customers**: 1,234 (+12% increase)
  2. **Expiring This Month**: 28 (7 days left warning)
  3. **Upcoming Policy**: 45 (Current + Next Month neutral)
  4. **Active Policy**: 1,156 (+8.2% increase)
  5. **Rejected/Expired**: 23 (-5% warning)

#### **Sales Stats Array (Sales Performance)**

- **Purpose**: Defines sales and revenue-related metrics
- **Metrics Included**:
  1. **Sales Gross**: ₹2,45,000 (+15.3% increase)
  2. **Sales Net**: ₹1,98,500 (+12.8% increase)
  3. **Cases**: 156 (+8.5% increase)
  4. **Earned**: ₹45,200 (+18.2% increase)
  5. **Discount**: ₹12,300 (-2.1% warning)

#### **Call Stats Array (Call Management)**

- **Purpose**: Defines call management and lead tracking metrics
- **Metrics Included**:
  1. **Today's Calls**: 47 (+15% increase)
  2. **Connected Calls**: 38 (+8% increase)
  3. **Interested Leads**: 12 (+25% increase)
  4. **Follow-up Required**: 8 (-10% warning)

### 3. Visual Design and Layout Functions

#### **Responsive Layout System**

- **Purpose**: Provides adaptive layout for different screen sizes
- **Working**:
  - Mobile: Transparent background, minimal padding, 2-column grid
  - Desktop: White/transparent background with backdrop blur, 4-column grid
  - Full-width cards for primary metrics (Total Customers, Sales Net)
  - Grid layout for secondary metrics
- **CSS Classes**: Uses Tailwind responsive prefixes (md:, lg:)

#### **Gradient and Color System**

- **Purpose**: Provides consistent visual hierarchy and branding
- **Working**:
  - Each metric has unique gradient colors
  - Color coding based on metric type and performance
  - Glass morphism effects with backdrop blur
  - Hover effects with shadow transitions
- **Color Schemes**:
  - Blue gradients for customer metrics
  - Green/emerald gradients for sales metrics
  - Teal/purple gradients for call metrics
  - Red/orange for warning states

#### **Icon Integration**

- **Purpose**: Provides visual context for each metric
- **Working**:
  - Uses Lucide React icons for consistency
  - Icons are dynamically rendered using React.createElement
  - Icon containers with gradient backgrounds
  - Responsive sizing (smaller on mobile, larger on desktop)

### 4. Interactive Features and Event Handling

#### **Tile Click Functionality**

- **Purpose**: Enables detailed view navigation for each metric
- **Working**:
  - Converts metric titles to URL-friendly format
  - Calls parent component's onTileClick callback
  - Provides hover effects and cursor pointer
  - Maintains accessibility with proper click targets
- **Title Transformation**:
  - "Total Customers" → "total_customers"
  - "Sales Net" → "sales_net"
  - "Today's Calls" → "today's_calls"

#### **Hover and Transition Effects**

- **Purpose**: Enhances user experience with visual feedback
- **Working**:
  - Smooth transitions on hover (300ms duration)
  - Shadow elevation changes
  - Group hover effects for coordinated animations
  - Backdrop blur and transparency effects

### 5. Chart and Visual Elements

#### **SVG Bar Charts**

- **Purpose**: Provides visual representation of trends
- **Working**:
  - Custom SVG charts for primary metrics
  - 7-day trend visualization with gradient bars
  - Responsive sizing and positioning
  - Hidden on mobile, visible on desktop
- **Chart Features**:
  - Linear gradients for bar styling
  - Rounded corners for modern appearance
  - Progressive height bars showing trend
  - White overlay with opacity for glass effect

#### **Trend Indicators**

- **Purpose**: Shows performance direction and change
- **Working**:
  - ArrowUpRight for positive changes (green)
  - ArrowDownRight for negative changes (orange)
  - Badge components with color-coded backgrounds
  - Percentage and descriptive change text
- **Indicator Types**:
  - `increase`: Green color scheme with up arrow
  - `warning`: Orange color scheme with down arrow
  - `neutral`: Gray color scheme with no arrow

### 6. Component Structure and Organization

#### **Section Organization**

- **Purpose**: Groups related metrics into logical sections
- **Sections**:
  1. **Customer Overview**: Customer-related metrics with full-width primary card
  2. **Sales Performance**: Revenue and sales metrics with full-width primary card
  3. **Call Management**: Call tracking metrics in grid layout
- **Working**: Each section has its own container with consistent styling and spacing

#### **Card Hierarchy**

- **Purpose**: Establishes visual importance and information hierarchy
- **Levels**:
  1. **Primary Cards**: Full-width, prominent display with charts
  2. **Secondary Cards**: Grid layout, compact display
  3. **Section Headers**: Icon and title for each section
- **Working**: Uses different sizes, gradients, and layouts to show importance

### 7. Responsive Design Implementation

#### **Mobile-First Approach**

- **Purpose**: Ensures optimal experience across all devices
- **Working**:
  - Transparent backgrounds on mobile
  - 2-column grid for secondary metrics
  - Simplified layouts without charts
  - Touch-friendly click targets
- **Breakpoints**: Uses md: prefix for desktop enhancements

#### **Desktop Enhancements**

- **Purpose**: Provides richer experience on larger screens
- **Working**:
  - Backdrop blur and glass morphism effects
  - 4-column grid layouts
  - SVG charts and visual elements
  - Enhanced hover effects and animations
- **Features**: Larger icons, more spacing, visual charts

### 8. Data Flow and Integration

#### **Static Data Configuration**

- **Purpose**: Provides mock data for demonstration and development
- **Working**:
  - Hardcoded values for immediate display
  - Realistic business metrics and percentages
  - Consistent data structure across all arrays
  - Ready for API integration
- **Integration Points**: Can be easily replaced with dynamic data fetching

#### **Parent Component Communication**

- **Purpose**: Enables parent components to handle user interactions
- **Working**:
  - Optional callback prop for tile clicks
  - String-based identification system
  - Flexible integration with routing or modal systems
- **Use Cases**: Navigation to detail pages, opening modals, filtering data

### 9. Accessibility and User Experience

#### **Visual Accessibility**

- **Purpose**: Ensures component is usable by all users
- **Working**:
  - High contrast colors and gradients
  - Clear typography hierarchy
  - Consistent icon usage
  - Proper spacing and touch targets
- **Features**: Color-coded badges, clear labels, responsive text sizes

#### **Interactive Accessibility**

- **Purpose**: Provides clear feedback for user interactions
- **Working**:
  - Hover states for all clickable elements
  - Cursor pointer indication
  - Smooth transitions and animations
  - Clear visual hierarchy
- **Feedback**: Shadow changes, color transitions, icon animations

### 10. Flow and Sequence (High Level)

#### **Component Rendering Flow**:

1. **Props Processing**: Receives onTileClick callback from parent
2. **Data Configuration**: Sets up three metric arrays with styling
3. **Layout Rendering**: Creates responsive grid and card layouts
4. **Visual Elements**: Renders icons, charts, and trend indicators
5. **Interactive Setup**: Configures click handlers and hover effects
6. **Responsive Application**: Applies mobile/desktop specific styles

#### **User Interaction Flow**:

1. **View Metrics**: User sees organized dashboard with three sections
2. **Hover Feedback**: Visual feedback on hover with transitions
3. **Click Action**: User clicks on metric tile
4. **Callback Execution**: Parent component receives tile type
5. **Navigation/Detail**: Parent handles navigation or detail view
6. **Return**: User returns to dashboard with updated context

#### **Data Update Flow** (Future Integration):

1. **API Call**: Component receives updated data from parent
2. **State Update**: Metric values and trends are updated
3. **Re-render**: Component re-renders with new data
4. **Visual Update**: Charts and indicators reflect new values
5. **User Feedback**: Updated metrics are displayed to user

### Key Features:

- **Comprehensive Metrics**: Three categories covering all business aspects
- **Visual Hierarchy**: Clear primary/secondary metric distinction
- **Interactive Design**: Clickable tiles with hover effects
- **Responsive Layout**: Optimized for mobile and desktop
- **Modern Styling**: Glass morphism and gradient effects
- **Trend Visualization**: SVG charts and trend indicators
- **Accessibility**: High contrast and clear visual feedback
- **Integration Ready**: Flexible callback system for parent components
- **Performance Optimized**: Efficient rendering with React.createElement
- **Consistent Design**: Unified color scheme and spacing system

### Integration Points:

- **Parent Components**: Dashboard, analytics pages, admin panels
- **Navigation System**: React Router for detail page navigation
- **Data Sources**: API endpoints, real-time data streams
- **UI Components**: Card, Badge, and icon libraries
- **Styling System**: Tailwind CSS for responsive design
- **Icon System**: Lucide React for consistent iconography

### Future Enhancement Opportunities:

- **Real-time Data**: WebSocket integration for live updates
- **Customizable Metrics**: User-configurable dashboard
- **Drill-down Views**: Detailed analysis for each metric
- **Export Functionality**: PDF/Excel export capabilities
- **Comparison Views**: Period-over-period comparisons
- **Alert System**: Threshold-based notifications

Refer to `StatsCards.tsx` for specific implementation details, styling, and component structure.

---

## SuspendedUser.tsx – Functions & Workflow

The `SuspendedUser.tsx` component handles the user experience when their account has been suspended by an admin. It provides detailed feedback about the suspension, displays user profile information, and manages navigation flow based on user status changes. This component ensures suspended users understand their account status and provides clear guidance for resolution. Below is a comprehensive breakdown of all functions and their workflow:

### 1. Component State Management

#### **UserProfile Interface**

- **Purpose**: Defines the structure of user profile data
- **Properties**:
  - `id`, `user_name`, `email`, `contact_no`, `address`, `city`, `state`, `pincode`, `dob`, `role`
  - `approval_status`: 'pending' | 'approved' | 'rejected'
  - `status`: 'active' | 'hold' | 'suspend'
  - `status_reason`: Optional reason for suspension
  - `employee_id`, `joining_date`, `hold_days`, `hold_start_date`, `created_at`
- **Working**: Provides type safety and structure for user profile data
- **Integration**: Used throughout the component for data handling and display

#### **State Variables**

- **`profile`**: Stores the current user's profile data
- **`loading`**: Manages loading state during data fetching
- **`error`**: Handles error messages for user feedback
- **Working**: Manages component state and user experience during data operations

### 2. Data Fetching and Profile Management

#### **fetchUserProfile Function**

- **Purpose**: Fetches user profile data from Supabase database
- **Working**:
  - Queries `user_profiles` table using authenticated user ID
  - Handles database errors and sets error state
  - Updates profile state with fetched data
  - Does not implement redirection logic (handled in useEffect)
- **Flow**:
  1. Checks if user exists
  2. Queries database for user profile
  3. Handles errors and sets error state
  4. Updates profile state
  5. Sets loading to false
- **Integration**: Called in useEffect hook

### 3. Authentication and Navigation Flow

#### **useEffect Hook (Main Logic)**

- **Purpose**: Manages component lifecycle, authentication, and real-time updates
- **Working**:
  - Waits for authentication to complete
  - Redirects to login if no user exists
  - Fetches user profile when user is available
  - Sets up real-time subscription for profile updates
  - Handles cleanup on component unmount
- **Flow**:
  1. Wait for auth loading to complete
  2. Redirect to login if no user
  3. Fetch profile if user exists
  4. Set up real-time subscription
  5. Clean up subscription on unmount
- **Real-time Features**: Listens for profile updates and redirects accordingly

#### **Real-time Subscription**

- **Purpose**: Provides live updates when admin changes user status
- **Working**:
  - Subscribes to `user_profiles` table updates
  - Filters updates for current user only
  - Automatically redirects based on status changes
  - Updates local profile state
- **Events Handled**:
  - Status changes from 'suspend' to 'active' → Dashboard (/)
  - Status changes to 'approved' → Dashboard (/)
  - Status changes to 'hold' → Approval pending page (/approval-pending)
- **Redirection Logic**: Handles status transitions from suspension

### 4. User Interface Helper Functions

#### **handleBackToLogin Function**

- **Purpose**: Handles user logout and navigation to login page
- **Working**:
  - Calls signOut from auth context
  - Navigates to login page
  - Handles errors with fallback navigation
- **Flow**:
  1. Attempt to sign out user
  2. Navigate to login page
  3. Handle errors gracefully
- **Integration**: Connected to logout button in UI

#### **getRoleColor Function**

- **Purpose**: Returns appropriate CSS classes for role-based styling
- **Parameters**: `role` (string) - User's role
- **Working**:
  - Maps roles to specific color schemes
  - Returns Tailwind CSS classes for consistent styling
- **Role Mappings**:
  - `admin`: Red color scheme
  - `manager`: Blue color scheme
  - `supervisor`: Purple color scheme
  - `employee`: Gray color scheme (default)
- **Integration**: Used in role badge display

#### **getRoleLabel Function**

- **Purpose**: Converts role codes to human-readable labels
- **Parameters**: `role` (string) - User's role code
- **Working**:
  - Maps role codes to display names
  - Capitalizes first letter for consistency
- **Role Mappings**:
  - `admin` → 'Admin'
  - `manager` → 'Manager'
  - `supervisor` → 'Supervisor'
  - `employee` → 'Employee'
- **Integration**: Used in role badge text display

### 5. Conditional Rendering and User Experience

#### **Loading State Management**

- **Purpose**: Provides user feedback during data loading
- **Working**:
  - Shows spinner while auth or profile is loading
  - Displays loading message specific to account status
  - Prevents premature rendering
- **UI Elements**:
  - Animated spinner with indigo color
  - Loading message: "Loading your account status..."
  - Centered layout

#### **Error State Handling**

- **Purpose**: Manages various error scenarios
- **Scenarios**:
  - No authenticated user (session expired)
  - Profile not found
  - Database errors
- **Working**:
  - Shows appropriate error messages
  - Provides action buttons for recovery
  - Maintains user-friendly interface
- **Error Types**:
  - Session expired → Login button
  - Profile not found → Profile completion button
  - General errors → Error message display

#### **Status-based Redirection Logic**

- **Purpose**: Automatically redirects users based on their current status
- **Working**:
  - Checks approval status and user status
  - Redirects to appropriate pages
  - Prevents rendering if redirecting
- **Redirection Rules**:
  - `active` or `approved` → Dashboard (/)
  - `hold` → Approval pending page (/approval-pending)
  - `suspend` → Stay on suspended page
  - Other statuses → Approval pending page (/approval-pending)

### 6. User Interface Components

#### **Suspension Information Display**

- **Purpose**: Shows suspension details and reason
- **Working**:
  - Displays suspension status with red warning icon
  - Shows suspension reason if available
  - Provides default guidance messages
- **UI Elements**:
  - Red XCircle icon
  - Suspension status badge
  - Reason text in highlighted box
  - Default guidance messages
- **Content**:
  - "Your account has been suspended indefinitely"
  - "Please contact support for assistance"
  - "You cannot access the system until suspension is lifted"

#### **Profile Details Section**

- **Purpose**: Displays user's profile information
- **Working**:
  - Shows comprehensive profile data
  - Uses icons for visual clarity
  - Organizes information in grid layout
- **Information Displayed**:
  - Personal details (name, email, phone)
  - Role with color-coded badge
  - Location information (city, state, pincode)
  - Date of birth
- **Layout**: Responsive grid with icon-text pairs

#### **Action Buttons**

- **Purpose**: Provides user actions and navigation
- **Buttons**:
  - "Back to Login" - Logout and return to login
  - Support contact information
- **Working**:
  - Handles logout functionality
  - Provides support guidance
  - Maintains consistent styling with red theme

### 7. Visual Design and Styling

#### **Color Scheme**

- **Purpose**: Provides consistent visual feedback for suspension status
- **Working**:
  - Red color scheme throughout (red-50, red-600, red-700)
  - Warning and alert styling
  - High contrast for accessibility
- **Elements**:
  - Background: Red-50 for warning areas
  - Text: Red-700 for content, red-600 for icons
  - Buttons: Red-600 with red-700 hover
  - Borders: Red-100 for subtle definition

#### **Layout and Spacing**

- **Purpose**: Creates clean, organized interface
- **Working**:
  - Centered layout with max-width container
  - Consistent padding and margins
  - Responsive grid for profile details
  - Proper spacing between sections
- **Features**:
  - White background with shadow
  - Rounded corners for modern appearance
  - Proper visual hierarchy

### 8. Flow and Sequence (High Level)

#### **Component Mount Flow**:

1. **Authentication Check**: Wait for auth loading to complete
2. **User Validation**: Redirect to login if no user exists
3. **Profile Fetching**: Load user profile from database
4. **Status Validation**: Redirect if not suspended
5. **Real-time Setup**: Subscribe to profile updates
6. **UI Rendering**: Display suspension page with profile details

#### **Real-time Update Flow**:

1. **Profile Change**: Admin updates user status
2. **Database Trigger**: Supabase sends update event
3. **Component Update**: Local state updated with new data
4. **Status Check**: Evaluate new status
5. **Auto-redirect**: Navigate to appropriate page if status changed

#### **User Interaction Flow**:

1. **View Suspension**: User sees suspension details and profile
2. **Review Information**: User can review their account details
3. **Contact Support**: User can contact support for assistance
4. **Logout**: User can return to login page
5. **Resolution**: Admin can lift suspension, user gets redirected

### 9. Error Handling and Edge Cases

#### **Database Connection Issues**

- **Purpose**: Handles database connectivity problems
- **Working**:
  - Catches database errors in try-catch blocks
  - Sets error state for user feedback
  - Provides fallback navigation options
- **User Experience**: Clear error messages with recovery options

#### **Authentication Edge Cases**

- **Purpose**: Handles various authentication scenarios
- **Scenarios**:
  - Session expiration
  - Invalid tokens
  - Network connectivity issues
- **Working**:
  - Graceful handling of auth failures
  - Automatic redirection to login
  - Clear error messaging

#### **Profile Data Edge Cases**

- **Purpose**: Handles missing or incomplete profile data
- **Scenarios**:
  - Profile not found
  - Incomplete profile information
  - Corrupted profile data
- **Working**:
  - Validation of profile existence
  - Fallback to profile completion
  - Error state management

### 10. Integration and Dependencies

#### **Authentication Integration**

- **Purpose**: Seamless integration with auth system
- **Working**:
  - Uses AuthContext for user state
  - Handles signOut functionality
  - Manages authentication loading states
- **Dependencies**: AuthContext, useAuth hook

#### **Database Integration**

- **Purpose**: Real-time data synchronization
- **Working**:
  - Supabase client for database queries
  - Real-time subscriptions for live updates
  - Error handling for database operations
- **Dependencies**: Supabase client, user_profiles table

#### **Navigation Integration**

- **Purpose**: Seamless routing and navigation
- **Working**:
  - React Router for navigation
  - Programmatic navigation based on status
  - Route protection and redirection
- **Dependencies**: React Router, useNavigate hook

### Key Features:

- **Real-time Updates**: Live status changes without page refresh
- **Comprehensive Error Handling**: Graceful handling of all error scenarios
- **User-friendly Interface**: Clear suspension feedback with profile details
- **Automatic Navigation**: Smart redirection based on status changes
- **Responsive Design**: Mobile-optimized layout and styling
- **Security Integration**: Proper authentication and session management
- **Database Integration**: Secure profile data fetching and updates
- **Visual Feedback**: Icons, colors, and badges for clear status indication
- **Support Integration**: Clear guidance for user support and resolution
- **Accessibility**: High contrast colors and clear visual hierarchy

### Integration Points:

- **AuthContext**: User authentication and logout functionality
- **Supabase**: Database queries and real-time subscriptions
- **React Router**: Navigation and routing management
- **Lucide Icons**: Consistent iconography throughout the interface
- **Tailwind CSS**: Responsive styling and design system

### Security Considerations:

- **Authentication Required**: Only authenticated users can access
- **Status Validation**: Ensures only suspended users see this page
- **Real-time Security**: Secure database subscriptions
- **Session Management**: Proper logout and session handling
- **Data Protection**: Secure profile data handling

### Future Enhancement Opportunities:

- **Support Ticket Integration**: Direct support ticket creation
- **Suspension Timeline**: Show suspension duration and history
- **Appeal Process**: Allow users to submit appeals
- **Notification System**: Email/SMS notifications for status changes
- **Admin Communication**: Direct messaging with admin
- **Documentation Links**: Links to policies and procedures

Refer to `SuspendedUser.tsx` for specific implementation details, styling, and component structure.

---

## WhatsAppTemplates.tsx – Functions & Workflow

The `WhatsAppTemplates.tsx` component provides a comprehensive WhatsApp messaging interface for customer communication. It offers pre-built message templates for different scenarios (birthday, expiry, sales, festival, general), allows message customization, and integrates with WhatsApp Web for direct messaging. This component streamlines customer outreach and maintains consistent communication standards. Below is a detailed breakdown of all functions and their workflow:

### 1. Component Interface and Props

#### **Customer Interface**

- **Purpose**: Defines the structure of customer data for message personalization
- **Properties**:
  - `id`: Unique customer identifier
  - `name`: Customer's name for personalization
  - `contact`: Phone number for WhatsApp integration
  - `brand`: Vehicle brand for context
  - `model`: Vehicle model for context
  - `expiryDate`: Policy expiry date for reminders
  - `daysToExpiry`: Days remaining until expiry
- **Working**: Provides data structure for dynamic message content
- **Integration**: Used throughout templates for personalization

#### **WhatsAppTemplatesProps Interface**

- **Purpose**: Defines the component's external interface
- **Properties**:
  - `customer`: Customer object or null
  - `isOpen`: Boolean to control dialog visibility
  - `onClose`: Callback function to close the dialog
  - `messageType`: Optional message category ('general', 'birthday', 'expiry', 'sales', 'festival')
- **Working**: Enables parent components to control dialog state and pass customer data
- **Integration**: Connects with parent component's customer management logic

### 2. Template System and Data Structure

#### **Templates Object**

- **Purpose**: Centralized repository of all message templates
- **Working**:
  - Organized by message type categories
  - Each template contains title and message content
  - Dynamic content insertion using customer data
  - Emoji integration for visual appeal
- **Categories**:
  1. **Birthday Templates**: Birthday wishes with special offers
  2. **Expiry Templates**: Policy expiry reminders and early renewal benefits
  3. **Sales Templates**: Special discounts and follow-up messages
  4. **Festival Templates**: Festival greetings and New Year wishes
  5. **General Templates**: Check-in messages and service reminders

#### **Template Content Structure**

- **Purpose**: Standardized format for all message templates
- **Properties**:
  - `title`: Display name for the template
  - `message`: Full message content with placeholders
- **Working**:
  - Uses template literals for dynamic content
  - Includes customer data interpolation
  - Maintains consistent formatting and tone
- **Personalization**: Customer name, vehicle details, contact info, dates

### 3. State Management and User Interaction

#### **State Variables**

- **`selectedTemplate`**: Stores the currently selected template message
- **`customMessage`**: Stores user-entered custom message content
- **Working**: Manages user selections and custom input
- **Integration**: Controls UI display and message sending functionality

#### **Template Selection Logic**

- **Purpose**: Handles user template selection and display
- **Working**:
  - Updates selectedTemplate state on card click
  - Provides visual feedback for selected template
  - Enables message preview and editing
- **UI Feedback**: Border highlighting, selected badge, visual indicators

### 4. Visual Design and UI Components

#### **Template Icon System**

- **Purpose**: Provides visual context for different message types
- **Working**:
  - Maps message types to appropriate Lucide icons
  - Consistent iconography across the interface
  - Color-coded visual identification
- **Icon Mappings**:
  - `birthday`: Gift icon
  - `expiry`: AlertTriangle icon
  - `sales`: Percent icon
  - `festival`: Gift icon
  - `general`: MessageCircle icon

#### **Template Color System**

- **Purpose**: Provides consistent color coding for message categories
- **Working**:
  - Maps message types to specific color schemes
  - Returns Tailwind CSS classes for styling
  - Maintains visual hierarchy and categorization
- **Color Mappings**:
  - `birthday`: Purple color scheme
  - `expiry`: Red color scheme
  - `sales`: Green color scheme
  - `festival`: Orange color scheme
  - `general`: Blue color scheme

#### **Responsive Layout System**

- **Purpose**: Ensures optimal experience across all devices
- **Working**:
  - Mobile: Full-screen dialog with scrollable content
  - Desktop: Modal dialog with fixed dimensions
  - Grid layout for template cards
  - Responsive text sizing and spacing
- **Features**: Adaptive dialog sizing, scrollable content areas, touch-friendly interactions

### 5. Message Customization and Editing

#### **Template Preview System**

- **Purpose**: Allows users to preview and edit selected templates
- **Working**:
  - Displays full message content in preview area
  - Enables inline editing with textarea
  - Maintains formatting and line breaks
  - Real-time content updates
- **Features**: Syntax highlighting, whitespace preservation, scrollable preview

#### **Custom Message Input**

- **Purpose**: Enables users to write completely custom messages
- **Working**:
  - Textarea for custom message composition
  - Placeholder text for guidance
  - Character limit and formatting options
  - Integration with send functionality
- **Features**: Resize control, placeholder text, validation

#### **Message Validation**

- **Purpose**: Ensures valid content before sending
- **Working**:
  - Checks for non-empty message content
  - Disables send button for empty messages
  - Provides user feedback for validation
- **Validation Rules**: Must have either selected template or custom message

### 6. WhatsApp Integration and Communication

#### **sendWhatsApp Function**

- **Purpose**: Handles WhatsApp Web integration and message sending
- **Working**:
  - Cleans phone number (removes non-numeric characters)
  - URL-encodes message content
  - Constructs WhatsApp Web URL with phone and message
  - Opens WhatsApp in new browser tab/window
- **Flow**:
  1. Extract and clean phone number
  2. URL-encode message content
  3. Construct WhatsApp Web URL
  4. Open WhatsApp in new window
  5. Show success toast notification
  6. Close dialog
- **Integration**: WhatsApp Web API, browser window management

#### **Phone Number Processing**

- **Purpose**: Ensures proper phone number formatting for WhatsApp
- **Working**:
  - Removes all non-numeric characters
  - Adds country code (91 for India)
  - Validates phone number format
  - Handles international number formats
- **Format**: `91{cleaned_phone_number}`

#### **Message Encoding**

- **Purpose**: Ensures proper message transmission via URL
- **Working**:
  - URL-encodes message content
  - Preserves special characters and emojis
  - Handles line breaks and formatting
  - Maintains message integrity
- **Encoding**: Uses `encodeURIComponent()` for safe transmission

### 7. User Experience and Interface Design

#### **Dialog Management**

- **Purpose**: Provides modal interface for template selection
- **Working**:
  - Full-screen on mobile, modal on desktop
  - Scrollable content for long template lists
  - Proper focus management and accessibility
  - Smooth open/close animations
- **Features**: Responsive sizing, scrollable content, keyboard navigation

#### **Template Grid Layout**

- **Purpose**: Organizes templates in an accessible grid format
- **Working**:
  - Responsive grid (1 column mobile, 2 columns desktop)
  - Card-based template display
  - Hover effects and selection states
  - Truncated preview text with ellipsis
- **Layout**: CSS Grid with responsive breakpoints

#### **Visual Feedback System**

- **Purpose**: Provides clear user feedback for all interactions
- **Working**:
  - Hover effects on template cards
  - Selection highlighting with border and background
  - Selected badge for chosen templates
  - Toast notifications for actions
- **Feedback Types**: Visual selection, hover states, success notifications

### 8. Content Management and Template Organization

#### **Template Categorization**

- **Purpose**: Organizes templates by use case and context
- **Working**:
  - Groups related templates together
  - Provides context-specific messaging
  - Enables targeted communication
  - Maintains brand consistency
- **Categories**: Birthday, Expiry, Sales, Festival, General

#### **Dynamic Content Integration**

- **Purpose**: Personalizes messages with customer data
- **Working**:
  - Template literal interpolation
  - Customer data insertion
  - Vehicle information integration
  - Date and contact formatting
- **Personalization**: Name, vehicle details, contact info, dates

#### **Template Expansion System**

- **Purpose**: Allows easy addition of new templates
- **Working**:
  - Modular template structure
  - Easy addition of new categories
  - Consistent formatting standards
  - Maintainable code organization
- **Extensibility**: Simple array addition, consistent structure

### 9. Error Handling and Edge Cases

#### **Customer Data Validation**

- **Purpose**: Handles missing or invalid customer data
- **Working**:
  - Early return if no customer data
  - Graceful handling of missing fields
  - Fallback values for optional data
  - Error prevention in template rendering
- **Validation**: Customer existence, required fields, data types

#### **Phone Number Validation**

- **Purpose**: Ensures valid phone numbers for WhatsApp
- **Working**:
  - Cleans and formats phone numbers
  - Handles various input formats
  - Provides fallback for invalid numbers
  - Error handling for malformed data
- **Processing**: Regex cleaning, format validation, country code addition

#### **Message Content Validation**

- **Purpose**: Ensures valid message content before sending
- **Working**:
  - Checks for empty or invalid content
  - Validates message length and format
  - Prevents sending of empty messages
  - Provides user feedback for validation errors
- **Validation**: Content existence, length limits, format checking

### 10. Flow and Sequence (High Level)

#### **Component Initialization Flow**:

1. **Props Processing**: Receives customer data and dialog state
2. **Template Loading**: Loads appropriate templates based on message type
3. **UI Rendering**: Displays dialog with template grid and controls
4. **State Initialization**: Sets up selection and custom message states
5. **Event Binding**: Configures click handlers and form interactions

#### **Template Selection Flow**:

1. **User Interaction**: User clicks on template card
2. **State Update**: selectedTemplate state updated with message content
3. **UI Update**: Template card highlighted, preview area updated
4. **Message Display**: Full message shown in preview with editing capability
5. **Customization**: User can edit message or write custom content

#### **Message Sending Flow**:

1. **Content Validation**: Ensures valid message content exists
2. **Phone Processing**: Cleans and formats customer phone number
3. **Message Encoding**: URL-encodes message content for transmission
4. **WhatsApp Integration**: Opens WhatsApp Web with pre-filled message
5. **User Feedback**: Shows success notification and closes dialog
6. **Cleanup**: Resets component state for next use

### Key Features:

- **Comprehensive Template Library**: 10+ pre-built templates across 5 categories
- **Dynamic Personalization**: Customer data integration in all messages
- **WhatsApp Web Integration**: Direct messaging via WhatsApp Web
- **Message Customization**: Edit templates or write custom messages
- **Responsive Design**: Optimized for mobile and desktop
- **Visual Feedback**: Clear selection states and user feedback
- **Category Organization**: Logical grouping of message types
- **Emoji Integration**: Visual appeal with relevant emojis
- **Phone Number Processing**: Automatic formatting for WhatsApp
- **Toast Notifications**: User feedback for all actions
- **Accessibility**: Keyboard navigation and screen reader support
- **Error Handling**: Graceful handling of edge cases

### Integration Points:

- **Parent Components**: Customer management, CRM systems
- **WhatsApp Web**: Direct messaging integration
- **UI Components**: Dialog, Button, Textarea, Card, Badge
- **Toast System**: User notification system
- **Icon System**: Lucide React icons
- **Styling System**: Tailwind CSS for responsive design

### Business Value:

- **Customer Engagement**: Automated and personalized communication
- **Sales Support**: Template-based sales outreach
- **Policy Management**: Automated expiry reminders
- **Relationship Building**: Birthday and festival greetings
- **Efficiency**: Quick message composition and sending
- **Consistency**: Standardized communication templates
- **Professionalism**: Brand-consistent messaging

### Future Enhancement Opportunities:

- **Template Analytics**: Track template usage and effectiveness
- **A/B Testing**: Test different message variations
- **Scheduled Messaging**: Send messages at specific times
- **Bulk Messaging**: Send to multiple customers
- **Message History**: Track sent messages and responses
- **Template Editor**: Visual template creation interface
- **Integration APIs**: Connect with other messaging platforms
- **Customer Segmentation**: Templates based on customer segments

Refer to `WhatsAppTemplates.tsx` for specific implementation details, styling, and component structure.

---

# Pages ----------------------------------------------------------------

## AuthCallback.tsx – Functions & Workflow

The `AuthCallback.tsx` page handles the OAuth authentication callback process, primarily for Google sign-in authentication. It manages the redirection after successful authentication and handles any errors during the process.

## AuthCallback.tsx – Functions & Workflow

The `AuthCallback.tsx` page serves as the OAuth callback handler for authentication, primarily with Google. It processes the authentication response and manages user redirection. Below is a comprehensive breakdown of its functionality:

### 1. Component State Management

#### **AuthCallback Interface**

- **Purpose**: Defines the component's state structure
- **Properties**:
  - `loading`: Boolean indicating authentication processing
  - `error`: String for error message storage
  - `session`: User session data from OAuth provider
- **Working**: Manages component state during auth flow

#### **State Variables**

- **Purpose**: Manages component's runtime state
- **Variables**:
  - `loading`: Controls loading indicator
  - `error`: Stores error messages
  - `session`: Holds auth session data
- **Integration**: Used throughout auth flow

### 2. Authentication Processing

#### **useEffect Hook (Main Logic)**

- **Purpose**: Processes OAuth callback and manages auth flow
- **Working**:
  1. Extracts URL parameters
  2. Validates auth response
  3. Updates session state
  4. Handles redirections
- **Error Handling**: Captures and displays auth failures
- **Success Flow**: Automatic redirection to dashboard

#### **URL Parameter Processing**

- **Purpose**: Extracts and validates callback parameters
- **Working**:
  - Parses URL search parameters
  - Validates required parameters
  - Handles error parameters
  - Processes auth tokens
- **Parameters**:
  - `access_token`
  - `refresh_token`
  - `error`
  - `error_description`

### 3. Session Management

#### **Session Validation**

- **Purpose**: Validates and processes auth session
- **Working**:
  - Checks token validity
  - Updates session storage
  - Sets auth cookies if needed
  - Manages session persistence
- **Security**: Implements secure session handling

#### **Session Storage**

- **Purpose**: Manages persistent session data
- **Working**:
  - Stores tokens securely
  - Updates session state
  - Handles session expiry
  - Manages refresh flow

### 4. Error Handling

#### **Error Types**

- **Purpose**: Categorizes and handles different errors
- **Types**:
  - Authentication failures
  - Token validation errors
  - Network issues
  - Session storage errors
- **Handling**: Appropriate user feedback for each type

#### **Error Display**

- **Purpose**: Shows user-friendly error messages
- **Working**:
  - Clear error messaging
  - Recovery instructions
  - Retry options
  - Support contact info

### 5. Navigation Management

#### **Success Navigation**

- **Purpose**: Handles successful auth completion
- **Working**:
  - Redirects to dashboard
  - Updates auth state
  - Cleans up callback params
  - Ensures smooth transition

#### **Error Navigation**

- **Purpose**: Handles failed auth attempts
- **Working**:
  - Returns to login page
  - Preserves error context
  - Provides retry option
  - Clear user guidance

### 6. User Interface

#### **Loading State**

- **Purpose**: Shows auth processing status
- **Components**:
  - Spinner animation
  - Loading message
  - Progress indication
  - Abort option

#### **Error State**

- **Purpose**: Displays auth failures
- **Components**:
  - Error message
  - Retry button
  - Support links
  - Clear instructions

### 7. Security Measures

#### **Token Validation**

- **Purpose**: Ensures auth token security
- **Checks**:
  - Token integrity
  - Expiration validation
  - Scope verification
  - Signature validation

#### **Session Protection**

- **Purpose**: Secures user session
- **Measures**:
  - Secure cookie storage
  - XSS protection
  - CSRF prevention
  - Token encryption

### Flow/Sequence (High Level):

1. **Component Mount**:

   - Initialize state
   - Show loading indicator
   - Begin auth processing

2. **Parameter Processing**:

   - Extract URL parameters
   - Validate auth response
   - Check for errors

3. **Session Handling**:

   - Validate tokens
   - Update session state
   - Set persistence

4. **Navigation**:
   - Success → Dashboard
   - Error → Login page
   - Loading → Wait state

### Key Features:

- **Secure Auth Processing**: Safe token handling
- **Clear User Feedback**: Loading and error states
- **Automatic Redirection**: Smooth user flow
- **Error Recovery**: Clear recovery paths
- **Session Management**: Secure session handling
- **Progress Indication**: User-friendly loading
- **Security Measures**: Comprehensive protection

### Integration Points:

- **OAuth Provider**: Google auth integration
- **Session Storage**: Secure token storage
- **Navigation System**: Route management
- **UI Components**: Loading and error displays
- **Auth Context**: Global auth state

### Error Scenarios:

1. **Invalid Token**:

   - Clear error message
   - Return to login
   - Log failure

2. **Network Error**:

   - Retry option
   - Offline handling
   - Connection check

3. **Session Error**:

   - Clear session
   - Fresh login flow
   - Error logging

4. **Validation Error**:
   - Parameter check
   - Security validation
   - Error reporting

### Security Considerations:

- **Token Storage**: Secure storage methods
- **Parameter Validation**: Input sanitization
- **Session Security**: Proper session handling
- **Error Exposure**: Safe error messaging
- **CSRF Protection**: Security tokens
- **XSS Prevention**: Content security

## CallManagementPage.tsx – Functions & Workflow

The `CallManagementPage.tsx` component serves as the main interface for managing customer calls, providing a comprehensive call management system.

The `LandingPage.tsx` serves as the initial entry point for new visitors, providing a compelling introduction to the application's features and clear paths for authentication. Below is a comprehensive breakdown of its functionality:

### 1. Component Structure

#### **LandingPage Interface**

- **Purpose**: Defines the component's structure and props
- **Properties**:
  - `isAuthenticated`: Boolean for auth status
  - `redirectTo`: Optional redirect path
- **Working**: Controls component behavior based on auth state
- **Integration**: Connected to auth context for status
- **Navigation**: Links to auth pages
- **Content Display**: App features and benefits

### 2. User Experience

- **Clear CTA**: Prominent login/signup buttons
- **Feature Showcase**: App capabilities
- **Professional Design**: Polished appearance

### Flow/Sequence:

1. Visitor lands on page
2. Features/benefits displayed
3. Clear path to login/signup
4. Easy navigation options

## LoginPage.tsx – Functions & Workflow

The `LoginPage.tsx` page handles user authentication through both email/password and Google OAuth methods.

### 1. Core Functions & Logic

- **Form Handling**: Email/password input management
- **Validation**: Input validation and error handling
- **Auth Methods**: Email/password and Google OAuth
- **Redirect Logic**: Post-login navigation

### 2. User Experience

- **Clean Form**: Simple login interface
- **Alternative Auth**: Google sign-in option
- **Error Handling**: Clear error messages
- **Navigation**: Links to signup/forgot password

### Flow/Sequence:

1. User chooses auth method
2. Credentials entered/validated
3. Auth process completed
4. Redirect to dashboard

## NotFound.tsx – Functions & Workflow

The `NotFound.tsx` page handles 404 errors and provides a user-friendly error experience.

### 1. Core Functions & Logic

- **Error Display**: Shows 404 message
- **Navigation**: Provides return options
- **Layout**: Error-specific layout

### 2. User Experience

- **Clear Message**: Explains error
- **Return Options**: Easy navigation back
- **Professional Design**: Polished error page

### Flow/Sequence:

1. Invalid route accessed
2. 404 page displayed
3. Return options shown
4. User can navigate back

## Registration.tsx – Functions & Workflow

The `Registration.tsx` page manages user registration process with account creation and profile setup.

### 1. Core Functions & Logic

- **Form Handling**: Registration form management
- **Validation**: Input validation and error handling
- **Profile Creation**: Initial profile setup
- **Redirect Logic**: Post-registration flow

### 2. User Experience

- **Step Process**: Guided registration flow
- **Validation**: Real-time input validation
- **Feedback**: Clear error/success messages
- **Navigation**: Clear next steps

### Flow/Sequence:

1. User enters registration data
2. Data validated in real-time
3. Account created with profile
4. Redirect to approval pending

## ResetPassword.tsx – Functions & Workflow

The `ResetPassword.tsx` page handles the password reset process after a user clicks the reset link from their email.

### 1. Core Functions & Logic

- **Token Validation**: Verifies reset token
- **Password Update**: Handles password change
- **Response Handling**: Manages success/error states

### 2. User Experience

- **Password Form**: New password input
- **Validation**: Password requirements
- **Feedback**: Clear status messages

### Flow/Sequence:

1. Reset token validated
2. New password entered
3. Password updated
4. Redirect to login

## SignupPage.tsx – Functions & Workflow

The `SignupPage.tsx` page handles new user registration with email/password or Google OAuth methods.

### 1. Core Functions & Logic

- **Form Handling**: Signup form management
- **Validation**: Input validation rules
- **Auth Methods**: Email/password and Google OAuth
- **Profile Creation**: Initial profile setup

### 2. User Experience

- **Clear Form**: Simple signup interface
- **Alternative Auth**: Google signup option
- **Validation**: Real-time input checking
- **Navigation**: Clear process flow

### Flow/Sequence:

1. User chooses signup method
2. Required info entered
3. Account created
4. Redirect to profile setup

## UserDetails.tsx – Functions & Workflow

The `UserDetails.tsx` page shows detailed user profile information and allows profile management.

### 1. Core Functions & Logic

- **Data Loading**: Fetches user profile data
- **Edit Functions**: Profile update capabilities
- **Layout Integration**: Uses main app layout

### 2. User Experience

- **Profile Display**: Comprehensive user info
- **Edit Options**: Profile management tools
- **Navigation**: Easy return to list

### Flow/Sequence:

1. User profile loaded
2. Details displayed
3. Edit options available
4. Changes can be saved

---

# Contexts --------------------------------------------------------------

## AuthContext.tsx – Functions & Workflow

The `AuthContext.tsx` component provides a comprehensive authentication context for the entire application using Supabase Auth. It manages user authentication state, session handling, and provides authentication methods (sign in, sign up, Google OAuth, sign out) to all child components. This context ensures consistent authentication state across the application and handles real-time authentication changes. Below is a detailed breakdown of all functions and their workflow:

### 1. Context Interface and Type Definitions

#### **AuthContextType Interface**

- **Purpose**: Defines the structure and methods available in the authentication context
- **Properties**:
  - `user`: Current authenticated user (User | null)
  - `session`: Current authentication session (Session | null)
  - `loading`: Loading state for authentication operations (boolean)
  - `signIn`: Function to sign in with email and password
  - `signUp`: Function to sign up with email and password
  - `signInWithGoogle`: Function to sign in with Google OAuth
  - `signOut`: Function to sign out the current user
  - `checkUserExists`: Function to check if user profile exists in database
- **Working**: Provides type safety and consistent interface for authentication operations
- **Integration**: Used by all components that need authentication functionality

#### **AuthProviderProps Interface**

- **Purpose**: Defines props for the AuthProvider component
- **Properties**:
  - `children`: React children components to be wrapped by the provider
- **Working**: Enables the provider to wrap the entire application
- **Integration**: Used in main App component to provide authentication context

### 2. Context Creation and Hook Implementation

#### **AuthContext Creation**

- **Purpose**: Creates the React context for authentication
- **Working**:
  - Uses React.createContext with undefined initial value
  - Provides type safety with AuthContextType
  - Enables context consumption throughout the application
- **Integration**: Base for all authentication functionality

#### **useAuth Hook**

- **Purpose**: Custom hook for consuming authentication context
- **Working**:
  - Uses useContext to access AuthContext
  - Throws error if used outside AuthProvider
  - Returns authentication context with type safety
- **Error Handling**: Ensures hook is used within proper provider scope
- **Integration**: Used by all components needing authentication

### 3. State Management and Initialization

#### **State Variables**

- **`user`**: Stores current authenticated user object
- **`session`**: Stores current authentication session
- **`loading`**: Manages loading state during authentication operations
- **Working**: Manages authentication state across the application
- **Integration**: Provides real-time authentication state to all components

#### **useEffect Hook (Authentication Initialization)**

- **Purpose**: Initializes authentication state and sets up real-time listeners
- **Working**:
  - Gets initial session from Supabase
  - Sets up authentication state change listener
  - Handles cleanup on component unmount
- **Flow**:
  1. Initialize authentication state
  2. Get initial session from Supabase
  3. Set up real-time auth state listener
  4. Clean up subscription on unmount
- **Integration**: Core authentication lifecycle management

### 4. Authentication Methods

#### **signIn Function**

- **Purpose**: Handles user sign-in with email and password
- **Parameters**:
  - `email`: User's email address
  - `password`: User's password
- **Working**:
  - Calls Supabase auth.signInWithPassword
  - Returns error object for error handling
  - Updates authentication state automatically via listener
- **Return**: Promise with error object
- **Integration**: Used by login forms and authentication flows

#### **signUp Function**

- **Purpose**: Handles user registration with email and password
- **Parameters**:
  - `email`: User's email address
  - `password`: User's password
- **Working**:
  - Calls Supabase auth.signUp
  - Returns error object for error handling
  - Triggers email confirmation if enabled
- **Return**: Promise with error object
- **Integration**: Used by registration forms

#### **signInWithGoogle Function**

- **Purpose**: Handles Google OAuth authentication
- **Working**:
  - Calls Supabase auth.signInWithOAuth with Google provider
  - Configures OAuth options (redirect URL, access type, prompt)
  - Redirects to Google OAuth flow
- **OAuth Configuration**:
  - `redirectTo`: Auth callback URL
  - `access_type`: 'offline' for refresh tokens
  - `prompt`: 'consent' for fresh consent
- **Return**: Promise with error object
- **Integration**: Used by Google sign-in buttons

#### **signOut Function**

- **Purpose**: Handles user sign-out
- **Working**:
  - Calls Supabase auth.signOut
  - Clears authentication state automatically
  - Redirects user to appropriate page
- **Return**: Promise (void)
- **Integration**: Used by logout buttons and navigation

#### **checkUserExists Function**

- **Purpose**: Checks if user profile exists in database
- **Parameters**:
  - `userId`: User's unique identifier
- **Working**:
  - Queries user_profiles table for user existence
  - Returns boolean indicating profile existence
  - Handles errors gracefully
- **Return**: Promise<boolean>
- **Integration**: Used for profile completion checks

### 5. Authentication State Management

#### **Session Initialization**

- **Purpose**: Gets and sets initial authentication session
- **Working**:
  - Calls supabase.auth.getSession()
  - Sets session and user state
  - Handles initialization errors
  - Sets loading to false after completion
- **Error Handling**: Catches and logs initialization errors
- **Integration**: Part of authentication initialization flow

#### **Real-time Authentication Listener**

- **Purpose**: Listens for authentication state changes
- **Working**:
  - Uses supabase.auth.onAuthStateChange
  - Updates session and user state on changes
  - Handles sign in, sign out, and token refresh events
  - Provides real-time authentication updates
- **Events Handled**:
  - SIGNED_IN: User signs in
  - SIGNED_OUT: User signs out
  - TOKEN_REFRESHED: Session token refreshed
  - USER_UPDATED: User data updated
- **Integration**: Ensures consistent auth state across app

### 6. Error Handling and Logging

#### **Console Logging System**

- **Purpose**: Provides debugging information for authentication flow
- **Working**:
  - Logs authentication provider initialization
  - Tracks session retrieval and updates
  - Monitors authentication state changes
  - Helps with debugging authentication issues
- **Log Points**:
  - Provider initialization
  - Initial session retrieval
  - Auth state changes
  - User existence checks

#### **Error Handling Strategy**

- **Purpose**: Graceful handling of authentication errors
- **Working**:
  - Catches and logs authentication errors
  - Provides error objects to calling components
  - Maintains application stability during auth failures
  - Sets loading states appropriately
- **Error Types**:
  - Network errors
  - Authentication failures
  - Session retrieval errors
  - Database query errors

### 7. Context Provider Implementation

#### **AuthProvider Component**

- **Purpose**: Provides authentication context to child components
- **Working**:
  - Wraps children with AuthContext.Provider
  - Manages authentication state and methods
  - Provides context value to all descendants
- **Props**: children (React.ReactNode)
- **Integration**: Wraps entire application in main App component

#### **Context Value Object**

- **Purpose**: Defines the value provided to consuming components
- **Properties**:
  - All state variables (user, session, loading)
  - All authentication methods (signIn, signUp, signOut, etc.)
- **Working**: Provides complete authentication interface to consumers
- **Integration**: Used by useAuth hook to provide context

### 8. Integration and Dependencies

#### **Supabase Integration**

- **Purpose**: Core authentication backend integration
- **Working**:
  - Uses Supabase Auth for authentication
  - Integrates with Supabase database for user profiles
  - Handles OAuth providers (Google)
  - Manages sessions and tokens
- **Dependencies**: Supabase client, auth methods, database queries

#### **React Context Integration**

- **Purpose**: React context system integration
- **Working**:
  - Uses React.createContext for state management
  - Implements useContext for consumption
  - Provides provider pattern for state sharing
- **Dependencies**: React context API, hooks

### 9. Security and Best Practices

#### **Session Management**

- **Purpose**: Secure session handling and token management
- **Working**:
  - Automatic session refresh
  - Secure token storage
  - Session validation
  - Proper cleanup on sign out
- **Security Features**: Token refresh, secure storage, session validation

#### **OAuth Security**

- **Purpose**: Secure OAuth implementation
- **Working**:
  - Proper redirect URL configuration
  - Secure OAuth flow
  - Token handling
  - Consent management
- **Security Features**: Secure redirects, token management, consent flow

### 10. Flow and Sequence (High Level)

#### **Authentication Initialization Flow**:

1. **Provider Mount**: AuthProvider component mounts
2. **Session Retrieval**: Get initial session from Supabase
3. **State Setting**: Set user and session state
4. **Listener Setup**: Set up real-time auth state listener
5. **Loading Complete**: Set loading to false
6. **Context Available**: Authentication context available to children

#### **Sign In Flow**:

1. **User Input**: User provides email and password
2. **Authentication**: Call Supabase signInWithPassword
3. **State Update**: Auth state listener updates user/session
4. **Context Update**: All components receive updated auth state
5. **Navigation**: User redirected to appropriate page

#### **Sign Out Flow**:

1. **User Action**: User clicks sign out
2. **Authentication**: Call Supabase signOut
3. **State Clear**: Auth state listener clears user/session
4. **Context Update**: All components receive cleared auth state
5. **Navigation**: User redirected to login page

#### **OAuth Flow**:

1. **User Action**: User clicks Google sign in
2. **OAuth Redirect**: Redirect to Google OAuth
3. **User Consent**: User grants permissions
4. **Callback**: Redirect to auth callback URL
5. **Session Creation**: Supabase creates session
6. **State Update**: Auth state listener updates state

### Key Features:

- **Comprehensive Authentication**: Email/password and OAuth support
- **Real-time State Management**: Live authentication state updates
- **Session Management**: Automatic session handling and refresh
- **Error Handling**: Graceful error handling and logging
- **Type Safety**: Full TypeScript support with interfaces
- **Context Pattern**: React context for global state management
- **Security**: Secure authentication and session management
- **Integration**: Seamless Supabase integration
- **Debugging**: Comprehensive logging for troubleshooting
- **Flexibility**: Support for multiple authentication methods
- **User Profile Integration**: Database integration for user profiles
- **OAuth Support**: Google OAuth integration

### Integration Points:

- **Supabase Auth**: Core authentication backend
- **Supabase Database**: User profile management
- **React Context**: Global state management
- **OAuth Providers**: Google authentication
- **Application Components**: All components needing authentication
- **Routing System**: Authentication-based routing
- **Error Handling**: Application-wide error management

### Security Considerations:

- **Session Security**: Secure session and token management
- **OAuth Security**: Proper OAuth flow implementation
- **Error Handling**: Secure error handling without information leakage
- **State Management**: Secure authentication state handling
- **Database Security**: Secure user profile queries
- **Redirect Security**: Secure OAuth redirect URLs

### Future Enhancement Opportunities:

- **Multi-factor Authentication**: Add MFA support
- **Social Login**: Additional OAuth providers
- **Session Persistence**: Enhanced session management
- **User Management**: Admin user management features
- **Audit Logging**: Authentication audit trails
- **Rate Limiting**: Authentication rate limiting
- **Biometric Auth**: Biometric authentication support
- **SSO Integration**: Single sign-on integration

Refer to `AuthContext.tsx` for specific implementation details, authentication flow, and context management.

---

# Hooks ------------------------------------------------------------------

## use-mobile.tsx – Functions & Workflow

The `use-mobile.tsx` hook provides a responsive design utility for detecting mobile device screen sizes. It uses the browser's `matchMedia` API to monitor screen width changes and provides a boolean value indicating whether the current viewport is mobile-sized. This hook is essential for implementing responsive UI components and mobile-specific behaviors. Below is a detailed breakdown of all functions and their workflow:

### 1. Hook Configuration and Constants

#### **MOBILE_BREAKPOINT Constant**

- **Purpose**: Defines the screen width threshold for mobile detection
- **Value**: `768` pixels
- **Working**: Uses standard responsive design breakpoint (768px is the common tablet/mobile boundary)
- **Integration**: Used throughout the hook for consistent mobile detection logic

### 2. Hook Implementation and State Management

#### **useIsMobile Hook**

- **Purpose**: Main hook function that returns mobile detection state
- **Return Type**: `boolean` - true if mobile, false if desktop
- **Working**: Manages internal state and provides real-time mobile detection
- **Integration**: Used by components that need responsive behavior

#### **State Management**

- **`isMobile` State**: Boolean state that tracks current mobile status
- **Initial Value**: `undefined` to prevent hydration mismatches
- **Working**: Updates based on screen width changes
- **Integration**: Provides real-time responsive state to consuming components

### 3. Media Query and Event Handling

#### **matchMedia Implementation**

- **Purpose**: Uses browser's native media query API for responsive detection
- **Query**: `(max-width: ${MOBILE_BREAKPOINT - 1}px)` (767px and below)
- **Working**: Creates media query listener for screen width changes
- **Integration**: Provides efficient, native browser API for responsive detection

#### **Event Listener Management**

- **Purpose**: Handles screen size change events
- **Working**:
  - Adds event listener for media query changes
  - Updates mobile state when screen size changes
  - Provides cleanup function to remove listeners
- **Integration**: Ensures real-time updates when user resizes browser or rotates device

#### **onChange Handler**

- **Purpose**: Callback function for media query changes
- **Working**:
  - Checks current window width against mobile breakpoint
  - Updates isMobile state accordingly
  - Triggers re-renders in consuming components
- **Integration**: Provides immediate response to screen size changes

### 4. Initialization and Cleanup

#### **useEffect Hook**

- **Purpose**: Sets up media query listener and initial state
- **Working**:
  - Creates media query listener on mount
  - Sets initial mobile state based on current screen width
  - Returns cleanup function to remove event listener
- **Dependencies**: Empty dependency array for one-time setup
- **Integration**: Ensures proper setup and cleanup of responsive detection

#### **Cleanup Function**

- **Purpose**: Removes event listener to prevent memory leaks
- **Working**:
  - Removes media query change listener
  - Prevents memory leaks on component unmount
  - Ensures proper resource cleanup
- **Integration**: Part of React's cleanup lifecycle

### 5. Return Value and Type Safety

#### **Return Value Processing**

- **Purpose**: Converts state to boolean and handles undefined state
- **Working**: Uses double negation (`!!isMobile`) to convert to boolean
- **Type Safety**: Ensures consistent boolean return type
- **Integration**: Provides clean boolean value to consuming components

### 6. Flow and Sequence (High Level)

#### **Hook Initialization Flow**:

1. **Hook Call**: Component calls useIsMobile hook
2. **State Setup**: Initialize isMobile state as undefined
3. **Media Query Creation**: Create matchMedia query for mobile breakpoint
4. **Event Listener**: Add change event listener to media query
5. **Initial Check**: Set initial mobile state based on current screen width
6. **Return Value**: Return boolean mobile state

#### **Screen Size Change Flow**:

1. **User Action**: User resizes browser or rotates device
2. **Media Query Trigger**: Browser triggers media query change event
3. **onChange Handler**: Handler checks new screen width
4. **State Update**: Update isMobile state based on new width
5. **Component Re-render**: Consuming components re-render with new state
6. **UI Update**: Components update their responsive behavior

#### **Cleanup Flow**:

1. **Component Unmount**: Component using hook unmounts
2. **Cleanup Function**: useEffect cleanup function runs
3. **Listener Removal**: Remove media query event listener
4. **Memory Cleanup**: Prevent memory leaks and resource cleanup

### Key Features:

- **Real-time Detection**: Immediate response to screen size changes
- **Performance Optimized**: Uses native browser API for efficiency
- **Memory Safe**: Proper cleanup to prevent memory leaks
- **Type Safe**: Consistent boolean return type
- **Hydration Safe**: Handles SSR/hydration mismatches
- **Standard Breakpoint**: Uses common 768px mobile breakpoint
- **Event-driven**: Responds to actual screen size changes
- **Lightweight**: Minimal overhead and dependencies

### Integration Points:

- **React Components**: Any component needing responsive behavior
- **UI Components**: Responsive navigation, layouts, and interactions
- **Conditional Rendering**: Show/hide elements based on screen size
- **Styling**: Apply mobile-specific styles and classes
- **User Experience**: Optimize interactions for mobile vs desktop

### Use Cases:

- **Responsive Navigation**: Show mobile menu vs desktop navigation
- **Layout Switching**: Grid vs list layouts based on screen size
- **Touch Interactions**: Enable touch-specific behaviors on mobile
- **Content Adaptation**: Show different content for mobile users
- **Performance Optimization**: Load different assets for mobile
- **Accessibility**: Adjust accessibility features for mobile

### Browser Compatibility:

- **Modern Browsers**: Full support in all modern browsers
- **matchMedia API**: Widely supported media query API
- **Event Listeners**: Standard addEventListener/removeEventListener
- **Window Object**: Standard window.innerWidth access

### Performance Considerations:

- **Native API**: Uses browser's optimized media query system
- **Event-driven**: Only updates when screen size actually changes
- **Minimal Re-renders**: Efficient state updates
- **Memory Efficient**: Proper cleanup prevents memory leaks
- **Lightweight**: Minimal JavaScript overhead

Refer to `use-mobile.tsx` for specific implementation details, responsive detection logic, and hook usage patterns.

---

## use-toast.ts – Functions & Workflow

The `use-toast.ts` hook provides a comprehensive toast notification system for the application. It manages toast state, handles toast lifecycle (add, update, dismiss, remove), and provides a global toast management system with automatic cleanup and state persistence. This hook enables consistent user feedback across the entire application with a robust notification system. Below is a detailed breakdown of all functions and their workflow:

### 1. Configuration and Constants

#### **Toast Configuration Constants**

- **`TOAST_LIMIT`**: Maximum number of toasts to display (1)
- **`TOAST_REMOVE_DELAY`**: Delay before removing dismissed toasts (1,000,000ms)
- **Working**: Controls toast display limits and cleanup timing
- **Integration**: Used throughout the toast system for consistent behavior

### 2. Type Definitions and Interfaces

#### **ToasterToast Type**

- **Purpose**: Extends base ToastProps with additional properties
- **Properties**:
  - `id`: Unique identifier for each toast
  - `title`: Optional toast title (React.ReactNode)
  - `description`: Optional toast description (React.ReactNode)
  - `action`: Optional toast action element
- **Working**: Provides type safety for toast objects
- **Integration**: Used throughout the toast system for type consistency

#### **Action Types**

- **Purpose**: Defines available toast actions
- **Types**:
  - `ADD_TOAST`: Add new toast to display
  - `UPDATE_TOAST`: Update existing toast properties
  - `DISMISS_TOAST`: Dismiss toast (mark as closed)
  - `REMOVE_TOAST`: Remove toast from state completely
- **Working**: Provides type-safe action dispatching
- **Integration**: Used in reducer and dispatch functions

#### **State Interface**

- **Purpose**: Defines the global toast state structure
- **Properties**:
  - `toasts`: Array of ToasterToast objects
- **Working**: Manages all active toasts in the application
- **Integration**: Used by reducer and state management

### 3. ID Generation and Management

#### **genId Function**

- **Purpose**: Generates unique IDs for toast instances
- **Working**:
  - Uses incrementing counter with modulo operation
  - Ensures unique IDs across application lifecycle
  - Handles counter overflow with Number.MAX_SAFE_INTEGER
- **Return**: String representation of unique ID
- **Integration**: Used when creating new toasts

#### **Count Management**

- **Purpose**: Tracks ID generation counter
- **Working**: Increments with each new toast creation
- **Integration**: Used by genId function for unique ID generation

### 4. Timeout Management System

#### **toastTimeouts Map**

- **Purpose**: Tracks timeout references for toast removal
- **Working**: Maps toast IDs to their removal timeout references
- **Integration**: Used for managing delayed toast removal

#### **addToRemoveQueue Function**

- **Purpose**: Schedules toast removal after dismiss delay
- **Parameters**:
  - `toastId`: ID of toast to schedule for removal
- **Working**:
  - Checks if timeout already exists for toast
  - Creates setTimeout for delayed removal
  - Stores timeout reference in map
  - Dispatches REMOVE_TOAST action after delay
- **Integration**: Used when dismissing toasts

### 5. State Management and Reducer

#### **reducer Function**

- **Purpose**: Handles all toast state changes
- **Parameters**:
  - `state`: Current toast state
  - `action`: Action to process
- **Working**: Processes different action types and updates state accordingly
- **Integration**: Core state management for toast system

#### **Action Handlers**

- **ADD_TOAST**: Adds new toast to beginning of array, respects limit
- **UPDATE_TOAST**: Updates existing toast properties by ID
- **DISMISS_TOAST**: Marks toast as closed and schedules removal
- **REMOVE_TOAST**: Removes toast from state array
- **Working**: Each handler processes specific toast operations
- **Integration**: Used by dispatch function for state updates

### 6. Global State Management

#### **Memory State**

- **Purpose**: Maintains global toast state outside React components
- **Working**: Stores current toast state in module-level variable
- **Integration**: Used by dispatch function and listeners

#### **Listeners Array**

- **Purpose**: Tracks components subscribed to toast state changes
- **Working**: Array of callback functions for state updates
- **Integration**: Used to notify components of state changes

#### **dispatch Function**

- **Purpose**: Processes actions and notifies all listeners
- **Parameters**:
  - `action`: Action to process
- **Working**:
  - Updates memory state using reducer
  - Notifies all registered listeners
  - Ensures consistent state across all components
- **Integration**: Central dispatch system for toast operations

### 7. Toast Creation and Management

#### **toast Function**

- **Purpose**: Creates new toast and returns management functions
- **Parameters**:
  - `props`: Toast properties (title, description, etc.)
- **Working**:
  - Generates unique ID for toast
  - Creates update and dismiss functions
  - Dispatches ADD_TOAST action
  - Sets up onOpenChange handler
- **Return**: Object with id, dismiss, and update functions
- **Integration**: Main interface for creating toasts

#### **Toast Management Functions**

- **`update`**: Updates toast properties
- **`dismiss`**: Dismisses the toast
- **`id`**: Unique toast identifier
- **Working**: Provides programmatic control over individual toasts
- **Integration**: Used by components for toast management

### 8. Hook Implementation

#### **useToast Hook**

- **Purpose**: Provides toast state and functions to components
- **Working**:
  - Manages local state synchronized with global state
  - Registers component as listener
  - Provides cleanup on unmount
  - Returns current state and toast function
- **Integration**: Used by components needing toast functionality

#### **State Synchronization**

- **Purpose**: Keeps component state in sync with global state
- **Working**:
  - Registers setState as listener
  - Updates local state when global state changes
  - Provides cleanup to remove listener
- **Integration**: Ensures consistent state across components

### 9. Flow and Sequence (High Level)

#### **Toast Creation Flow**:

1. **Component Call**: Component calls toast() function
2. **ID Generation**: Generate unique ID for toast
3. **Action Dispatch**: Dispatch ADD_TOAST action
4. **State Update**: Reducer adds toast to state
5. **Listener Notification**: All listeners receive state update
6. **UI Update**: Toast appears in UI
7. **Return Management**: Return management functions to caller

#### **Toast Dismissal Flow**:

1. **User Action**: User dismisses toast or timeout occurs
2. **Dismiss Action**: Dispatch DISMISS_TOAST action
3. **State Update**: Reducer marks toast as closed
4. **Queue Removal**: Schedule toast for removal
5. **Timeout**: Wait for removal delay
6. **Remove Action**: Dispatch REMOVE_TOAST action
7. **State Cleanup**: Remove toast from state
8. **UI Update**: Toast disappears from UI

#### **Toast Update Flow**:

1. **Component Call**: Component calls update function
2. **Update Action**: Dispatch UPDATE_TOAST action
3. **State Update**: Reducer updates toast properties
4. **Listener Notification**: All listeners receive update
5. **UI Update**: Toast updates in UI

### Key Features:

- **Global State Management**: Centralized toast state across application
- **Automatic Cleanup**: Delayed removal of dismissed toasts
- **Type Safety**: Full TypeScript support with interfaces
- **Performance Optimized**: Efficient state updates and cleanup
- **Memory Management**: Proper cleanup to prevent memory leaks
- **Flexible API**: Support for various toast types and actions
- **Real-time Updates**: Immediate state synchronization
- **Limit Management**: Configurable toast display limits
- **Timeout Control**: Configurable removal delays
- **Action System**: Comprehensive action-based state management

### Integration Points:

- **UI Components**: Toast display components
- **Application Components**: Any component needing notifications
- **Error Handling**: Error notification system
- **Success Feedback**: Success message system
- **User Actions**: Feedback for user interactions
- **API Responses**: Response notification system

### Use Cases:

- **Success Messages**: Confirm successful operations
- **Error Notifications**: Display error messages
- **Warning Messages**: Show important warnings
- **Info Messages**: Provide informational feedback
- **Loading States**: Show operation progress
- **Form Validation**: Display validation errors
- **API Responses**: Show API response messages
- **User Guidance**: Provide helpful tips and guidance

### Performance Considerations:

- **State Optimization**: Efficient state updates and re-renders
- **Memory Management**: Proper cleanup and timeout management
- **Listener Management**: Efficient listener registration and cleanup
- **Limit Enforcement**: Prevents excessive toast accumulation
- **Timeout Optimization**: Configurable delays for better UX

Refer to `use-toast.ts` for specific implementation details, toast management logic, and notification system usage patterns.

---

## useProfileCompletion.ts – Functions & Workflow

The `useProfileCompletion.ts` hook provides comprehensive profile management functionality for user authentication and profile completion tracking. It integrates with Supabase to fetch user profiles, handles profile completion status, manages approval workflows, and provides utility functions for profile state management. This hook is essential for managing user onboarding, approval processes, and profile-based routing throughout the application. Below is a detailed breakdown of all functions and their workflow:

### 1. Interface Definitions and Type Safety

#### **UserProfile Interface**

- **Purpose**: Defines the complete structure of user profile data
- **Properties**:
  - `id`, `user_id`, `user_name`, `email`, `contact_no`, `address`, `city`, `state`, `pincode`, `dob`, `role`
  - `approval_status`: 'pending' | 'approved' | 'rejected'
  - `status`: 'active' | 'hold' | 'suspend'
  - `status_reason`: Optional reason for status changes
  - `employee_id`, `joining_date`, `hold_days`, `hold_start_date`, `created_at`, `updated_at`
- **Working**: Provides type safety and structure for profile data
- **Integration**: Used throughout the hook for data handling and validation

### 2. Hook State Management

#### **State Variables**

- **`profile`**: Stores current user profile data (UserProfile | null)
- **`loading`**: Manages loading state during profile operations (boolean)
- **Working**: Manages profile state and loading indicators
- **Integration**: Provides real-time profile state to consuming components

#### **Authentication Integration**

- **Purpose**: Integrates with authentication context
- **Working**: Uses useAuth hook to get current user
- **Integration**: Automatically updates when authentication state changes

### 3. Profile Fetching and Data Management

#### **checkProfileCompletion Function**

- **Purpose**: Fetches and validates user profile data
- **Working**:
  - Checks if user is authenticated
  - Attempts direct profile fetch by user_id
  - Falls back to email-based fetch if needed
  - Updates user_id if mismatch found
  - Handles errors gracefully
- **Flow**:
  1. Check user authentication
  2. Try direct query by user_id
  3. Fall back to email query if needed
  4. Update user_id if mismatch
  5. Set profile state
  6. Handle errors and set loading state
- **Integration**: Called on user change and manual refresh

#### **Profile Fetching Strategies**

- **Direct Query**: Primary method using user_id
- **Email Fallback**: Secondary method using email address
- **ID Synchronization**: Updates user_id to match auth user
- **Error Handling**: Graceful handling of fetch failures
- **Working**: Ensures profile data consistency and availability
- **Integration**: Provides robust profile data retrieval

### 4. Profile Status Utility Functions

#### **needsProfileCompletion Function**

- **Purpose**: Determines if user needs to complete profile
- **Working**: Returns true if user exists but profile is null
- **Integration**: Used for routing and UI decisions

#### **needsApproval Function**

- **Purpose**: Checks if user profile needs admin approval
- **Working**: Returns true if approval_status is 'pending'
- **Integration**: Used for approval workflow routing

#### **isApproved Function**

- **Purpose**: Checks if user profile is approved
- **Working**: Returns true if approval_status is 'approved'
- **Integration**: Used for access control and routing

#### **isRejected Function**

- **Purpose**: Checks if user profile is rejected
- **Working**: Returns true if approval_status is 'rejected'
- **Integration**: Used for rejection handling and routing

#### **isActive Function**

- **Purpose**: Checks if user account is active
- **Working**: Returns true if status is 'active'
- **Integration**: Used for access control and feature availability

#### **isOnHold Function**

- **Purpose**: Checks if user account is on hold
- **Working**: Returns true if status is 'hold'
- **Integration**: Used for hold status handling and routing

#### **isSuspended Function**

- **Purpose**: Checks if user account is suspended
- **Working**: Returns true if status is 'suspend'
- **Integration**: Used for suspension handling and routing

### 5. Profile Completion Percentage Calculation

#### **getProfileCompletionPercentage Function**

- **Purpose**: Calculates profile completion percentage based on status
- **Working**:
  - Returns 0% if no profile exists
  - Returns 25% if profile is rejected
  - Returns 50% if profile is pending approval
  - Returns 75% if approved but not active
  - Returns 100% if approved and active
- **Integration**: Used for progress indicators and UI feedback

#### **Completion Logic**

- **Rejected**: 25% (profile exists but rejected)
- **Pending**: 50% (profile submitted, awaiting approval)
- **Approved + Hold/Suspend**: 75% (approved but not fully active)
- **Approved + Active**: 100% (fully completed and active)
- **Working**: Provides meaningful progress indication
- **Integration**: Used in progress bars and completion indicators

### 6. Error Handling and Logging

#### **Console Logging System**

- **Purpose**: Provides debugging information for profile operations
- **Working**:
  - Logs profile completion checks
  - Tracks user authentication state
  - Monitors profile fetch operations
  - Records error conditions
- **Log Points**:
  - Profile completion checks
  - User authentication state
  - Profile fetch results
  - Error conditions and fallbacks

#### **Error Handling Strategy**

- **Purpose**: Graceful handling of profile fetch errors
- **Working**:
  - Catches and logs fetch errors
  - Sets profile to null on errors
  - Continues operation despite errors
  - Provides fallback behavior
- **Error Types**:
  - Database connection errors
  - Query execution errors
  - Authentication errors
  - Data validation errors

### 7. Data Synchronization and Updates

#### **User ID Synchronization**

- **Purpose**: Ensures profile user_id matches authentication user
- **Working**:
  - Detects user_id mismatches
  - Updates profile with correct user_id
  - Handles update errors gracefully
  - Maintains data consistency
- **Integration**: Ensures profile data integrity

#### **Profile Refresh Function**

- **Purpose**: Provides manual profile refresh capability
- **Working**: Exposes checkProfileCompletion as refresh function
- **Integration**: Used by components for manual profile updates

### 8. Hook Return Interface

#### **Return Object**

- **Properties**:
  - `profile`: Current profile data
  - `needsProfileCompletion`: Boolean for completion status
  - `needsApproval`: Boolean for approval status
  - `isApproved`: Boolean for approval check
  - `isRejected`: Boolean for rejection check
  - `getProfileCompletionPercentage`: Function for progress calculation
  - `loading`: Boolean for loading state
  - `refresh`: Function for manual refresh
- **Working**: Provides comprehensive profile management interface
- **Integration**: Used by components for profile-based logic

### 9. Flow and Sequence (High Level)

#### **Hook Initialization Flow**:

1. **Hook Call**: Component calls useProfileCompletion
2. **State Setup**: Initialize profile and loading state
3. **User Check**: Check authentication context
4. **Profile Fetch**: Call checkProfileCompletion
5. **Data Processing**: Process profile data and status
6. **State Update**: Update profile and loading state
7. **Return Interface**: Provide profile management functions

#### **Profile Fetch Flow**:

1. **User Validation**: Check if user is authenticated
2. **Direct Query**: Try fetching profile by user_id
3. **Fallback Query**: Try fetching profile by email if needed
4. **ID Sync**: Update user_id if mismatch found
5. **State Update**: Set profile state with fetched data
6. **Error Handling**: Handle any fetch errors
7. **Loading Complete**: Set loading to false

#### **Status Check Flow**:

1. **Function Call**: Component calls status check function
2. **Profile Validation**: Check if profile exists
3. **Status Evaluation**: Evaluate specific status condition
4. **Boolean Return**: Return true/false based on condition
5. **Component Update**: Component updates based on status

### Key Features:

- **Comprehensive Profile Management**: Complete profile data handling
- **Status Tracking**: Multiple profile and approval statuses
- **Progress Calculation**: Percentage-based completion tracking
- **Error Handling**: Graceful error handling and fallbacks
- **Data Synchronization**: User ID and profile data consistency
- **Authentication Integration**: Seamless auth context integration
- **Real-time Updates**: Automatic updates on user changes
- **Manual Refresh**: Manual profile refresh capability
- **Type Safety**: Full TypeScript support with interfaces
- **Debugging Support**: Comprehensive logging for troubleshooting
- **Fallback Strategies**: Multiple profile fetch strategies
- **Status Utilities**: Comprehensive status check functions

### Integration Points:

- **Authentication Context**: User authentication state
- **Supabase Database**: Profile data storage and retrieval
- **Routing System**: Profile-based routing decisions
- **UI Components**: Profile completion indicators
- **Approval Workflows**: Admin approval processes
- **Status Management**: User status tracking

### Use Cases:

- **Profile Completion**: Track user profile completion status
- **Approval Workflows**: Manage admin approval processes
- **Access Control**: Control feature access based on profile status
- **Progress Tracking**: Show profile completion progress
- **Status Management**: Handle different user statuses
- **Data Synchronization**: Ensure profile data consistency
- **Error Handling**: Handle profile fetch errors gracefully
- **Manual Refresh**: Allow manual profile updates

### Security Considerations:

- **Data Validation**: Validate profile data integrity
- **User ID Sync**: Ensure profile belongs to authenticated user
- **Error Handling**: Secure error handling without data leakage
- **Access Control**: Profile-based access control
- **Data Consistency**: Maintain profile data consistency

### Future Enhancement Opportunities:

- **Real-time Updates**: WebSocket integration for live updates
- **Profile Validation**: Enhanced profile data validation
- **Batch Operations**: Support for batch profile operations
- **Caching**: Profile data caching for performance
- **Offline Support**: Offline profile data management
- **Profile History**: Track profile change history
- **Advanced Status**: More granular status management
- **Profile Analytics**: Profile completion analytics

Refer to `useProfileCompletion.ts` for specific implementation details, profile management logic, and status tracking patterns.

---

# Libs --------------------------------------------------------------------

## supabase.ts – Client Configuration & Functions

The `supabase.ts` module provides the main Supabase client configuration and initialization for the application. It creates and exports a single Supabase client instance that can be used throughout the application for database operations, authentication, and real-time subscriptions. Below is a detailed breakdown of its functionality:

### 1. Environment Configuration

#### **Environment Variables**

- **`VITE_SUPABASE_URL`**: The URL of your Supabase project instance
- **`VITE_SUPABASE_ANON_KEY`**: Anonymous/public API key for Supabase
- **Working**: Environment variables loaded through Vite's import.meta.env
- **Validation**: Checks for presence of both variables on initialization

#### **Error Handling**

- **Purpose**: Validates required environment configuration
- **Working**: Throws error if either environment variable is missing
- **Error Message**: "Missing Supabase environment variables"
- **When**: At module initialization/import time

### 2. Client Creation and Configuration

#### **createClient Function**

- **Purpose**: Creates and configures Supabase client instance
- **Parameters**:
  - `supabaseUrl`: URL from environment variables
  - `supabaseAnonKey`: Anonymous key from environment variables
- **Working**: Initializes Supabase client with provided configuration
- **Return**: Configured Supabase client instance
- **Integration**: Uses @supabase/supabase-js client library

#### **Exported Client Instance**

- **Name**: `supabase`
- **Type**: SupabaseClient from @supabase/supabase-js
- **Scope**: Single instance shared across application
- **Usage**: Import and use for all Supabase operations

### 3. Client Capabilities

#### **Authentication Operations**

- Sign up new users
- Sign in with email/password
- Sign in with OAuth providers
- Password reset functionality
- Session management
- Real-time auth state changes

#### **Database Operations**

- CRUD operations on tables
- Filtered queries with query builder
- Transactions and batch operations
- Realtime subscriptions
- RLS policy enforcement
- Stored procedures

#### **Storage Operations**

- File upload and download
- Public/private bucket management
- File metadata management
- Storage policies

#### **Real-time Subscriptions**

- Table change subscriptions
- Broadcast messages
- Presence detection
- Channel management

### 4. Security Considerations

#### **Environment Variable Security**

- Vite environment variable protection
- Development/production variable separation
- Secure variable handling

#### **Authentication Security**

- Secure session management
- Token-based authentication
- RLS policy enforcement
- Secure password handling

#### **API Key Security**

- Anonymous key limitations
- Role-based access control
- Service role separation
- Key rotation support

### 5. Integration Points

#### **Authentication Integration**

- AuthContext provider integration
- Login/signup flows
- Session management
- OAuth provider integration

#### **Database Integration**

- Model/schema integration
- Query builder usage
- Transaction management
- Real-time updates

#### **Storage Integration**

- File upload components
- Media management
- Storage policy integration
- CDN integration

### 6. Usage Examples

#### **Authentication**

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password123",
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

// Sign out
await supabase.auth.signOut();
```

#### **Database Operations**

```typescript
// Insert data
const { data, error } = await supabase
  .from("table_name")
  .insert({ column: "value" });

// Select data
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("column", "value");

// Real-time subscription
const subscription = supabase
  .from("table_name")
  .on("*", (payload) => {
    console.log("Change received!", payload);
  })
  .subscribe();
```

#### **Storage Operations**

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from("bucket_name")
  .upload("file_path", file);

// Download file
const { data, error } = await supabase.storage
  .from("bucket_name")
  .download("file_path");
```

### 7. Error Handling

#### **Operation Error Handling**

- Error object structure
- Error type checking
- Error message handling
- Error recovery strategies

#### **Connection Error Handling**

- Network error handling
- Reconnection strategies
- Timeout handling
- Fallback behaviors

### 8. Performance Considerations

#### **Client Configuration**

- Single instance reuse
- Connection pooling
- Request batching
- Cache strategies

#### **Query Optimization**

- Efficient query patterns
- Pagination support
- Relationship handling
- Data filtering

### Integration and Dependencies:

- **@supabase/supabase-js**: Core client library
- **Vite**: Environment variable handling
- **TypeScript**: Type definitions and safety
- **React Context**: Integration with auth context
- **Environment Config**: Project configuration

### Key Features:

- **Single Instance**: Shared client across application
- **Environment Based**: Configuration via env variables
- **Type Safe**: Full TypeScript support
- **Secure**: Environment variable validation
- **Flexible**: Support for all Supabase features
- **Real-time Ready**: Built-in subscription support
- **Error Handled**: Comprehensive error checking
- **Integration Ready**: Easy to use with React

### Security Considerations:

- **Environment Security**: Secure variable handling
- **Key Management**: Proper API key usage
- **Authentication**: Secure auth patterns
- **Data Access**: RLS policy enforcement
- **Error Handling**: Secure error management

### Future Enhancement Opportunities:

- **Edge Function Integration**: Serverless function support
- **Multi-Project Support**: Multiple instance management
- **Offline Support**: Offline-first capabilities
- **Monitoring Integration**: Performance monitoring
- **Type Generation**: Automated type generation
- **Migration Integration**: Database migration tools
- **Cache Layer**: Response caching system
- **Metrics Collection**: Usage analytics

Refer to `supabase.ts` for the core Supabase client configuration and initialization. This module is fundamental to all Supabase operations in the application.

---

## utils.ts – Utility Functions

The `utils.ts` module provides a collection of utility functions used throughout the application. It includes functions for handling CSS classes, mobile device detection, authentication debugging, and mobile-specific operations. Below is a detailed breakdown of each utility function:

### 1. CSS Class Management

#### **cn Function**

- **Purpose**: Merges CSS class names with Tailwind CSS support
- **Parameters**: ...inputs: ClassValue[] (Rest parameter of class values)
- **Working**:
  - Uses clsx for class name merging
  - Uses tailwind-merge for Tailwind class deconflicting
  - Handles array, object, and string inputs
- **Return**: Merged class string
- **Usage**:

```typescript
const className = cn(
  "base-class",
  { "conditional-class": true },
  ["array-class"],
  someCondition && "dynamic-class"
);
```

### 2. Mobile Device Detection and Handling

#### **isMobileBrowser Function**

- **Purpose**: Detects if current device is mobile
- **Working**:
  - Uses user agent string detection
  - Checks for common mobile platforms
  - Returns boolean indicating mobile status
- **Supported Platforms**:
  - Android
  - iOS (iPhone, iPad, iPod)
  - BlackBerry
  - Opera Mini
  - Other mobile browsers

#### **handleMobileHashFragment Function**

- **Purpose**: Manages URL hash fragments on mobile devices
- **Working**:
  - Checks for mobile device
  - Processes URL hash fragments
  - Extracts access tokens
  - Cleans up URL after processing
- **Features**:
  - Access token extraction
  - Session storage integration
  - URL cleanup
  - Mobile-specific handling

#### **getMobileDelay Function**

- **Purpose**: Provides appropriate delay times for mobile devices
- **Working**:
  - Returns longer delay for mobile (1000ms)
  - Returns shorter delay for desktop (500ms)
  - Helps with mobile timing issues
- **Return**: Delay in milliseconds

### 3. Authentication Debugging

#### **debugMobileAuth Function**

- **Purpose**: Comprehensive debugging for mobile authentication
- **Working**: Collects and logs:
  - User agent information
  - Mobile status
  - URL components (hash, search, path)
  - Screen and viewport dimensions
  - LocalStorage/SessionStorage state
  - Authentication token presence
- **Return**: Debug information object
- **Usage**: Troubleshooting mobile auth issues

### 4. Mobile Refresh Management

#### **forceMobileRefresh Function**

- **Purpose**: Forces page refresh on mobile devices
- **Working**:
  - Checks if device is mobile
  - Reloads page if needed
  - Logs refresh action
- **Usage**: Handling mobile-specific state issues

### 5. Usage Examples

#### **Class Name Merging**

```typescript
const buttonClasses = cn(
  "base-button",
  isActive && "active",
  isDisabled && "disabled",
  size === "large" ? "lg" : "md"
);
```

#### **Mobile Detection**

```typescript
if (isMobileBrowser()) {
  // Apply mobile-specific logic
  const delay = getMobileDelay();
  setTimeout(action, delay);
}
```

#### **Auth Debugging**

```typescript
// During authentication issues
const debug = debugMobileAuth();
console.log("Auth Debug Info:", debug);
```

### 6. Integration Points

#### **Style System Integration**

- Tailwind CSS class merging
- Dynamic class generation
- Style conflict resolution

#### **Authentication System**

- Mobile auth handling
- Token management
- Session storage integration

#### **Mobile Experience**

- Device detection
- Timing adjustments
- URL management
- Refresh handling

### 7. Security Considerations

#### **Token Handling**

- Secure token extraction
- Session storage usage
- URL cleanup after processing

#### **Debug Information**

- Non-sensitive data logging
- Safe debug output
- Controlled information exposure

### Key Features:

- **CSS Management**: Efficient class name handling
- **Mobile Detection**: Reliable device detection
- **Auth Debugging**: Comprehensive debug info
- **Performance**: Mobile-optimized delays
- **Security**: Safe token handling
- **Flexibility**: Generic utility functions
- **Type Safety**: Full TypeScript support
- **Integration Ready**: Works with existing systems

### Integration and Dependencies:

- **clsx**: Class name merging
- **tailwind-merge**: Tailwind class handling
- **TypeScript**: Type definitions
- **Browser APIs**: User agent and storage
- **Window API**: URL and history management

### Future Enhancement Opportunities:

- **Device Fingerprinting**: Enhanced detection
- **Performance Metrics**: Mobile timing data
- **Error Tracking**: Enhanced debugging
- **State Management**: Mobile state handling
- **Cache Integration**: Mobile caching strategies
- **Offline Support**: Mobile offline utils
- **Analytics**: Mobile usage tracking
- **Network Detection**: Connection state utils

Refer to `utils.ts` for the collection of utility functions that support various aspects of the application, particularly mobile device handling and authentication debugging.
