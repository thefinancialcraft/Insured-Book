import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Phone,
  FileText,
  Plus
} from "lucide-react";

const MobileNavigation = () => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Calls", href: "/call-management", icon: Phone },
    { name: "Registration", href: "/registration", icon: FileText },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-200 ${isActive(item.href)
                  ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-base font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Floating Action Button */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <Link to="/registration">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full h-12 w-12 p-0 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation; 