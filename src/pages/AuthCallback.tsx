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
  const [currentStep, setCurrentStep] = useState("");

  // Detect if it's a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Prevent multiple simultaneous processing
      if (processing) return;

      setProcessing(true);
      setProgress(5);
      setCurrentStep("Initializing...");

      try {
        console.log("=== AUTH CALLBACK STARTED ===");
        console.log("Auth loading:", loading);
        console.log("User:", user?.id);
        console.log("Attempt:", attempts + 1);
        console.log("Is Mobile:", isMobile);

        // Wait for auth to be ready (longer wait for mobile)
        if (loading) {
          console.log("Auth still loading, waiting...");
          setProgress(15);
          setCurrentStep("Waiting for authentication...");

          // Longer wait for mobile devices
          const waitTime = isMobile ? 3000 : 2000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        // Additional wait for auth state to settle (especially important for mobile)
        setProgress(30);
        setCurrentStep("Processing authentication...");

        const settleTime = isMobile ? 2000 : 1500;
        await new Promise(resolve => setTimeout(resolve, settleTime));

        // If still no user after waiting, try to get session manually
        if (!user) {
          console.log("No user after waiting, trying to get session manually");
          setProgress(50);
          setCurrentStep("Retrieving session...");

          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error("Session error:", sessionError);
          }

          if (!session?.user) {
            console.log("No session found, authentication failed");
            setError("Authentication failed. Please try logging in again.");
            setProcessing(false);
            return;
          }
        }

        // Check if user has a complete profile
        console.log("Fetching user profile...");
        setProgress(70);
        setCurrentStep("Loading user profile...");

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

        setProgress(90);
        setCurrentStep("Finalizing...");

        // Small delay for mobile to show progress
        if (isMobile) {
          await new Promise(resolve => setTimeout(resolve, 500));
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
      }, isMobile ? 3000 : 2000);

      return () => clearTimeout(timer);
    }
  }, [user, loading, navigate, processing, attempts, isMobile]);

  if (processing || loading) {
    return (
      <MobileLoading
        message={currentStep || "Processing Authentication"}
        showProgress={true}
        progress={progress}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>

          {isMobile && (
            <div className="bg-blue-50 text-blue-600 px-4 py-3 rounded-lg mb-4 text-sm">
              <p>💡 Mobile Tip: Try refreshing the page or going back to login</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => {
                setError("");
                setAttempts(0);
                setProcessing(false);
                setProgress(0);
                setCurrentStep("");
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Back to Login
            </button>

            {isMobile && (
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Refresh Page
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback; 