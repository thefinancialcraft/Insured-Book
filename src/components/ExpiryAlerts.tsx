import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Calendar, Phone, MessageCircle } from "lucide-react";

export const ExpiryAlerts = () => {
  const expiringPolicies = [
    {
      id: 1,
      customerName: "Rahul Sharma",
      contact: "+91 98765 43210",
      rcNumber: "MH12AB1234",
      expiryDate: "2024-01-15",
      daysLeft: 3,
      urgency: "high"
    },
    {
      id: 2,
      customerName: "Priya Patel",
      contact: "+91 87654 32109",
      rcNumber: "DL01CD5678",
      expiryDate: "2024-01-18",
      daysLeft: 6,
      urgency: "medium"
    },
    {
      id: 3,
      customerName: "Amit Kumar",
      contact: "+91 76543 21098",
      rcNumber: "KA02EF9012",
      expiryDate: "2024-01-20",
      daysLeft: 8,
      urgency: "medium"
    },
    {
      id: 4,
      customerName: "Neha Singh",
      contact: "+91 65432 10987",
      rcNumber: "TN03GH3456",
      expiryDate: "2024-01-22",
      daysLeft: 10,
      urgency: "low"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-500 to-red-700 p-2 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Expiring Policies</h3>
            <p className="text-sm text-gray-600">Policies expiring this month</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-200">
          {expiringPolicies.length} alerts
        </Badge>
      </div>

      <div className="space-y-4">
        {expiringPolicies.map((policy) => (
          <div
            key={policy.id}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold">
                    {policy.customerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate max-w-[120px] md:max-w-xs">{policy.customerName}</h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getUrgencyColor(policy.urgency)}`}
                    >
                      {policy.daysLeft} days left
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span className="truncate max-w-[120px] md:max-w-xs">{policy.contact}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span className="truncate max-w-[120px] md:max-w-xs">RC: {policy.rcNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className={`h-3 w-3 ${getUrgencyIcon(policy.urgency)}`} />
                      <span>Expires: {new Date(policy.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Action buttons: stack vertically on mobile, row on md+ */}
              <div className="flex flex-row md:flex-col gap-2 md:ml-4 w-full md:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-200 bg-white/50 hover:bg-white/80 flex-1 md:flex-none"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  <span className="hidden md:inline">Call</span>
                  <span className="md:hidden">Call</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-200 bg-white/50 hover:bg-white/80 flex-1 md:flex-none"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  <span className="hidden md:inline">Message</span>
                  <span className="md:hidden">Msg</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          className="w-full border-gray-200 bg-white/50 hover:bg-white/80"
        >
          View All Expiring Policies
        </Button>
      </div>
    </div>
  );
};