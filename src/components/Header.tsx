import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  FileText,
  Phone,
  Car,
  Download,
  User,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Get user data from Google authentication or use defaults
  const userData = {
    userName: user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`.trim()
      : user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "User",
    lastLogin: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Not available",
    profilePicture: user?.user_metadata?.picture || user?.user_metadata?.avatar_url || ""
  };

  return (
    <header className="bg-card border-b border-border shadow-card relative z-50">
      <div className="container mx-auto px-4 py-2 md:py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">MotorKavach</h1>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              asChild
              className={isActive("/") ? "bg-gradient-primary shadow-primary" : ""}
            >
              <Link to="/">
                <TrendingUp className=" h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant={isActive("/customers") ? "default" : "ghost"}
              asChild
              className={isActive("/customers") ? "bg-gradient-primary shadow-primary" : ""}
            >
              <Link to="/customers">
                <Users className="h-4 w-4" />
                Customers
              </Link>
            </Button>
            <Button
              variant={isActive("/call-management") ? "default" : "ghost"}
              asChild
              className={isActive("/call-management") ? "bg-gradient-primary shadow-primary" : ""}
            >
              <Link to="/call-management">
                <Phone className="h-4 w-4" />
                Calling
              </Link>
            </Button>
            <Button
              variant={isActive("/registration") ? "default" : "ghost"}
              asChild
              className={isActive("/registration") ? "bg-gradient-primary shadow-primary" : ""}
            >
              <Link to="/registration">
                <FileText className=" h-4 w-4" />
                Registration
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Profile Section */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userData.userName}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Last login: {userData.lastLogin}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="p-0 h-8 w-8 rounded-full overflow-hidden">
                <Link to="/profile">
                  {userData.profilePicture ? (
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      className="h-8 w-8 object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <User className={`h-4 w-4 ${userData.profilePicture ? 'hidden' : ''}`} />
                </Link>
              </Button>
            </div>

            <Button className="bg-red-500 hover:bg-red-600 text-white" size="sm" onClick={onLogout}>
              <Download className="h-4 w-4 rotate-90 " />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
