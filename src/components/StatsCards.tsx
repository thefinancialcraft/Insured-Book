import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  TrendingUp,
  Car,
  CheckCircle,
  DollarSign,
  Phone,
  PhoneCall,
  CheckCircle2,
  XCircle
} from "lucide-react";

interface StatsCardsProps {
  onTileClick?: (type: string) => void;
}

export const StatsCards = ({ onTileClick }: StatsCardsProps) => {
  const stats = [
    {
      title: "Total Customers",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      gradient: "bg-gradient-primary"
    },
    {
      title: "Expiring This Month",
      value: "28",
      change: "7 days left",
      changeType: "warning",
      icon: Clock,
      gradient: "bg-gradient-to-br from-warning to-orange-500"
    },
    {
      title: "Upcoming Birthdays",
      value: "15",
      change: "This week: 3",
      changeType: "neutral",
      icon: Calendar,
      gradient: "bg-gradient-success"
    },
    {
      title: "Active Policies",
      value: "1,156",
      change: "+8.2%",
      changeType: "increase",
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-blue-500 to-purple-600"
    }
  ];

  const callStats = [
    {
      title: "Today's Calls",
      value: "47",
      change: "+15%",
      changeType: "increase",
      icon: Phone,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Connected Calls",
      value: "38",
      change: "+8%",
      changeType: "increase",
      icon: PhoneCall,
      gradient: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "Interested Leads",
      value: "12",
      change: "+25%",
      changeType: "increase",
      icon: CheckCircle2,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      title: "Follow-up Required",
      value: "8",
      change: "-10%",
      changeType: "warning",
      icon: Clock,
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0 animate-scale-in cursor-pointer" 
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onTileClick && onTileClick(stat.title.toLowerCase().replace(/\s+/g, '_'))}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                <span className="hidden md:inline">{stat.title}</span>
                <span className="md:hidden">{stat.title.split(' ')[0]}</span>
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.gradient}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  stat.changeType === 'increase' ? 'text-success bg-success/10' :
                  stat.changeType === 'warning' ? 'text-warning bg-warning/10' :
                  'text-muted-foreground bg-muted'
                }`}
              >
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call Management Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Call Management Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {callStats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0" 
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  <span className="hidden md:inline">{stat.title}</span>
                  <span className="md:hidden">{stat.title.split(' ')[0]}</span>
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.gradient}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    stat.changeType === 'increase' ? 'text-success bg-success/10' :
                    stat.changeType === 'warning' ? 'text-warning bg-warning/10' :
                    'text-muted-foreground bg-muted'
                  }`}
                >
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};