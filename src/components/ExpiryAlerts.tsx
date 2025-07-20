import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  AlertTriangle, 
  Phone, 
  MessageCircle,
  Calendar,
  Car,
  User,
  Eye,
  Bike,
  Bus
} from "lucide-react";
import { CustomerDetails } from "@/components/CustomerDetails";
import { WhatsAppTemplates } from "@/components/WhatsAppTemplates";

export const ExpiryAlerts = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const expiringPolicies = [
    {
      id: 1,
      name: "Rajesh Kumar",
      contact: "+91 98765 43210",
      vehicleType: "4-Wheeler",
      brand: "Maruti",
      model: "Swift",
      rcNumber: "DL-01-AB-1234",
      expiryDate: "2024-01-15",
      daysLeft: 3,
      urgency: "critical"
    },
    {
      id: 2,
      name: "Priya Sharma",
      contact: "+91 87654 32109",
      vehicleType: "2-Wheeler",
      brand: "Honda",
      model: "Activa",
      rcNumber: "DL-02-CD-5678",
      expiryDate: "2024-01-18",
      daysLeft: 6,
      urgency: "high"
    },
    {
      id: 3,
      name: "Amit Singh",
      contact: "+91 76543 21098",
      vehicleType: "4-Wheeler",
      brand: "Hyundai",
      model: "Creta",
      rcNumber: "DL-03-EF-9012",
      expiryDate: "2024-01-22",
      daysLeft: 10,
      urgency: "medium"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'high': return 'text-warning bg-warning/10 border-warning/20';
      case 'medium': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case '2-Wheeler': return <Bike className="h-4 w-4" />;
      case '4-Wheeler': return <Car className="h-4 w-4" />;
      case 'Bus': return <Bus className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleCardClick = (policy: any) => {
    setSelectedCustomer({
      id: policy.id,
      name: policy.name,
      contact: policy.contact,
      vehicleType: policy.vehicleType,
      brand: policy.brand,
      model: policy.model,
      rcNumber: policy.rcNumber,
      expiryDate: policy.expiryDate,
      daysToExpiry: policy.daysLeft
    });
    setShowDetails(true);
  };

  const handleWhatsAppClick = (policy: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCustomer({
      id: policy.id,
      name: policy.name,
      contact: policy.contact,
      vehicleType: policy.vehicleType,
      brand: policy.brand,
      model: policy.model,
      rcNumber: policy.rcNumber,
      expiryDate: policy.expiryDate,
      daysToExpiry: policy.daysLeft
    });
    setShowWhatsApp(true);
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <AlertTriangle className="mr-2 h-5 w-5 text-warning" />
          Policy Expiry Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4 p-4 md:p-6">
          {expiringPolicies.map((policy) => (
            <div 
              key={policy.id} 
              className="bg-card p-3 md:p-4 rounded-lg border border-border hover:shadow-hover transition-all duration-300 cursor-pointer"
              onClick={() => handleCardClick(policy)}
            >
              <div className="flex items-start md:items-center justify-between mb-3 flex-col md:flex-row gap-2 md:gap-0">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">
                      {getInitials(policy.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-foreground text-sm md:text-base truncate">{policy.name}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{policy.contact}</p>
                  </div>
                </div>
                <Badge className={`${getUrgencyColor(policy.urgency)} border text-xs flex-shrink-0`}>
                  {policy.daysLeft}d left
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-3">
                <div className="flex items-center space-x-2 min-w-0">
                  {getVehicleIcon(policy.vehicleType)}
                  <span className="text-xs md:text-sm text-foreground truncate">{policy.brand} {policy.model}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs md:text-sm text-foreground truncate">{policy.expiryDate}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs md:text-sm text-muted-foreground truncate flex-1 min-w-0">RC: {policy.rcNumber}</span>
                <div className="flex space-x-1 md:space-x-2 flex-shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs px-2 md:px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Set customer data in localStorage and navigate
                      localStorage.setItem('pendingCall', JSON.stringify({
                        id: policy.id,
                        name: policy.name,
                        phone: policy.contact,
                        from: 'expiry-alerts'
                      }));
                      window.location.href = '/call-management';
                    }}
                  >
                    <Phone className="h-3 w-3" />
                    <span className="hidden md:inline ml-1">Call</span>
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-success text-xs px-2 md:px-3"
                    onClick={(e) => handleWhatsAppClick(policy, e)}
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span className="hidden md:inline ml-1">WhatsApp</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="text-xs px-2 md:px-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="h-3 w-3" />
                    <span className="hidden md:inline ml-1">View</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full">
            View All Expiring Policies
          </Button>
        </div>
      </CardContent>

      {/* Customer Details Modal */}
      <CustomerDetails
        customer={selectedCustomer}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      {/* WhatsApp Templates Modal */}
      <WhatsAppTemplates
        customer={selectedCustomer}
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        messageType="expiry"
      />
    </Card>
  );
};