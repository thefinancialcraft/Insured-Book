import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Phone, PhoneOff, Clock, User, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CallPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const customerId = searchParams.get("customerId");
  const customerName = searchParams.get("customerName") || "Unknown Customer";
  const customerPhone = searchParams.get("customerPhone") || "+91 00000 00000";

  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(true);
  const [showDisposition, setShowDisposition] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState("");
  const [dispositionNotes, setDispositionNotes] = useState("");
  const [followupDate, setFollowupDate] = useState<Date>();
  const [followupTime, setFollowupTime] = useState("");

  // Mock call history data
  const callHistory = [
    {
      id: "1",
      callType: "Outgoing",
      disposition: "callback_requested",
      notes: "Customer requested callback tomorrow after 2 PM. Interested in vehicle insurance.",
      duration: 180,
      timestamp: "2024-07-18T14:30:00Z",
      nextCallDate: "2024-07-19T14:00:00Z"
    },
    {
      id: "2",
      callType: "Outgoing",
      disposition: "no_answer",
      notes: "No response, will try again later.",
      duration: 0,
      timestamp: "2024-07-17T10:15:00Z"
    },
    {
      id: "3",
      callType: "Incoming",
      disposition: "interested",
      notes: "Customer called asking about life insurance premiums. Provided basic information.",
      duration: 420,
      timestamp: "2024-07-15T16:45:00Z"
    }
  ];

  const dispositions = [
    { value: "interested", label: "Interested", color: "bg-green-500" },
    { value: "not_interested", label: "Not Interested", color: "bg-red-500" },
    { value: "callback_requested", label: "Callback Requested", color: "bg-blue-500" },
    { value: "no_answer", label: "No Answer", color: "bg-gray-500" },
    { value: "wrong_number", label: "Wrong Number", color: "bg-orange-500" },
    { value: "do_not_call", label: "Do Not Call", color: "bg-purple-500" }
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Auto-trigger phone call when page loads
  useEffect(() => {
    if (customerPhone && customerPhone !== "+91 00000 00000") {
      console.log("Attempting to call:", customerPhone);
      // Comment out the actual call for testing
      // window.location.href = `tel:${customerPhone}`;
    }
  }, [customerPhone]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDispositionColor = (disposition: string) => {
    const found = dispositions.find(d => d.value === disposition);
    return found?.color || "bg-gray-500";
  };

  const getDispositionLabel = (disposition: string) => {
    const found = dispositions.find(d => d.value === disposition);
    return found?.label || disposition;
  };

  const handleHangup = () => {
    setIsCallActive(false);
    setShowDisposition(true);
  };

  const handleDispositionSubmit = () => {
    if (!selectedDisposition) {
      toast({
        title: "Error",
        description: "Please select a disposition",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Call Completed",
      description: `Call disposition: ${getDispositionLabel(selectedDisposition)}`
    });

    // Navigate back to call management
    navigate("/call-management");
  };

  const handleBackToCallManagement = () => {
    navigate("/call-management");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Hero Section - Dashboard Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-4 md:p-8 text-white shadow-2xl pt-1 md:pt-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0 md:flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToCallManagement}
                  className="border border-white/20 bg-white/10 hover:bg-white/20 text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Call</p>
                  <p className="text-xs text-purple-200">Customer communication in progress</p>
                </div>
              </div>
              <h1 className="text-lg md:text-3xl lg:text-4xl font-bold pt-4 md:mb-3 leading-tight text-center md:text-left">
                Calling {customerName}
              </h1>
              <p className="text-purple-100 text-sm md:text-lg max-w-2xl leading-relaxed hidden md:block">
                Managing customer call and tracking communication details for better service delivery.
              </p>
            </div>
            <div className="md:ml-8 flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="text-center">
                  <p className="text-purple-100 text-sm">Call Duration</p>
                  <p className="text-2xl font-bold text-white">{formatDuration(callDuration)}</p>
                </div>
              </div>
              {isCallActive && (
                <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-300/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-100 font-medium">Connected</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        {/* Call Action Buttons - Top Priority */}
        {isCallActive && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 backdrop-blur-md rounded-3xl border border-red-200 shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-900">🔥 Active Call in Progress</h3>
                  <p className="text-sm text-red-700">Duration: {formatDuration(callDuration)} • Live</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="border-green-500 hover:bg-green-50 text-green-700 hover:border-green-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Hold Call
                </Button>
                <Button
                  onClick={handleHangup}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full shadow-lg animate-pulse"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Call
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Customer Profile Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Customer Profile
            </h3>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">Premium Customer</Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">VIP</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900">{customerName}</h4>
              <p className="text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {customerPhone}
              </p>
              <p className="text-sm text-purple-600">Customer since: January 2024 • 8 months</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">₹45,200</div>
              <p className="text-xs text-gray-500">Total Premium</p>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-purple-700">#{customerId || 'N/A'}</p>
              <p className="text-xs text-gray-600">Customer ID</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-blue-700">2 days</p>
              <p className="text-xs text-gray-600">Last Contact</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-green-700">95%</p>
              <p className="text-xs text-gray-600">Satisfaction</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-orange-700">3</p>
              <p className="text-xs text-gray-600">Active Policies</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Customer Lifetime Value</span>
              <span className="text-purple-600 font-medium">₹67,800 / ₹100,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '67.8%' }}></div>
            </div>
          </div>
        </div>

        {/* Interactive Call Analytics */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-600" />
            Call Analytics & Insights
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200 hover:shadow-md transition-all cursor-pointer">
              <p className="text-2xl font-bold text-purple-700">{callHistory.length}</p>
              <p className="text-sm text-gray-600">Total Calls</p>
              <div className="flex items-center justify-center mt-1">
                <span className="text-xs text-green-600">↗ +12%</span>
                <span className="text-xs text-gray-500 ml-1">this month</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200 hover:shadow-md transition-all cursor-pointer">
              <p className="text-2xl font-bold text-green-700">
                {callHistory.filter(call => call.disposition === "interested" || call.disposition === "callback_requested").length}
              </p>
              <p className="text-sm text-gray-600">Successful</p>
              <div className="flex items-center justify-center mt-1">
                <span className="text-xs text-green-600">85%</span>
                <span className="text-xs text-gray-500 ml-1">success rate</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200 hover:shadow-md transition-all cursor-pointer">
              <p className="text-2xl font-bold text-blue-700">
                {formatDuration(callHistory.reduce((total, call) => total + call.duration, 0))}
              </p>
              <p className="text-sm text-gray-600">Total Time</p>
              <div className="flex items-center justify-center mt-1">
                <span className="text-xs text-blue-600">Avg: 3m 24s</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center border border-orange-200 hover:shadow-md transition-all cursor-pointer">
              <p className="text-2xl font-bold text-orange-700">
                {callHistory.filter(call => call.disposition === "no_answer").length}
              </p>
              <p className="text-sm text-gray-600">No Answer</p>
              <div className="flex items-center justify-center mt-1">
                <span className="text-xs text-orange-600">15%</span>
                <span className="text-xs text-gray-500 ml-1">of calls</span>
              </div>
            </div>
          </div>

          {/* Call Trend Chart */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Call Trend (Last 7 Days)</h4>
            <div className="flex items-end justify-between h-16 space-x-2">
              {[3, 5, 2, 7, 4, 6, 3].map((height, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-6 bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-sm transition-all hover:scale-110 cursor-pointer"
                    style={{ height: `${height * 8}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-purple-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-3 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all hover:scale-105"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Call Again</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-3 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all hover:scale-105"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Schedule</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-3 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all hover:scale-105"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium">View Profile</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-3 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all hover:scale-105"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Send SMS</span>
            </Button>
          </div>
        </div>

        {/* Interactive Recent Activity */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-600" />
            Recent Activity & Timeline
          </h3>
          <div className="space-y-4">
            {callHistory.slice(0, 3).map((call, index) => (
              <div key={call.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                <div className="relative">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{getDispositionLabel(call.disposition)}</p>
                  <p className="text-xs text-gray-500">{new Date(call.timestamp).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-white ${getDispositionColor(call.disposition)}`}>
                    {call.duration > 0 ? formatDuration(call.duration) : 'No duration'}
                  </Badge>
                  {index === 0 && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">Latest</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call History Timeline */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-purple-600" />
            Complete Call History
          </h3>

          {callHistory.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No call history available</p>
            </div>
          ) : (
            <div className="space-y-6">
              {callHistory.map((call, index) => (
                <div key={call.id} className="flex space-x-4 pb-6 border-b border-gray-100 last:border-b-0">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    {index < callHistory.length - 1 && (
                      <div className="w-px h-20 bg-gray-200 mt-2" />
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="border-purple-200 text-purple-700">{call.callType}</Badge>
                      <Badge className={`text-white ${getDispositionColor(call.disposition)}`}>
                        {getDispositionLabel(call.disposition)}
                      </Badge>
                      {call.duration > 0 && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {formatDuration(call.duration)}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed">{call.notes}</p>

                    {call.nextCallDate && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800 font-medium">
                          📅 Next call: {new Date(call.nextCallDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      {new Date(call.timestamp).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call Summary */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-purple-50 rounded-2xl p-4">
                <p className="text-2xl font-bold text-purple-700">{callHistory.length}</p>
                <p className="text-sm text-gray-600">Total Calls</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4">
                <p className="text-2xl font-bold text-green-700">
                  {callHistory.filter(call => call.disposition === "interested" || call.disposition === "callback_requested").length}
                </p>
                <p className="text-sm text-gray-600">Connected</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-2xl font-bold text-blue-700">
                  {formatDuration(callHistory.reduce((total, call) => total + call.duration, 0))}
                </p>
                <p className="text-sm text-gray-600">Total Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disposition Dialog */}
      <Dialog open={showDisposition} onOpenChange={() => { }}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>Call Disposition</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Select Disposition</Label>
              <RadioGroup value={selectedDisposition} onValueChange={setSelectedDisposition} className="mt-2">
                {dispositions.map((disposition) => (
                  <div key={disposition.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={disposition.value} id={disposition.value} />
                    <Label htmlFor={disposition.value} className="cursor-pointer">
                      {disposition.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Follow-up Date/Time for Interested or Callback Requested */}
            {(selectedDisposition === "interested" || selectedDisposition === "callback_requested") && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium text-sm">Schedule Follow-up</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Follow-up Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {followupDate ? format(followupDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={followupDate}
                          onSelect={setFollowupDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="followupTime" className="text-sm font-medium">
                      Preferred Time
                    </Label>
                    <Input
                      id="followupTime"
                      type="time"
                      value={followupTime}
                      onChange={(e) => setFollowupTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="notes" className="text-base font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this call..."
                value={dispositionNotes}
                onChange={(e) => setDispositionNotes(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={handleDispositionSubmit}
                className="px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                Save Disposition
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallPage;