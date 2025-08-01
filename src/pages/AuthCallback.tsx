import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait a moment for auth state to settle
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!user) {
          setError("Authentication failed");
          setLoading(false);
          return;
        }

        // Check if user has a complete profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          setError("Failed to fetch user profile");
          setLoading(false);
          return;
        }

        // If user has no profile, redirect to profile completion
        if (!profile) {
          console.log('No profile found, redirecting to profile completion');
          navigate('/profile-completion');
          return;
        }

        // If user is admin and approved, redirect to admin panel
        if (profile.role === 'admin' && profile.status === 'approved') {
          console.log('Admin user detected, redirecting to admin panel');
          navigate('/admin');
          return;
        }

        // If user has complete profile but needs approval
        if (profile.status === 'pending') {
          console.log('Profile complete but pending approval');
          navigate('/approval-pending');
          return;
        }

        // If user is approved, redirect to dashboard
        if (profile.status === 'approved') {
          console.log('User approved, redirecting to dashboard');
          navigate('/');
          return;
        }

        // If user is rejected
        if (profile.status === 'rejected') {
          console.log('User rejected');
          navigate('/approval-pending');
          return;
        }

        // Default fallback
        navigate('/profile-completion');
      } catch (error) {
        console.error('Auth callback error:', error);
        setError("An error occurred during authentication");
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Authentication</h2>
          <p className="text-gray-600">Please wait while we set up your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/login')}
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