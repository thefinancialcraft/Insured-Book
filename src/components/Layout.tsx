import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Navigation Header */}
      <Header onLogout={handleLogout} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-8">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default Layout;