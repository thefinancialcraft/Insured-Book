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
  Gift,
  TrendingUp,
  Settings,
  BarChart3
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
      gradient: "bg-gradient-to-r from-purple-600 to-purple-800",
      textColor: "text-white"
    },
    {
      title: "Send Messages",
      description: "Bulk WhatsApp",
      icon: MessageCircle,
      action: () => console.log("Bulk WhatsApp"),
      gradient: "bg-gradient-to-r from-green-500 to-green-700",
      textColor: "text-white"
    },
    {
      title: "Generate Report",
      description: "Monthly analytics",
      icon: Download,
      action: () => console.log("Generate report"),
      gradient: "bg-gradient-to-r from-blue-500 to-blue-700",
      textColor: "text-white"
    },
    {
      title: "View Analytics",
      description: "Performance insights",
      icon: BarChart3,
      action: () => console.log("View analytics"),
      gradient: "bg-gradient-to-r from-orange-500 to-orange-700",
      textColor: "text-white"
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center space-x-2 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-2 rounded-xl">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.action}
            className={`w-full h-auto p-4 ${action.gradient} ${action.textColor} hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl`}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="bg-white/20 p-2 rounded-xl">
                <action.icon className="h-4 w-4" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-sm">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 p-2 rounded-xl">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900">Today's Summary</h4>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Sales Target</span>
            </div>
            <span className="font-semibold text-green-700">85%</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Calls Made</span>
            </div>
            <span className="font-semibold text-blue-700">47/50</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-700">New Leads</span>
            </div>
            <span className="font-semibold text-purple-700">12</span>
          </div>
        </div>
      </div>
    </div>
  );
};