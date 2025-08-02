import { CustomerList } from "@/components/CustomerList";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Search, Filter, Plus, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "";
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get user data
  const userData = {
    userName: user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`.trim()
      : user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || "User",
  };

  const handleAddCustomer = () => {
    navigate("/registration");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-4 md:p-8 text-white shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0 lg:flex-1">
              <div className="hidden md:flex items-center space-x-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-medium">Customer Management</p>
                  <p className="text-xs text-blue-200">Complete overview</p>
                </div>
              </div>

              <h1 className="text-lg md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 leading-tight text-center md:text-left">
                👋 Welcome to Customer Hub!
                <br className="md:hidden" />
                <span className="text-blue-200 block text-xl md:text-3xl lg:text-4xl tracking-wide capitalize">{userData.userName}</span>
              </h1>

              <p className="text-blue-100 text-sm md:text-lg max-w-2xl leading-relaxed hidden md:block">
                Manage your customer database, track policies, and monitor renewals all in one place.
              </p>
            </div>

            <div className="lg:ml-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="bg-white/20 rounded-xl md:rounded-2xl p-2 md:p-3">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs md:text-sm font-medium">Today's Date</p>
                    <p className="font-bold text-base md:text-lg">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-blue-200 text-xs md:text-sm">
                      {new Date().getFullYear()}
                    </p>
                  </div>
                </div>

                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs md:text-sm">Total Customers</p>
                      <p className="font-bold text-lg md:text-xl">1,234</p>
                    </div>
                    <div className="bg-green-500/20 rounded-lg md:rounded-xl p-2">
                      <TrendingUp className="h-4 w-4 text-green-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-gray-900">1,156</p>
            </div>
            <div className="bg-green-100 p-2 rounded-xl">
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+8.2% this month</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-xl">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">7 days left</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Week</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-xl">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">+15.3% this week</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Calls</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-xl">
              <Search className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">3 urgent</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-transparent md:bg-white/80 backdrop-blur-sm rounded-3xl p-0 md:p-6 border-0 md:border border-white/50 shadow-none md:shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-xl">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Customer Database</h2>
            </div>
          </div>
          <Button
            onClick={handleAddCustomer}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900"
          >
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Add Customer</span>
          </Button>
        </div>

        <CustomerList filter={filter} />
      </div>
    </div>
  );
};

export default Customers;