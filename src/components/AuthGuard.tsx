import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useLocation, useNavigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { profile, needsProfileCompletion, needsApproval, isApproved, loading: profileLoading } = useProfileCompletion();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const lastRedirectPath = useRef<string | null>(null);

  useEffect(() => {
    // Wait for both auth and profile to be loaded
    if (loading || profileLoading) {
      return;
    }

    // Mark as initialized after first load
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    console.log("=== AUTH GUARD DEBUG ===");
    console.log("User:", user?.id);
    console.log("Profile:", profile);
    console.log("Current path:", location.pathname);
    console.log("Last redirect path:", lastRedirectPath.current);
    console.log("Needs profile completion:", needsProfileCompletion);
    console.log("Needs approval:", needsApproval);
    console.log("Is approved:", isApproved);

    // Prevent infinite redirects by checking if we're already redirecting to this path
    if (lastRedirectPath.current === location.pathname) {
      console.log("Already redirected to this path, stopping");
      return;
    }

    // If no user, redirect to login (except for public routes)
    if (!user) {
      if (location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/auth/callback") {
        console.log("No user, redirecting to login");
        lastRedirectPath.current = "/login";
        navigate("/login");
      }
      return;
    }

    // If user exists but no profile yet, wait
    if (user && !profile) {
      console.log("User exists but profile not loaded yet");
      return;
    }

    // If user and profile exist, check permissions
    if (user && profile) {
      console.log("User and profile exist, checking permissions");

      // PRIORITY 1: Admin users - redirect to admin panel if approved
      if (profile.role === 'admin' && profile.approval_status === 'approved') {
        if (location.pathname !== "/admin") {
          console.log("Admin user, redirecting to admin panel");
          lastRedirectPath.current = "/admin";
          navigate("/admin");
          return;
        }
        // Admin is on correct page, allow access
        console.log("Admin user on admin page, allowing access");
        lastRedirectPath.current = null;
        return;
      }

      // PRIORITY 2: Check approval status for non-admin users
      if (profile.approval_status === 'rejected' && location.pathname !== "/rejected") {
        console.log("User rejected, redirecting to rejection page");
        lastRedirectPath.current = "/rejected";
        navigate('/rejected');
        return;
      }

      if (profile.approval_status === 'pending' && location.pathname !== "/approval-pending") {
        console.log("User needs approval, redirecting to approval pending");
        lastRedirectPath.current = "/approval-pending";
        navigate('/approval-pending');
        return;
      }

      // PRIORITY 3: Check status for approved users
      if (profile.approval_status === 'approved') {
        if (profile.status === 'hold' && location.pathname !== "/hold") {
          console.log("User approved but on hold, redirecting to hold page");
          lastRedirectPath.current = "/hold";
          navigate('/hold');
          return;
        }

        if (profile.status === 'suspend' && location.pathname !== "/suspended") {
          console.log("User approved but suspended, redirecting to suspended page");
          lastRedirectPath.current = "/suspended";
          navigate('/suspended');
          return;
        }

        if (profile.status === 'active') {
          // Regular user on dashboard or other pages
          if (location.pathname === "/admin") {
            console.log("Non-admin user trying to access admin, redirecting to dashboard");
            lastRedirectPath.current = "/";
            navigate('/');
            return;
          }
          // User is on correct page, allow access
          console.log("Approved active user, allowing access");
          lastRedirectPath.current = null;
          return;
        }
      }
    }

    // PRIORITY 4: Check if user needs to complete profile
    if (user && needsProfileCompletion &&
      location.pathname !== "/profile-completion" &&
      location.pathname !== "/complete-profile") {
      console.log("User needs profile completion, redirecting");
      lastRedirectPath.current = "/profile-completion";
      navigate("/profile-completion");
      return;
    }

    console.log("Auth guard checks passed, allowing access");
    lastRedirectPath.current = null;
  }, [user, loading, profileLoading, profile, needsProfileCompletion, needsApproval, isApproved, location.pathname, navigate, isInitialized]);

  // Show loading spinner while checking authentication
  if (loading || profileLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard; 