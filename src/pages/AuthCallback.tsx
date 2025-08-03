import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { handleMobileHashFragment, isMobileBrowser, getMobileDelay, debugMobileAuth } from "@/lib/utils";

const AuthCallback = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Debug mobile auth issues
    debugMobileAuth();

    // Handle mobile hash fragments first
    handleMobileHashFragment();

    // Set a timeout to prevent getting stuck
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Auth callback timeout reached, redirecting to login");
        setError("Authentication is taking too long. Please try again.");
        setLoading(false);
      }
    }, isMobileBrowser() ? 15000 : 10000); // 15 seconds for mobile, 10 for desktop

    const handleAuthCallback = async () => {
      try {
        console.log("=== AUTH CALLBACK STARTED ===");
        console.log("Is mobile browser:", isMobileBrowser());
        console.log("Auth loading:", authLoading);
        console.log("User:", user?.id);
        console.log("Retry count:", retryCount);

        // Wait for auth to be ready
        if (authLoading) {
          console.log("Auth still loading, waiting...");
          return;
        }

        // If no user after auth is ready, show error
        if (!user) {
          console.log("No user found after auth loading");
          if (retryCount < 3) {
            // Retry a few times for mobile devices
            console.log("Retrying...");
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
              setLoading(true);
            }, getMobileDelay() * 2);
            return;
          }
          setError("Authentication failed. Please try logging in again.");
          setLoading(false);
          return;
        }

        console.log("User authenticated, fetching profile...");

        // Check if user has a complete profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log("Profile fetch result:", { profile, profileError });

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          setError("Failed to fetch user profile");
          setLoading(false);
          return;
        }

        // If user has no profile, redirect to profile completion
        if (!profile) {
          console.log('No profile found, redirecting to profile completion');
          navigate('/profile-completion', { replace: true });
          return;
        }

        console.log("Profile found:", profile);

        // If user is admin and approved, redirect to admin panel
        if (profile.role === 'admin' && profile.approval_status === 'approved') {
          console.log('Admin user detected, redirecting to admin panel');
          navigate('/admin', { replace: true });
          return;
        }

        // If user has complete profile but needs approval
        if (profile.approval_status === 'pending') {
          console.log('Profile complete but pending approval');
          navigate('/approval-pending', { replace: true });
          return;
        }

        // If user is approved, check status
        if (profile.approval_status === 'approved') {
          if (profile.status === 'active') {
            console.log('User approved and active, redirecting to dashboard');
            navigate('/', { replace: true });
            return;
          } else if (profile.status === 'hold') {
            console.log('User approved but on hold');
            navigate('/hold', { replace: true });
            return;
          } else if (profile.status === 'suspend') {
            console.log('User approved but suspended');
            navigate('/suspended', { replace: true });
            return;
          }
        }

        // If user is rejected
        if (profile.approval_status === 'rejected') {
          console.log('User rejected');
          navigate('/rejected', { replace: true });
          return;
        }

        // Default fallback
        console.log('Default fallback to profile completion');
        navigate('/profile-completion', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        setError("An error occurred during authentication");
        setLoading(false);
      }
    };

    // Add a delay for mobile devices to ensure proper state handling
    const callbackTimeoutId = setTimeout(() => {
      handleAuthCallback();
    }, getMobileDelay());

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(callbackTimeoutId);
    };
  }, [user, authLoading, navigate, retryCount, loading]);

  // Show loading spinner while processing
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Authentication</h2>
          <p className="text-gray-600">Please wait while we set up your account...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">Attempt {retryCount + 1} of 3</p>
          )}
          {isMobileBrowser() && (
            <p className="text-xs text-gray-400 mt-2">Mobile device detected</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
          <button
            onClick={() => {
              setError("");
              setLoading(true);
              setRetryCount(0);
              navigate('/login', { replace: true });
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback; 