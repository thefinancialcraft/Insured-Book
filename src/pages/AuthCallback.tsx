import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Starting OAuth callback handling');
        console.log('Current URL:', window.location.href);
        console.log('URL hash:', window.location.hash);
        
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Supabase session data:', data);
        console.log('Supabase session error:', error);
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_failed');
          return;
        }

        if (data.session) {
          const user = data.session.user;
          console.log('User authenticated:', user);
          
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
            
            console.log('Profile completion check:', {
              hasCompleteProfile,
              userMetadata: user.user_metadata
            });
            
            if (!hasCompleteProfile) {
              // Redirect to profile completion page
              console.log('Redirecting to profile completion');
              navigate('/complete-profile');
              return;
            }
          }
          
          // Successful authentication with complete profile
          console.log('Redirecting to dashboard');
          navigate('/');
        } else {
          // No session found, try to get session from URL hash
          console.log('No session found, checking URL hash');
          
          // Check if there's an access token in the URL hash
          const hash = window.location.hash;
          if (hash && hash.includes('access_token')) {
            console.log('Access token found in URL hash');
            // Wait a moment for Supabase to process the token
            setTimeout(async () => {
              const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
              console.log('Session data after timeout:', sessionData);
              console.log('Session error after timeout:', sessionError);
              
              if (sessionData.session) {
                console.log('Session established from token');
                navigate('/');
              } else {
                console.error('Failed to establish session:', sessionError);
                navigate('/login?error=session_failed');
              }
            }, 2000); // Increased timeout to 2 seconds
          } else {
            console.log('No access token found, redirecting to login');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        navigate('/login?error=unexpected');
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
        <p className="text-xs text-gray-400 mt-2">Processing OAuth callback...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 