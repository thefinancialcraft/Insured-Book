import { Plus, Calendar, TrendingUp, Bell, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCards } from "@/components/StatsCards";
import { ExpiryAlerts } from "@/components/ExpiryAlerts";
import { QuickActions } from "@/components/QuickActions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddCustomer = () => {
    navigate("/registration");
  };

  const handleStatsClick = (type: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (type) {
      case 'expiring_this_month':
        navigate("/customers?filter=expiring");
        break;
      case 'upcoming_policy':
        navigate("/customers?filter=upcoming");
        break;
      case 'total_customers':
        navigate("/customers?filter=all");
        break;
      case 'active_policy':
        navigate("/customers?filter=active");
        break;
      case 'rejected/expired':
        navigate("/customers?filter=rejected");
        break;
      case 'sales_gross':
        navigate("/customers?filter=sales&type=gross");
        break;
      case 'sales_net':
        navigate("/customers?filter=sales&type=net");
        break;
      case 'cases':
        navigate("/customers?filter=cases");
        break;
      case 'earned':
        navigate("/customers?filter=earned");
        break;
      case 'discount':
        navigate("/customers?filter=discount");
        break;
      default:
        navigate("/customers");
    }
  };

  // Get user data
  const userData = {
    userName: user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`.trim()
      : user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || "User",
  };

  // Sample sales data for the graph
  const salesData = [
    { month: 'Jan', sales: 180000 },
    { month: 'Feb', sales: 220000 },
    { month: 'Mar', sales: 195000 },
    { month: 'Apr', sales: 245000 },
    { month: 'May', sales: 280000 },
    { month: 'Jun', sales: 320000 },
    { month: 'Jul', sales: 265000 },
    { month: 'Aug', sales: 310000 },
    { month: 'Sep', sales: 345000 },
    { month: 'Oct', sales: 380000 },
    { month: 'Nov', sales: 420000 },
    { month: 'Dec', sales: 450000 }
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-4 md:p-8 text-white shadow-2xl pt-1 md:pt-8">
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
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-purple-100 text-sm font-medium">Dashboard Overview</p>
                  <p className="text-xs text-purple-200">Real-time insights</p>
                </div>
              </div>

              <h1 className="text-lg md:text-3xl lg:text-4xl font-bold pt-4 md:mb-3 leading-tight text-center md:text-left">
              👋 Welcome back! 
                <br className="md:hidden" />
                <span className="text-purple-200 block text-2xl md:text-4xl lg:text-5xl tracking-wide capitalize">{userData.userName}</span>
              </h1>

              <p className="text-purple-100 text-sm md:text-lg max-w-2xl leading-relaxed hidden md:block">
                Your insurance business is thriving today. Here's what's happening with your customers and sales performance.
              </p>
            </div>

            <div className="lg:ml-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="bg-white/20 rounded-xl md:rounded-2xl p-2 md:p-3">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-100 text-xs md:text-sm font-medium">Today's Date</p>
                    <p className="font-bold text-base md:text-lg">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-purple-200 text-xs md:text-sm">
                      {new Date().getFullYear()}
                    </p>
                  </div>
                </div>

                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-xs md:text-sm">Today's Sales</p>
                      <p className="font-bold text-lg md:text-xl">₹45,200</p>
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
              <p className="text-sm text-gray-600">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">₹45,200</p>
            </div>
            <div className="bg-green-100 p-2 rounded-xl">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+12.5% from yesterday</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-gray-900">1,156</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-xl">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">+8.2% this month</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Customers</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-xl">
              <Plus className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">+15.3% this week</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Calls</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-xl">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">3 urgent</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Stats and Sales */}
        <div className="lg:col-span-8 space-y-6">
          {/* Sales Graph */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
                <p className="text-sm text-gray-600">Monthly performance trends</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Last 6 months</span>
              </div>
            </div>

            {/* Enhanced Bar Chart */}
            <div className="flex items-end justify-between h-32 space-x-2">
              {salesData.slice(-6).map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-3 flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-700 rounded-t-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 cursor-pointer shadow-sm"
                    style={{
                      height: `${(data.sales / maxSales) * 100}px`,
                      minHeight: '8px'
                    }}
                  />
                  <span className="text-xs font-medium text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Month Sales</span>
                <span className="text-lg font-bold text-purple-700">
                  ₹{salesData[salesData.length - 1].sales.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards onTileClick={handleStatsClick} />
        </div>

        {/* Right Column - Actions and Alerts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <QuickActions onAddCustomer={handleAddCustomer} />

          {/* Expiry Alerts */}
          <ExpiryAlerts />
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleAddCustomer}
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 h-auto rounded-2xl shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Add Customer</span>
          </Button>
          <Button
            onClick={() => navigate("/customers")}
            variant="outline"
            className="border-gray-200 p-4 h-auto rounded-2xl bg-white/70 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-gray-700">View All</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;