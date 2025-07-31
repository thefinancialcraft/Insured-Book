import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  FileText,
  Phone
} from "lucide-react";

const MobileNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
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
    </>
  );
};

export default MobileNavigation; 