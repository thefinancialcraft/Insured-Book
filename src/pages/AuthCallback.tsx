import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { handleMobileHashFragment, isMobileBrowser, getMobileDelay, debugMobileAuth } from "@/lib/utils";

interface DebugStep {
  id: string;
  title: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  message?: string;
}

const AuthCallback = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [debugSteps, setDebugSteps] = useState<DebugStep[]>([
    { id: 'init', title: 'Initializing Authentication', status: 'pending' },
    { id: 'mobile', title: 'Checking Mobile Device', status: 'pending' },
    { id: 'hash', title: 'Processing URL Hash', status: 'pending' },
    { id: 'auth', title: 'Verifying User Session', status: 'pending' },
    { id: 'profile', title: 'Loading User Profile', status: 'pending' },
    { id: 'redirect', title: 'Preparing Redirect', status: 'pending' }
  ]);

  const updateDebugStep = (id: string, status: DebugStep['status'], message?: string) => {
    setDebugSteps(prev => prev.map(step =>
      step.id === id ? { ...step, status, message } : step
    ));
  };

  useEffect(() => {
    // Debug mobile auth issues
    debugMobileAuth();
    updateDebugStep('init', 'completed', 'Authentication process started');

    // Handle mobile hash fragments first
    updateDebugStep('mobile', 'loading', 'Detecting device type...');
    const isMobile = isMobileBrowser();
    updateDebugStep('mobile', 'completed', isMobile ? 'Mobile device detected' : 'Desktop device detected');

    updateDebugStep('hash', 'loading', 'Processing URL parameters...');
    handleMobileHashFragment();
    updateDebugStep('hash', 'completed', 'URL hash processed successfully');

    // Set a timeout to prevent getting stuck
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Auth callback timeout reached, redirecting to login");
        updateDebugStep('redirect', 'error', 'Authentication timeout - taking too long');
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
          updateDebugStep('auth', 'loading', 'Waiting for authentication to complete...');
          return;
        }

        // If no user after auth is ready, show error
        if (!user) {
          console.log("No user found after auth loading");
          updateDebugStep('auth', 'error', 'No user found in session');
          if (retryCount < 3) {
            // Retry a few times for mobile devices
            console.log("Retrying...");
            updateDebugStep('auth', 'loading', `Retry attempt ${retryCount + 1} of 3...`);
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

        updateDebugStep('auth', 'completed', `User authenticated: ${user.email}`);
        console.log("User authenticated, fetching profile...");

        // Check if user has a complete profile
        updateDebugStep('profile', 'loading', 'Fetching user profile from database...');
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log("Profile fetch result:", { profile, profileError });

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          updateDebugStep('profile', 'error', 'Failed to fetch user profile');
          setError("Failed to fetch user profile");
          setLoading(false);
          return;
        }

        // If user has no profile, redirect to profile completion
        if (!profile) {
          console.log('No profile found, redirecting to profile completion');
          updateDebugStep('profile', 'completed', 'No profile found - new user');
          updateDebugStep('redirect', 'loading', 'Redirecting to profile completion...');
          navigate('/profile-completion', { replace: true });
          return;
        }

        updateDebugStep('profile', 'completed', `Profile loaded: ${profile.user_name}`);
        console.log("Profile found:", profile);

        // If user is admin and approved, redirect to admin panel
        if (profile.role === 'admin' && profile.approval_status === 'approved') {
          console.log('Admin user detected, redirecting to admin panel');
          updateDebugStep('redirect', 'loading', 'Admin user - redirecting to admin panel...');
          navigate('/admin', { replace: true });
          return;
        }

        // If user has complete profile but needs approval
        if (profile.approval_status === 'pending') {
          console.log('Profile complete but pending approval');
          console.log('Profile details:', {
            id: profile.id,
            user_name: profile.user_name,
            approval_status: profile.approval_status,
            status: profile.status,
            role: profile.role
          });
          updateDebugStep('redirect', 'loading', 'Profile pending approval - redirecting...');
          navigate('/approval-pending', { replace: true });
          return;
        }

        // If user is approved, check status
        if (profile.approval_status === 'approved') {
          if (profile.status === 'active') {
            console.log('User approved and active, redirecting to dashboard');
            updateDebugStep('redirect', 'loading', 'User active - redirecting to dashboard...');
            navigate('/', { replace: true });
            return;
          } else if (profile.status === 'hold') {
            console.log('User approved but on hold');
            updateDebugStep('redirect', 'loading', 'User on hold - redirecting...');
            navigate('/hold', { replace: true });
            return;
          } else if (profile.status === 'suspend') {
            console.log('User approved but suspended');
            updateDebugStep('redirect', 'loading', 'User suspended - redirecting...');
            navigate('/suspended', { replace: true });
            return;
          }
        }

        // If user is rejected
        if (profile.approval_status === 'rejected') {
          console.log('User rejected');
          updateDebugStep('redirect', 'loading', 'User rejected - redirecting...');
          navigate('/rejected', { replace: true });
          return;
        }

        // Default fallback
        console.log('Default fallback to profile completion');
        updateDebugStep('redirect', 'loading', 'Default redirect to profile completion...');
        navigate('/profile-completion', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        updateDebugStep('redirect', 'error', 'An error occurred during authentication');
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

  const getStepIcon = (status: DebugStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepColor = (status: DebugStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'loading':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Show loading spinner while processing
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Processing Authentication</h2>
            <p className="text-gray-500">Please wait while we set up your account...</p>
            {retryCount > 0 && (
              <p className="text-sm text-gray-400 mt-2">Attempt {retryCount + 1} of 3</p>
            )}
            {isMobileBrowser() && (
              <p className="text-xs text-gray-400 mt-1">Mobile device detected</p>
            )}
          </div>

          {/* Debug Steps */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Debug Steps:</h3>
            {debugSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-500 ease-in-out ${getStepColor(step.status)
                  } ${step.status === 'loading' ? 'animate-pulse' : ''}`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  opacity: step.status === 'pending' ? 0.6 : 1
                }}
              >
                {getStepIcon(step.status)}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{step.title}</p>
                  {step.message && (
                    <p className="text-xs mt-1 opacity-75">{step.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
          <button
            onClick={() => {
              setError("");
              setLoading(true);
              setRetryCount(0);
              navigate('/login', { replace: true });
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
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