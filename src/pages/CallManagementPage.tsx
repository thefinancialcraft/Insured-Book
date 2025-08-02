import { Phone, Bell } from "lucide-react";
import CallManagement from "@/components/CallManagement";

const CallManagementPage = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Hero/Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-4 md:p-8 text-white shadow-2xl pt-1 md:pt-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
              <Phone className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-3xl lg:text-4xl font-bold leading-tight">Call Management</h1>
              <p className="text-sm md:text-base text-blue-100">Manage customer calls and dispositions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 flex items-center space-x-2">
              <Bell className="h-5 w-5 text-yellow-300" />
              <span className="text-blue-100 text-sm font-medium">Pending Calls: <span className="font-bold text-white">12</span></span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Card Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg p-3 md:p-6">
        <CallManagement />
      </div>
    </div>
  );
};

export default CallManagementPage;