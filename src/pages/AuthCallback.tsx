import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        navigate('/login?error=auth_failed');
        return;
      }

      if (data.session) {
        const user = data.session.user;
        
        // Check if this is a Google OAuth user and if they need to complete their profile
        if (user.app_metadata?.provider === 'google') {
          // Check if user has complete profile data
          const hasCompleteProfile = user.user_metadata?.first_name && 
                                   user.user_metadata?.last_name &&
                                   user.user_metadata?.phone_number && 
                                   user.user_metadata?.address && 
                                   user.user_metadata?.city && 
                                   user.user_metadata?.state && 
                                   user.user_metadata?.pincode && 
                                   user.user_metadata?.dob;
          
          if (!hasCompleteProfile) {
            // Redirect to profile completion page
            navigate('/complete-profile');
            return;
          }
        }
        
        // Successful authentication with complete profile
        navigate('/');
      } else {
        // No session found
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Signing you in...</h2>
        <p className="text-gray-500">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback; 