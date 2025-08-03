import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import MobileLoading from "@/components/MobileLoading";

const AuthCallback = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Prevent multiple simultaneous processing
      if (processing) return;

      setProcessing(true);
      setProgress(10);

      try {
        console.log("=== AUTH CALLBACK STARTED ===");
        console.log("Auth loading:", loading);
        console.log("User:", user?.id);
        console.log("Attempt:", attempts + 1);

        // Wait for auth to be ready (longer wait for mobile)
        if (loading) {
          console.log("Auth still loading, waiting...");
          setProgress(20);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Additional wait for auth state to settle (especially important for mobile)
        setProgress(40);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // If still no user after waiting, try to get session manually
        if (!user) {
          console.log("No user after waiting, trying to get session manually");
          setProgress(60);
          const { data: { session } } = await supabase.auth.getSession();

          if (!session?.user) {
            console.log("No session found, authentication failed");
            setError("Authentication failed. Please try logging in again.");
            setProcessing(false);
            return;
          }
        }

        // Check if user has a complete profile
        console.log("Fetching user profile...");
        setProgress(80);
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user?.id || '')
          .single();

        console.log("Profile fetch result:", { profile, error: profileError });

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          setError("Failed to fetch user profile. Please try again.");
          setProcessing(false);
          return;
        }

        setProgress(100);

        // If user has no profile, redirect to profile completion
        if (!profile) {
          console.log('No profile found, redirecting to profile completion');
          navigate('/profile-completion', { replace: true });
          return;
        }

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

        // If user is rejected
        if (profile.approval_status === 'rejected') {
          console.log('User rejected');
          navigate('/rejected', { replace: true });
          return;
        }

        // If user is approved, check status
        if (profile.approval_status === 'approved') {
          if (profile.status === 'hold') {
            console.log('User approved but on hold');
            navigate('/hold', { replace: true });
            return;
          }

          if (profile.status === 'suspend') {
            console.log('User approved but suspended');
            navigate('/suspended', { replace: true });
            return;
          }

          if (profile.status === 'active') {
            console.log('User approved and active, redirecting to dashboard');
            navigate('/', { replace: true });
            return;
          }
        }

        // Default fallback
        console.log('Default fallback to profile completion');
        navigate('/profile-completion', { replace: true });

      } catch (error) {
        console.error('Auth callback error:', error);
        setError("An error occurred during authentication. Please try again.");
      } finally {
        setProcessing(false);
      }
    };

    // Only process if we have a user or if auth is still loading
    if (user || loading) {
      handleAuthCallback();
    } else if (!loading && !user && attempts < 3) {
      // Retry logic for mobile devices
      const timer = setTimeout(() => {
        setAttempts(prev => prev + 1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, loading, navigate, processing, attempts]);

  if (processing || loading) {
    return (
      <MobileLoading
        message="Processing Authentication"
        showProgress={true}
        progress={progress}
      />
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
              setAttempts(0);
              setProcessing(false);
              setProgress(0);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md mr-2"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
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