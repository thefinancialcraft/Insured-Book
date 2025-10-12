import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

const RECENT_USERS_KEY = "recent_login_users";

const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentUsers, setRecentUsers] = useState([]);

  // Load recent users from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_USERS_KEY);
      if (stored) {
        setRecentUsers(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Add a user to recent users (max 5, most recent first)
  const addRecentUser = (user) => {
    if (!user?.email) return;
    let updated = [user, ...recentUsers.filter(u => u.email !== user.email)];
    if (updated.length > 5) updated = updated.slice(0, 5);
    setRecentUsers(updated);
    localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(updated));
  };

  // On card click: autofill email, focus password
  const handleRecentUserClick = (user) => {
    setFormData(f => ({ ...f, email: user.email }));
    setTimeout(() => {
      const pw = document.getElementById("password");
      if (pw) pw.focus();
    }, 100);
  };

  // Check for deletion message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      // Clear the state to prevent the message from showing again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Test Supabase connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("=== TESTING SUPABASE CONNECTION ===");
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase connection error:", error);
        } else {
          console.log("Supabase connection successful");
          console.log("Current session:", data.session);
          console.log("Current user:", data.session?.user);
        }

        // Check if any users exist in the database
        console.log("=== CHECKING DATABASE USERS ===");
        const { data: users, error: usersError } = await supabase
          .from('user_profiles')
          .select('email, user_name, role, status')
          .limit(5);

        if (usersError) {
          console.error("Error fetching users:", usersError);
          console.error("Error details:", {
            code: usersError.code,
            message: usersError.message,
            details: usersError.details
          });
        } else {
          console.log("Existing users in database:", users);
          console.log("User count:", users?.length || 0);
        }

        // Test database permissions
        console.log("=== TESTING DATABASE PERMISSIONS ===");
        const { data: testQuery, error: testError } = await supabase
          .from('user_profiles')
          .select('count')
          .limit(1);

        if (testError) {
          console.error("Database permission test failed:", testError);
        } else {
          console.log("Database permissions working correctly");
        }
      } catch (error) {
        console.error("=== CONNECTION TEST EXCEPTION ===");
        console.error("Failed to connect to Supabase:", error);
        console.error("Error type:", typeof error);
        console.error("Error message:", error?.message);
      }
    };

    testConnection();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("=== LOGIN DEBUG START ===");
    console.log("Form data:", formData);

    // Basic validation
    if (!formData.email || !formData.password) {
      console.log("Validation failed: Missing email or password");
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting to sign in with email:", formData.email);

      // First, let's check if the user exists in auth
      console.log("Calling supabase.auth.signInWithPassword...");
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      console.log("=== AUTH RESPONSE ===");
      console.log("Auth data:", authData);
      console.log("Auth error:", authError);
      console.log("User object:", authData?.user);
      console.log("Session:", authData?.session);

      if (authError) {
        console.error("Auth error details:", {
          message: authError.message,
          status: authError.status,
          name: authError.name
        });

        // Provide specific error messages for different scenarios
        if (authError.message?.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials.");
        } else if (authError.message?.includes("Email not confirmed")) {
          setError("Please check your email and click the verification link before signing in.");
        } else if (authError.message?.includes("Too many requests")) {
          setError("Too many login attempts. Please try again later.");
        } else {
          setError(authError.message || "Login failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      if (authData?.user) {
        // Store in recent users
        addRecentUser({
          email: authData.user.email,
          user_name: authData.user.user_metadata?.full_name || authData.user.email,
          avatar_url: authData.user.user_metadata?.avatar_url || "",
        });
        console.log("=== USER AUTHENTICATED SUCCESSFULLY ===");
        console.log("User ID:", authData.user.id);
        console.log("User email:", authData.user.email);
        console.log("Email confirmed at:", authData.user.email_confirmed_at);
        console.log("User metadata:", authData.user.user_metadata);
        console.log("App metadata:", authData.user.app_metadata);

        // Check user's profile and role
        try {
          console.log("=== FETCHING USER PROFILE ===");
          console.log("Querying user_profiles table for user_id:", authData.user.id);

          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', authData.user.id)
            .single();

          console.log("=== PROFILE QUERY RESULT ===");
          console.log("Profile data:", profile);
          console.log("Profile error:", profileError);
          console.log("Profile error code:", profileError?.code);
          console.log("Profile error message:", profileError?.message);

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile details:', {
              code: profileError.code,
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint
            });
            setError("Failed to fetch user profile. Please try again.");
            setLoading(false);
            return;
          }

          console.log("=== PROFILE ANALYSIS ===");
          console.log("Profile exists:", !!profile);
          if (profile) {
            console.log("Profile role:", profile.role);
            console.log("Profile status:", profile.status);
            console.log("Profile employee_id:", profile.employee_id);
            console.log("Profile created_at:", profile.created_at);
          }

          // If user has no profile, redirect to profile completion
          if (!profile) {
            console.log("No profile found, redirecting to profile completion");
            navigate('/profile-completion');
            return;
          }

          // If user is admin and approved, redirect to admin panel
          if (profile.role === 'admin' && profile.approval_status === 'approved') {
            console.log("Admin user detected, redirecting to admin panel");
            navigate('/admin');
            return;
          }

          // If user is approved and active, redirect to dashboard
          if (profile.approval_status === 'approved' && profile.status === 'active') {
            console.log("User approved and active, redirecting to dashboard");
            navigate('/');
            return;
          }

          // If user is approved but on hold, redirect to hold page
          if (profile.approval_status === 'approved' && profile.status === 'hold') {
            console.log("User approved but on hold, redirecting to hold page");
            navigate('/hold');
            return;
          }

          // If user is approved but suspended, redirect to suspended page
          if (profile.approval_status === 'approved' && profile.status === 'suspend') {
            console.log("User approved but suspended, redirecting to suspended page");
            navigate('/suspended');
            return;
          }

          // If user is rejected
          if (profile.approval_status === 'rejected') {
            console.log("User rejected, redirecting to rejection page");
            navigate('/rejected');
            return;
          }

          // If user needs approval
          if (profile.approval_status === 'pending') {
            console.log("User needs approval, redirecting to approval pending");
            navigate('/approval-pending');
            return;
          }

          // Default fallback
          console.log("Default fallback, redirecting to profile completion");
          navigate('/profile-completion');
        } catch (profileError) {
          console.error("=== PROFILE CHECK EXCEPTION ===");
          console.error("Profile check error:", profileError);
          console.error("Error type:", typeof profileError);
          console.error("Error message:", profileError?.message);
          setError("Error checking user profile. Please try again.");
          setLoading(false);
        }
      } else {
        console.log("=== NO USER DATA RETURNED ===");
        console.log("Auth data is null or undefined");
        console.log("Full auth response:", authData);
        setError("Login failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("=== LOGIN EXCEPTION ===");
      console.error("Login error:", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);

      // Check for specific error types
      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          setError("Network error. Please check your internet connection.");
        } else if (error.message.includes("Supabase")) {
          setError("Authentication service error. Please try again later.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An error occurred during login. Please try again.");
      }
      setLoading(false);
    } finally {
      console.log("=== LOGIN DEBUG END ===");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("An error occurred during Google sign-in");
    }
  };

  const checkAllUsers = async () => {
    try {
      console.log("=== CHECKING ALL USERS IN DATABASE ===");
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log("=== DATABASE USERS ===");
        console.log("Total users found:", users?.length || 0);

        if (users && users.length > 0) {
          users.forEach((user, index) => {
            console.log(`User ${index + 1}:`, {
              id: user.id,
              user_id: user.user_id,
              user_name: user.user_name,
              email: user.email,
              role: user.role,
              status: user.status,
              employee_id: user.employee_id,
              created_at: user.created_at,
              updated_at: user.updated_at
            });
          });
        } else {
          console.log("No users found in database");
        }

        alert(`Found ${users?.length || 0} users in database. Check console for details.`);
      }

      // Also check auth users
      console.log("=== CHECKING AUTH USERS ===");
      console.log("Note: Admin API not available in client-side code");
      console.log("Auth users can only be checked from server-side or admin panel");
    } catch (error) {
      console.error("=== ERROR CHECKING USERS ===");
      console.error("Error checking users:", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 px-4 py-8">
      <div className="w-full max-w-md p-6 md:p-8 bg-white/90 rounded-2xl shadow-xl border border-white/50">
        {/* Recent Users */}
        {recentUsers.length > 0 && (
          <div className="mb-6">
            <div className="mb-2 text-xs text-gray-500 font-medium">Past Logins</div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentUsers.map((u, i) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => handleRecentUserClick(u)}
                  className="flex flex-col items-center px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                  tabIndex={0}
                >
                  <Avatar className="h-10 w-10 mb-1">
                    {u.avatar_url ? (
                      <AvatarImage src={u.avatar_url} alt={u.user_name || u.email} />
                    ) : (
                      <AvatarFallback>{(u.user_name || u.email)[0]?.toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-xs font-medium text-gray-700 max-w-[70px] truncate">{u.user_name || u.email}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col items-center mb-7">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 mb-2">
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </span>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1 tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-3 py-2 rounded mb-2 text-center text-sm border border-red-100">{error}</div>}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-gray-700 text-sm transition"
              required
              autoFocus
              disabled={loading}
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-1">Password *</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-gray-700 text-sm transition pr-10"
                required
                disabled={loading}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs">
              <Link
                to="/forgot-password"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign up
              </Link>
            </p>
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-xs text-green-700">
                <strong>Flexible Login:</strong> You can login with email/password or use Google sign-in. Both methods work for your account.
              </p>
            </div>
            <button
              type="button"
              onClick={checkAllUsers}
              className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Debug: Check All Users
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
