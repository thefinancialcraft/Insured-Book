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
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Ban,
  Receipt,
  Calculator,
  Briefcase,
  Award,
  Percent
} from "lucide-react";
import React from "react";

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
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      color: "text-blue-600"
    },
    {
      title: "Expiring This Month",
      value: "28",
      change: "7 days left",
      changeType: "warning",
      icon: Clock,
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
      color: "text-orange-600"
    },
    {
      title: "Upcoming Policy",
      value: "45",
      change: "Current + Next Month",
      changeType: "neutral",
      icon: FileText,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      color: "text-purple-600"
    },
    {
      title: "Active Policy",
      value: "1,156",
      change: "+8.2%",
      changeType: "increase",
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
      color: "text-green-600"
    },
    {
      title: "Rejected/Expired",
      value: "23",
      change: "-5%",
      changeType: "warning",
      icon: Ban,
      gradient: "bg-gradient-to-br from-red-500 to-red-600",
      color: "text-red-600"
    }
  ];

  const salesStats = [
    {
      title: "Sales Gross",
      value: "₹2,45,000",
      change: "+15.3%",
      changeType: "increase",
      icon: Receipt,
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      color: "text-emerald-600"
    },
    {
      title: "Sales Net",
      value: "₹1,98,500",
      change: "+12.8%",
      changeType: "increase",
      icon: Calculator,
      gradient: "bg-gradient-to-br from-teal-500 to-teal-600",
      color: "text-teal-600"
    },
    {
      title: "Cases",
      value: "156",
      change: "+8.5%",
      changeType: "increase",
      icon: Briefcase,
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      color: "text-indigo-600"
    },
    {
      title: "Earned",
      value: "₹45,200",
      change: "+18.2%",
      changeType: "increase",
      icon: Award,
      gradient: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      color: "text-yellow-600"
    },
    {
      title: "Discount",
      value: "₹12,300",
      change: "-2.1%",
      changeType: "warning",
      icon: Percent,
      gradient: "bg-gradient-to-br from-pink-500 to-pink-600",
      color: "text-pink-600"
    }
  ];

  const callStats = [
    {
      title: "Today's Calls",
      value: "47",
      change: "+15%",
      changeType: "increase",
      icon: Phone,
      gradient: "bg-gradient-to-br from-teal-500 to-teal-600",
      color: "text-teal-600"
    },
    {
      title: "Connected Calls",
      value: "38",
      change: "+8%",
      changeType: "increase",
      icon: PhoneCall,
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
      color: "text-green-600"
    },
    {
      title: "Interested Leads",
      value: "12",
      change: "+25%",
      changeType: "increase",
      icon: CheckCircle2,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      color: "text-purple-600"
    },
    {
      title: "Follow-up Required",
      value: "8",
      change: "-10%",
      changeType: "warning",
      icon: Clock,
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="bg-transparent md:bg-white/80 backdrop-blur-sm rounded-3xl p-0 md:p-6 border-0 md:border border-white/50 shadow-none md:shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-2 rounded-xl">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Customer Overview</h3>
        </div>
        <div className="space-y-4">
          {/* Total Customers - Full Width */}
          <div
            className="bg-gradient-to-r from-purple-600 to-purple-800 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group h-20 md:h-28 relative overflow-hidden"
            onClick={() => onTileClick && onTileClick(stats[0].title.toLowerCase().replace(/\s+/g, '_'))}
          >
            {/* Background Graphics */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 right-2 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute bottom-2 left-2 w-12 h-12 bg-white rounded-full"></div>
            </div>

            <div className="flex items-center justify-between h-full relative z-10">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="bg-white/20 p-2 md:p-3 rounded-xl md:rounded-2xl">
                  {React.createElement(stats[0].icon, { className: "h-5 w-5 md:h-7 md:w-7 text-white" })}
                </div>
                <div>
                  <p className="text-2xl md:text-4xl font-bold text-white">{stats[0].value}</p>
                  <p className="text-sm md:text-lg text-white/80">{stats[0].title}</p>
                </div>
              </div>

              {/* Desktop: Bar Graph - Bottom Aligned */}
              <div className="hidden md:flex items-end">
                <div className="w-40 h-16 mr-4">
                  <svg className="w-full h-full" viewBox="0 0 160 64">
                    <defs>
                      <linearGradient id="barGradient1" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                      </linearGradient>
                    </defs>
                    {/* 7 Day Bars */}
                    <rect x="8" y="50" width="12" height="14" fill="url(#barGradient1)" rx="1" />
                    <rect x="26" y="45" width="12" height="19" fill="url(#barGradient1)" rx="1" />
                    <rect x="44" y="40" width="12" height="24" fill="url(#barGradient1)" rx="1" />
                    <rect x="62" y="35" width="12" height="29" fill="url(#barGradient1)" rx="1" />
                    <rect x="80" y="30" width="12" height="34" fill="url(#barGradient1)" rx="1" />
                    <rect x="98" y="25" width="12" height="39" fill="url(#barGradient1)" rx="1" />
                    <rect x="116" y="20" width="12" height="44" fill="url(#barGradient1)" rx="1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Other Stats - Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.slice(1).map((stat, index) => (
              <div
                key={index + 1}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => onTileClick && onTileClick(stat.title.toLowerCase().replace(/\s+/g, '_'))}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${stat.gradient}`}>
                    {React.createElement(stat.icon, { className: "h-4 w-4 text-white" })}
                  </div>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : stat.changeType === 'warning' ? (
                    <ArrowDownRight className="h-4 w-4 text-orange-500" />
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs font-medium ${stat.changeType === 'increase' ? 'text-green-600 bg-green-50' :
                    stat.changeType === 'warning' ? 'text-orange-600 bg-orange-50' :
                      'text-gray-600 bg-gray-50'
                    }`}
                >
                  {stat.change}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="bg-transparent md:bg-white/80 backdrop-blur-sm rounded-3xl p-0 md:p-6 border-0 md:border border-white/50 shadow-none md:shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 p-2 rounded-xl">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Sales Performance</h3>
        </div>
        <div className="space-y-4">
          {/* Sales Net - Full Width */}
          <div
            className="bg-gradient-to-r from-emerald-600 to-emerald-800 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group h-20 md:h-28 relative overflow-hidden"
            onClick={() => onTileClick && onTileClick(salesStats[1].title.toLowerCase().replace(/\s+/g, '_'))}
          >
            {/* Background Graphics */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 right-2 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute bottom-2 left-2 w-12 h-12 bg-white rounded-full"></div>
            </div>

            <div className="flex items-center justify-between h-full relative z-10">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="bg-white/20 p-2 md:p-3 rounded-xl md:rounded-2xl">
                  {React.createElement(salesStats[1].icon, { className: "h-5 w-5 md:h-7 md:w-7 text-white" })}
                </div>
                <div>
                  <p className="text-2xl md:text-4xl font-bold text-white">{salesStats[1].value}</p>
                  <p className="text-sm md:text-lg text-white/80">{salesStats[1].title}</p>
                </div>
              </div>

              {/* Desktop: Bar Graph - Bottom Aligned */}
              <div className="hidden md:flex items-end">
                <div className="w-40 h-16 mr-4">
                  <svg className="w-full h-full" viewBox="0 0 160 64">
                    <defs>
                      <linearGradient id="barGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                      </linearGradient>
                    </defs>
                    {/* 7 Day Bars */}
                    <rect x="8" y="48" width="12" height="16" fill="url(#barGradient2)" rx="1" />
                    <rect x="26" y="42" width="12" height="22" fill="url(#barGradient2)" rx="1" />
                    <rect x="44" y="38" width="12" height="26" fill="url(#barGradient2)" rx="1" />
                    <rect x="62" y="32" width="12" height="32" fill="url(#barGradient2)" rx="1" />
                    <rect x="80" y="28" width="12" height="36" fill="url(#barGradient2)" rx="1" />
                    <rect x="98" y="22" width="12" height="42" fill="url(#barGradient2)" rx="1" />
                    <rect x="116" y="18" width="12" height="46" fill="url(#barGradient2)" rx="1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Other Sales Stats - Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {salesStats.filter((_, index) => index !== 1).map((stat, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => onTileClick && onTileClick(stat.title.toLowerCase().replace(/\s+/g, '_'))}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${stat.gradient}`}>
                    {React.createElement(stat.icon, { className: "h-4 w-4 text-white" })}
                  </div>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : stat.changeType === 'warning' ? (
                    <ArrowDownRight className="h-4 w-4 text-orange-500" />
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                </div>
                <div className="mb-2">
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs font-medium ${stat.changeType === 'increase' ? 'text-green-600 bg-green-50' :
                    stat.changeType === 'warning' ? 'text-orange-600 bg-orange-50' :
                      'text-gray-600 bg-gray-50'
                    }`}
                >
                  {stat.change}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call Management Stats */}
      <div className="bg-transparent md:bg-white/80 backdrop-blur-sm rounded-3xl p-0 md:p-6 border-0 md:border border-white/50 shadow-none md:shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-2 rounded-xl">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Call Management</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {callStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
              onClick={() => onTileClick && onTileClick(stat.title.toLowerCase().replace(/\s+/g, '_'))}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${stat.gradient}`}>
                  {React.createElement(stat.icon, { className: "h-4 w-4 text-white" })}
                </div>
                {stat.changeType === 'increase' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : stat.changeType === 'warning' ? (
                  <ArrowDownRight className="h-4 w-4 text-orange-500" />
                ) : (
                  <div className="h-4 w-4" />
                )}
              </div>
              <div className="mb-2">
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
              <Badge
                variant="secondary"
                className={`text-xs font-medium ${stat.changeType === 'increase' ? 'text-green-600 bg-green-50' :
                  stat.changeType === 'warning' ? 'text-orange-600 bg-orange-50' :
                    'text-gray-600 bg-gray-50'
                  }`}
              >
                {stat.change}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};