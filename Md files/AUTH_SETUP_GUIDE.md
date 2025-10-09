# Supabase Auth Configuration Guide

## Step 1: Configure Site URL

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Set Site URL to: `https://insured-book.vercel.app`
3. Add Additional Redirect URLs:
   - `https://insured-book.vercel.app/auth/callback`
   - `https://insured-book.vercel.app/profile-completion`
   - `http://localhost:5173` (for local development)
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/profile-completion`

## Step 2: Update Environment Variables

Make sure your `.env` file has these variables:

```env
VITE_SUPABASE_URL=https://bylyjilpmoxrvorabcnn.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_PUBLIC_SITE_URL=https://insured-book.vercel.app
```

## Step 3: Verify Auth Settings

1. Go to Authentication > Settings
2. Enable Email Auth
3. Set these email template URLs:
   - Confirm Sign Up: `https://insured-book.vercel.app/auth/callback`
   - Reset Password: `https://insured-book.vercel.app/reset-password`
4. Enable "Confirm email by default"

## Step 4: Update Email Templates

1. Go to Authentication > Email Templates
2. Update Confirmation Email template:

   ```
   Confirm your signup to Insured Book

   Please confirm your signup by clicking the link below:

   {{ .ConfirmationURL }}

   If you didn't sign up for Insured Book, you can safely ignore this email.
   ```

## Step 5: Enable Required Auth Providers

1. Go to Authentication > Providers
2. Enable Email/Password sign-in
3. Configure any additional providers (Google, etc.)

## Step 6: Add Security Policies

1. Go to Authentication > Policies
2. Set minimum password length to 8
3. Enable strong password requirement

## Step 7: CORS Configuration

1. Go to Settings > API
2. Add allowed origins:
   - `https://insured-book.vercel.app`
   - `http://localhost:5173`
