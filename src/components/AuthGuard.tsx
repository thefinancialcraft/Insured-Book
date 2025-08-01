import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useLocation, useNavigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { profile, needsProfileCompletion, needsApproval, isApproved, loading: profileLoading } = useProfileCompletion();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

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
    console.log("Needs profile completion:", needsProfileCompletion);
    console.log("Needs approval:", needsApproval);
    console.log("Is approved:", isApproved);

    // If no user, redirect to login (except for public routes)
    if (!user) {
      if (location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/auth/callback") {
        console.log("No user, redirecting to login");
        navigate("/login");
      }
      return;
    }

    // If user exists, check their profile and role
    if (user && profile) {
      console.log("User and profile exist, checking permissions");

      // If user is admin and approved, redirect to admin panel
      if (profile.role === 'admin' && profile.status === 'approved') {
        if (location.pathname !== "/admin") {
          console.log("Admin user, redirecting to admin panel");
          navigate("/admin");
          return;
        }
      }

      // If user is approved or active, redirect to dashboard (unless already there)
      if ((profile.status === 'approved' || profile.status === 'active') &&
        location.pathname !== "/" &&
        location.pathname !== "/admin") {
        console.log("User approved/active, redirecting to dashboard");
        navigate('/');
        return;
      }

      // If user is on hold, redirect to approval pending
      if (profile.status === 'hold' && location.pathname !== "/approval-pending") {
        console.log("User on hold, redirecting to approval pending");
        navigate('/approval-pending');
        return;
      }

      // If user is suspended, redirect to approval pending
      if (profile.status === 'suspend' && location.pathname !== "/approval-pending") {
        console.log("User suspended, redirecting to approval pending");
        navigate('/approval-pending');
        return;
      }

      // If user is rejected, redirect to approval pending
      if (profile.status === 'rejected' && location.pathname !== "/approval-pending") {
        console.log("User rejected, redirecting to approval pending");
        navigate('/approval-pending');
        return;
      }
    }

    // Check if user needs to complete profile
    if (user && needsProfileCompletion &&
      location.pathname !== "/profile-completion" &&
      location.pathname !== "/complete-profile") {
      console.log("User needs profile completion, redirecting");
      navigate("/profile-completion");
      return;
    }

    // Check if user needs approval
    if (user && needsApproval &&
      location.pathname !== "/approval-pending") {
      console.log("User needs approval, redirecting to approval pending");
      navigate("/approval-pending");
      return;
    }

    // If user is approved and trying to access approval page, redirect to dashboard
    if (user && isApproved && location.pathname === "/approval-pending") {
      console.log("Approved user on approval page, redirecting to dashboard");
      navigate("/");
      return;
    }

    // If user is admin and trying to access non-admin pages, redirect to admin panel
    if (user && profile && profile.role === 'admin' && profile.status === 'approved') {
      if (location.pathname !== "/admin" &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/auth/callback") {
        console.log("Admin user on non-admin page, redirecting to admin panel");
        navigate("/admin");
        return;
      }
    }

    console.log("Auth guard checks passed, allowing access");
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