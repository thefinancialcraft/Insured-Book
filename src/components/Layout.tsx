import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Users, 
  Plus, 
  Download, 
  MessageCircle, 
  FileText,
  Bell,
  Search,
  Menu,
  Phone,
  UserPlus,
  Car
} from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPlusOptions, setShowPlusOptions] = useState(false);
  
  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

    const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleAddCustomer = () => {
    navigate("/registration");
  };

  // Hide layout if not logged in
  if (!localStorage.getItem("isLoggedIn") && location.pathname !== "/login") {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border shadow-card relative z-50">
        <div className="container mx-auto px-4 py-2 md:py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">InsuranceManager</h1>
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

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" size="sm" onClick={handleLogout}>
                <Download className="h-4 w-4 rotate-90 " />
                
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pt-4 md:pt-8">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-card z-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 items-center py-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex-col h-auto py-1 transition-colors"
            >
              <Link to="/">
                <TrendingUp className={`h-4 w-4 ${isActive("/") ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs mt-0.5">Dashboard</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex-col h-auto py-1 transition-colors"
            >
              <Link to="/customers">
                <Users className={`h-4 w-4 ${isActive("/customers") ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs mt-0.5">Customers</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex-col h-auto py-1 transition-colors"
            >
              <Link to="/call-management">
                <Phone className={`h-4 w-4 ${isActive("/call-management") ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs mt-0.5">CRM</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex-col h-auto py-1 transition-colors"
            >
              <Link to="/registration">
                <FileText className={`h-4 w-4 ${isActive("/registration") ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs mt-0.5">Form</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Padding */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default Layout;