import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Car,
  Users,
  Phone,
  BarChart3,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  Menu,
  FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Call Management", href: "/call-management", icon: Phone },
    { name: "Registration", href: "/registration", icon: FileText },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase();
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-2 rounded-xl shadow-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">MotorKavach</h1>
              <p className="text-xs text-gray-600">Insurance Management</p>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.href)
                    ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          {/* Desktop Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserName()} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserName()}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-16">
          {/* Left: User Avatar */}
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserName()} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
          {/* Center: App Title & Subtitle */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-base font-bold text-gray-900 leading-tight">MotorKavach</span>
            <span className="text-xs text-gray-500 leading-tight">Insurance Management</span>
          </div>
          {/* Right: Logout Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="p-2 text-red-600 hover:text-red-800"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
