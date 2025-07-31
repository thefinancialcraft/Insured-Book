import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    if (!loading && !user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, loading, location.pathname, navigate]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not logged in and not on login page, don't render anything
  if (!user && location.pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard; 