import { Plus } from "lucide-react";
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
      case 'upcoming_birthdays':
        navigate("/customers?filter=birthday");
        break;
      case 'total_customers':
        navigate("/customers?filter=all");
        break;
      case 'active_policies':
        navigate("/customers?filter=active");
        break;
      default:
        navigate("/customers");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your insurance policies and customers</p>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              Welcome, {user.email}
            </p>
          )}
        </div>
        <div className="hidden md:block">
          <Button
            onClick={handleAddCustomer}
            className="bg-gradient-primary shadow-primary rounded-lg px-6 py-2 hover:scale-105 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <StatsCards onTileClick={handleStatsClick} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpiryAlerts />
        </div>
        <div>
          <QuickActions onAddCustomer={handleAddCustomer} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;