import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import MobileNavigation from "./MobileNavigation";
import { useAuth } from "@/contexts/AuthContext";

export const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <MobileNavigation />

    </div>
  );
};