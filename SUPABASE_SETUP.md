# Supabase Authentication Setup

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be ready

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key

## 3. Configure Environment Variables

1. Create a `.env` file in your project root
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://bylyjilpmoxrvorabcnn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure any additional settings as needed

## 5. Setup Google OAuth

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** or **Google Identity API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `https://bylyjilpmoxrvorabcnn.supabase.co/auth/v1/callback`
   - `http://localhost:8082/auth/callback` (for development)
7. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Google in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
4. Save the configuration

### Step 3: Update Site URL

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set your **Site URL** to: `http://localhost:8082` (for development)
3. Add redirect URLs:
   - `http://localhost:8082/auth/callback`
   - `http://localhost:8082/`

## 6. Setup Password Reset

### Step 1: Configure Email Templates

1. In your Supabase dashboard, go to **Authentication** → **Email Templates**
2. Click on **"Confirm signup"** template
3. Customize the email template if needed
4. Click on **"Reset password"** template
5. Customize the password reset email template
6. Save your changes

### Step 2: Configure URL Configuration for Password Reset

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Make sure your **Site URL** is set to: `http://localhost:8082` (for development)
3. Add these redirect URLs:
   - `http://localhost:8082/auth/callback`
   - `http://localhost:8082/`
   - `http://localhost:8082/reset-password` (for password reset)
4. Save the configuration

### Step 3: Test Password Reset Flow

1. Go to your login page: `http://localhost:8082/login`
2. Click on "Forgot password?"
3. Enter your email address
4. Check your email for the reset link
5. Click the link to reset your password

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Visit `http://localhost:8082/login`
3. Try both email/password and Google sign-in
4. Test the password reset functionality

## Features

- ✅ Real-time authentication state
- ✅ Email/password authentication
- ✅ Google OAuth authentication
- ✅ Password reset functionality
- ✅ Automatic session management
- ✅ Protected routes
- ✅ Loading states
- ✅ Error handling
- ✅ OAuth callback handling

## Demo Account

For testing purposes, you can use:

- Email: `demo@example.com`
- Password: `demo123`

Or use Google OAuth for quick sign-in.

## Troubleshooting

### Google OAuth Issues:

#### Error 400: redirect_uri_mismatch

**Solution:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID and click **Edit**
4. Under **Authorized redirect URIs**, add:
   - `https://bylyjilpmoxrvorabcnn.supabase.co/auth/v1/callback`
   - `http://localhost:8082/auth/callback`
5. Click **Save**
6. Wait 5-10 minutes for changes to propagate

#### Common Issues:

- Make sure redirect URIs are exactly correct (no extra spaces)
- Check that Google OAuth is enabled in Supabase
- Verify Client ID and Secret are correct
- Ensure Site URL is set correctly in Supabase
- Clear browser cache and cookies
- Try in incognito/private mode

#### Verification Steps:

1. **Google Cloud Console**: Verify redirect URIs match exactly
2. **Supabase Dashboard**: Check Google provider is enabled
3. **Environment**: Ensure you're using port 8082
4. **Browser**: Clear cache and try again

### Password Reset Issues:

- Check that email templates are configured
- Verify redirect URLs include `/reset-password`
- Ensure email provider is enabled
- Check spam folder for reset emails

### Development vs Production:

- For production, update redirect URIs to your domain
- Update Site URL in Supabase dashboard
- Use HTTPS in production
- Update email templates for production branding
