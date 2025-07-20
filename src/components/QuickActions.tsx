import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MessageCircle, 
  Download, 
  Calendar,
  Search,
  FileText,
  Users,
  Gift
} from "lucide-react";

interface QuickActionsProps {
  onAddCustomer: () => void;
}

export const QuickActions = ({ onAddCustomer }: QuickActionsProps) => {
  const actions = [
    {
      title: "Add Customer",
      description: "Register new policy",
      icon: Plus,
      action: onAddCustomer,
      gradient: "bg-gradient-primary",
      textColor: "text-primary-foreground"
    },
    {
      title: "Send Birthday Wishes",
      description: "Today's birthdays",
      icon: Gift,
      action: () => console.log("Birthday wishes"),
      gradient: "bg-gradient-success",
      textColor: "text-success-foreground"
    },
    {
      title: "Bulk WhatsApp",
      description: "Send to multiple",
      icon: MessageCircle,
      action: () => console.log("Bulk WhatsApp"),
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
      textColor: "text-white"
    },
    {
      title: "Generate Report",
      description: "Monthly analytics",
      icon: Download,
      action: () => console.log("Generate report"),
      gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
      textColor: "text-white"
    }
  ];

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              className={`w-full h-auto p-4 ${action.gradient} ${action.textColor} hover:opacity-90 transition-all duration-300 shadow-card hover:shadow-hover`}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="bg-white/20 p-2 rounded-lg">
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="font-semibold text-foreground mb-3">Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Today's Calls</span>
              <span className="font-medium text-foreground">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Messages Sent</span>
              <span className="font-medium text-foreground">28</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">New Policies</span>
              <span className="font-medium text-foreground">5</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};