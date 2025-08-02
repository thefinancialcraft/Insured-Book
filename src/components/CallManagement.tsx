import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone,
  PhoneOff,
  Calendar as CalendarIcon,
  Clock,
  MessageSquare,
  CheckCircle,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Pause,
  Play,
  User,
  History,
  AlertCircle,
  TrendingUp,
  UserCheck,
  PhoneMissed,
  Settings,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import CallTimeline from "@/components/CallTimeline";

interface CallRecord {
  id: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  callType: 'outgoing' | 'incoming';
  disposition: string;
  notes: string;
  duration: number;
  timestamp: Date;
  nextCallDate?: Date;
  followUpRequired: boolean;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastCallDate?: Date;
  nextCallDate?: Date;
  callCount: number;
  lastDisposition?: string;
}

interface CallState {
  isActive: boolean;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  startTime: number;
  status: 'connecting' | 'connected' | 'hold';
}

const dispositions = [
  { value: 'interested', label: 'Interested', color: 'bg-green-500' },
  { value: 'not_interested', label: 'Not Interested', color: 'bg-red-500' },
  { value: 'callback', label: 'Callback Requested', color: 'bg-blue-500' },
  { value: 'no_answer', label: 'No Answer', color: 'bg-yellow-500' },
  { value: 'wrong_number', label: 'Wrong Number', color: 'bg-gray-500' },
  { value: 'converted', label: 'Converted', color: 'bg-purple-500' },
  { value: 'follow_up', label: 'Follow Up Required', color: 'bg-orange-500' }
];

const CallManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const customerIdFromUrl = searchParams.get('customerId');

  const [isCallActive, setIsCallActive] = useState(false);
  const [currentCall, setCurrentCall] = useState<Customer | null>(null);
  const [showDispositionDialog, setShowDispositionDialog] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [nextCallDate, setNextCallDate] = useState<Date>();
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'hold' | 'disconnected'>('idle');
  const [previousCallHistory, setPreviousCallHistory] = useState<CallRecord[]>([]);
  const [showCallDetails, setShowCallDetails] = useState(false);
  const [callStartTime, setCallStartTime] = useState<number>(0);
  const { toast } = useToast();

  // Mock customers for calling
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@email.com',
      callCount: 3,
      lastDisposition: 'callback'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      email: 'priya@email.com',
      callCount: 1,
      lastDisposition: 'interested'
    }
  ];

  // Check for ongoing call state in localStorage and pending calls
  useEffect(() => {
    // Check for pending call from external components
    const pendingCall = localStorage.getItem('pendingCall');
    if (pendingCall) {
      const customerData = JSON.parse(pendingCall);
      const customer = customers.find(c => c.id.toString() === customerData.id.toString()) || {
        id: customerData.id.toString(),
        name: customerData.name,
        phone: customerData.phone,
        email: 'N/A',
        callCount: 0,
        lastDisposition: null
      };
      setCurrentCall(customer);
      setShowCallDetails(true);
      localStorage.removeItem('pendingCall');
      return;
    }

    // Check for ongoing call state
    const savedCallState = localStorage.getItem('activeCall');
    if (savedCallState) {
      const callState: CallState = JSON.parse(savedCallState);
      const customer = customers.find(c => c.id === callState.customerId);
      if (customer && callState.isActive) {
        setCurrentCall(customer);
        setIsCallActive(true);
        setCallStatus(callState.status);
        setCallStartTime(callState.startTime);
        setCallDuration(Math.floor((Date.now() - callState.startTime) / 1000));
        setShowCallDetails(true);
        loadCustomerHistory(customer.id);

        toast({
          title: "Call Running",
          description: `Ongoing call with ${customer.name}`,
          action: (
            <Button size="sm" onClick={endCall} variant="destructive">
              End Call
            </Button>
          ),
        });
      }
    }
  }, []);

  // Auto-start call from URL parameter (from customer page)
  useEffect(() => {
    if (customerIdFromUrl && !isCallActive) {
      const customer = customers.find(c => c.id === customerIdFromUrl);
      if (customer) {
        initiateCall(customer);
      }
    }
  }, [customerIdFromUrl, isCallActive]);

  // Load previous call history for customer
  const loadCustomerHistory = (customerId: string) => {
    const customerHistory = callHistory.filter(call => call.customerId === customerId);
    setPreviousCallHistory(customerHistory);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive && callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, callStatus]);

  // Initiate call flow - show call preparation dialog
  const initiateCall = (customer: Customer) => {
    setCurrentCall(customer);
    loadCustomerHistory(customer.id);
    setShowCallDetails(true);
  };

  const startCall = () => {
    if (!currentCall) return;

    // Navigate to the call page with customer details
    navigate(`/call?customerId=${currentCall.id}&customerName=${encodeURIComponent(currentCall.name)}&customerPhone=${encodeURIComponent(currentCall.phone)}`);
  };

  const holdCall = () => {
    setCallStatus(callStatus === 'hold' ? 'connected' : 'hold');
    toast({
      title: callStatus === 'hold' ? "Call Resumed" : "Call On Hold",
      description: callStatus === 'hold' ? "Call has been resumed" : "Call has been put on hold",
    });
  };

  const endCall = () => {
    setCallStatus('disconnected');
    setIsCallActive(false);
    setShowCallDetails(false);
    localStorage.removeItem('activeCall');

    // Show disposition dialog to mark call outcome
    setShowDispositionDialog(true);
  };

  const saveCallRecord = () => {
    if (!currentCall || !selectedDisposition) return;

    // Save the call record
    const newRecord: CallRecord = {
      id: Date.now().toString(),
      customerId: currentCall.id,
      customerName: currentCall.name,
      phoneNumber: currentCall.phone,
      callType: 'outgoing',
      disposition: selectedDisposition,
      notes: callNotes,
      duration: callDuration,
      timestamp: new Date(),
      nextCallDate,
      followUpRequired: ['callback', 'follow_up'].includes(selectedDisposition)
    };

    setCallHistory(prev => [newRecord, ...prev]);

    // Reset form and call state
    setShowDispositionDialog(false);
    setCurrentCall(null);
    setSelectedDisposition('');
    setCallNotes('');
    setNextCallDate(undefined);
    setCallDuration(0);
    setCallStatus('idle');

    toast({
      title: "Call Completed",
      description: "Call disposition saved successfully",
    });
  };

  const getDispositionColor = (disposition: string) => {
    return dispositions.find(d => d.value === disposition)?.color || 'bg-gray-500';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCallStats = () => {
    const total = callHistory.length;
    const connected = callHistory.filter(call => call.disposition !== 'no_answer').length;
    const scheduled = callHistory.filter(call => call.followUpRequired).length;
    const converted = callHistory.filter(call => call.disposition === 'converted').length;
    return { total, connected, scheduled, converted };
  };

  const scheduledCalls = callHistory.filter(call =>
    call.nextCallDate && format(call.nextCallDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const overdueCalls = callHistory.filter(call =>
    call.nextCallDate && call.nextCallDate < new Date() && call.followUpRequired
  );

  const upcomingCalls = callHistory.filter(call =>
    call.nextCallDate && call.nextCallDate > new Date() && call.followUpRequired
  );

  const recentCalls = callHistory.slice(0, 5);

  const stats = getCallStats();

  return (
    <div className="space-y-6">
      {/* Modern Call Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <PhoneCall className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Calls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.connected}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-orange-500/10 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.scheduled}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.converted}</p>
                <p className="text-xs text-muted-foreground">Converted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="calling" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden md:inline">Start Calling</span>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden md:inline">Scheduled</span>
          </TabsTrigger>
          <TabsTrigger value="overdues" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden md:inline">Overdues</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden md:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Call Performance Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Weekly Call Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="text-lg font-bold text-green-600">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Call Duration</span>
                    <span className="text-lg font-bold text-blue-600">4:32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className="text-lg font-bold text-purple-600">24%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Monthly Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Calls Made</span>
                    <span className="text-lg font-bold text-foreground">{stats.total}/150</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversions</span>
                    <span className="text-lg font-bold text-foreground">{stats.converted}/30</span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.total / 150) * 100}%` }}></div>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.converted / 30) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Grid - Recent Calls, Overdues, Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Calls */}
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Recent Calls
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {recentCalls.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentCalls.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent calls</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentCalls.map((call) => (
                      <div key={call.id} className="bg-background/50 border border-border rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 bg-gradient-primary">
                            <AvatarFallback className="text-primary-foreground font-bold text-xs">
                              {getInitials(call.customerName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{call.customerName}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className={cn("text-white text-xs", getDispositionColor(call.disposition))}>
                                {dispositions.find(d => d.value === call.disposition)?.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{format(call.timestamp, "MMM dd, HH:mm")}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overdue Calls */}
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Overdue Calls
                  </div>
                  <Badge variant="destructive" className="text-sm">
                    {overdueCalls.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {overdueCalls.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No overdue calls</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {overdueCalls.slice(0, 5).map((call) => (
                      <div key={call.id} className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 bg-red-500">
                            <AvatarFallback className="text-white font-bold text-xs">
                              {getInitials(call.customerName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{call.customerName}</h4>
                            <p className="text-xs text-red-600 dark:text-red-400">
                              Due: {call.nextCallDate && format(call.nextCallDate, "MMM dd")}
                            </p>
                            <p className="text-xs text-muted-foreground">{call.phoneNumber}</p>
                          </div>
                          <Button
                            onClick={() => {
                              const customer = customers.find(c => c.id === call.customerId);
                              if (customer) initiateCall(customer);
                            }}
                            disabled={isCallActive}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 h-8 px-2"
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Calls */}
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    Upcoming Calls
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {upcomingCalls.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingCalls.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No upcoming calls</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingCalls.slice(0, 5).map((call) => (
                      <div key={call.id} className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 bg-blue-500">
                            <AvatarFallback className="text-white font-bold text-xs">
                              {getInitials(call.customerName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{call.customerName}</h4>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {call.nextCallDate && format(call.nextCallDate, "MMM dd, HH:mm")}
                            </p>
                            <p className="text-xs text-muted-foreground">{call.phoneNumber}</p>
                          </div>
                          <Button
                            onClick={() => {
                              const customer = customers.find(c => c.id === call.customerId);
                              if (customer) initiateCall(customer);
                            }}
                            disabled={isCallActive}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 h-8 px-2"
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Today's Scheduled Calls */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Today's Schedule ({scheduledCalls.length})
                </div>
                <Badge variant="outline" className="text-sm">
                  {format(new Date(), "MMM dd, yyyy")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledCalls.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No calls scheduled for today</p>
                  <p className="text-sm text-muted-foreground mt-1">Schedule follow-up calls to see them here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledCalls
                    .sort((a, b) => {
                      if (a.nextCallDate && b.nextCallDate) {
                        return a.nextCallDate.getTime() - b.nextCallDate.getTime();
                      }
                      return 0;
                    })
                    .map((call) => (
                      <div key={call.id} className="bg-background/50 border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <Avatar className="h-12 w-12 bg-gradient-primary">
                              <AvatarFallback className="text-primary-foreground font-bold">
                                {getInitials(call.customerName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-foreground">{call.customerName}</h4>
                                <Badge className={cn("text-white text-xs", getDispositionColor(call.disposition))}>
                                  {dispositions.find(d => d.value === call.disposition)?.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{call.phoneNumber}</p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {call.nextCallDate ? format(call.nextCallDate, "HH:mm") : "No time set"}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <History className="h-3 w-3 mr-1" />
                                  <span>Last: {format(call.timestamp, "MMM dd")}</span>
                                </div>
                              </div>
                              {call.notes && (
                                <p className="text-sm text-muted-foreground mt-2 italic">
                                  "{call.notes}"
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              onClick={() => {
                                const customer = customers.find(c => c.id === call.customerId);
                                if (customer) initiateCall(customer);
                              }}
                              disabled={isCallActive}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calling" className="space-y-6">
          {/* Quick Start Calling */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PhoneCall className="h-5 w-5 mr-2" />
                Available Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 bg-gradient-primary">
                        <AvatarFallback className="text-primary-foreground font-bold">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{customer.name}</h4>
                        <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        <p className="text-xs text-muted-foreground">{customer.callCount} previous calls</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => initiateCall(customer)}
                      disabled={isCallActive}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          {/* All Scheduled Calls */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                All Scheduled Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              {callHistory.filter(call => call.followUpRequired).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No scheduled calls</p>
              ) : (
                <div className="space-y-3">
                  {callHistory
                    .filter(call => call.followUpRequired)
                    .map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 bg-gradient-primary">
                            <AvatarFallback className="text-primary-foreground font-bold">
                              {getInitials(call.customerName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{call.customerName}</h4>
                            <p className="text-sm text-muted-foreground">{call.phoneNumber}</p>
                            {call.nextCallDate && (
                              <p className="text-xs text-blue-600">
                                Next call: {format(call.nextCallDate, "PPP")}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            const customer = customers.find(c => c.id === call.customerId);
                            if (customer) initiateCall(customer);
                          }}
                          disabled={isCallActive}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdues" className="space-y-6">
          {/* Overdue Calls */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Overdue Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overdueCalls.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No overdue calls</p>
                  <p className="text-sm text-muted-foreground mt-2">All follow-ups are on schedule</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {overdueCalls.map((call) => (
                    <div key={call.id} className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="h-12 w-12 bg-red-500">
                            <AvatarFallback className="text-white font-bold">
                              {getInitials(call.customerName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-foreground">{call.customerName}</h4>
                              <Badge className="bg-red-500 text-white text-xs">
                                Overdue
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{call.phoneNumber}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                                <span className="text-red-600 dark:text-red-400">
                                  Due: {call.nextCallDate && format(call.nextCallDate, "MMM dd, yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <History className="h-3 w-3 mr-1" />
                                <span>Last: {format(call.timestamp, "MMM dd")}</span>
                              </div>
                            </div>
                            {call.notes && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                "{call.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            onClick={() => {
                              const customer = customers.find(c => c.id === call.customerId);
                              if (customer) initiateCall(customer);
                            }}
                            disabled={isCallActive}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Call History */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Call History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {callHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No call history yet</p>
                ) : (
                  callHistory.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Avatar className="h-10 w-10 bg-gradient-primary">
                            <AvatarFallback className="text-primary-foreground font-bold">
                              {getInitials(record.customerName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{record.customerName}</h4>
                              <Badge className={cn("text-white text-xs", getDispositionColor(record.disposition))}>
                                {dispositions.find(d => d.value === record.disposition)?.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{record.phoneNumber}</p>
                            {record.notes && <p className="text-sm">{record.notes}</p>}
                            {record.nextCallDate && (
                              <p className="text-xs text-blue-600 mt-2">
                                Next call: {format(record.nextCallDate, "PPP")}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{format(record.timestamp, "MMM dd, yyyy")}</p>
                          <p>{format(record.timestamp, "HH:mm")}</p>
                          <p className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDuration(record.duration)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Active Call Interface - Fixed Position */}
      {showCallDetails && currentCall && (
        <Card className="fixed top-4 right-4 w-80 z-50 bg-gradient-card shadow-card border-0 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className={cn(
                  "h-2 w-2 rounded-full mr-2 animate-pulse",
                  callStatus === 'connected' ? "bg-green-500" :
                    callStatus === 'connecting' ? "bg-yellow-500" :
                      callStatus === 'hold' ? "bg-orange-500" : "bg-red-500"
                )} />
                <span>Calling {currentCall.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                {(callStatus === 'connected' || callStatus === 'hold') && (
                  <Button onClick={holdCall} variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {callStatus === 'hold' ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  </Button>
                )}
                <Button onClick={endCall} variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive">
                  <PhoneOff className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Call Timer */}
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-foreground">{formatDuration(callDuration)}</div>
                <div className="text-xs text-muted-foreground">
                  {callStatus.charAt(0).toUpperCase() + callStatus.slice(1)} • {currentCall.phone}
                </div>
              </div>

              {/* Recent Activity During Call */}
              {previousCallHistory.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground flex items-center">
                    <History className="h-3 w-3 mr-1" />
                    Last Activity
                  </h5>
                  <div className="bg-background/50 p-2 rounded text-xs">
                    <div className="flex justify-between items-center">
                      <span>{format(previousCallHistory[0].timestamp, "MMM dd")}</span>
                      <Badge className={cn("text-white text-xs", getDispositionColor(previousCallHistory[0].disposition))}>
                        {dispositions.find(d => d.value === previousCallHistory[0].disposition)?.label}
                      </Badge>
                    </div>
                    {previousCallHistory[0].notes && (
                      <p className="text-muted-foreground mt-1 truncate">"{previousCallHistory[0].notes}"</p>
                    )}
                  </div>
                </div>
              )}

              {/* Call History & Timeline */}
              <div className="space-y-1">
                <CallTimeline customerId={currentCall.id} customerName={currentCall.name} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call Start Dialog */}
      <Dialog open={showCallDetails && !isCallActive} onOpenChange={(open) => {
        if (!open) setShowCallDetails(false);
      }}>
        <DialogContent className="w-full max-w-full sm:max-w-[90vw] md:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Connect Call
            </DialogTitle>
            <DialogDescription>
              Review customer history and connect call with {currentCall?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Customer Info */}
            {currentCall && (
              <div className="bg-background/50 p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 bg-gradient-primary">
                    <AvatarFallback className="text-primary-foreground font-bold">
                      {getInitials(currentCall.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{currentCall.name}</h4>
                    <p className="text-sm text-muted-foreground">{currentCall.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Previous Call History */}
            {previousCallHistory.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Recent Activity ({previousCallHistory.length} calls)
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {previousCallHistory.slice(0, 5).map((call) => (
                    <div key={call.id} className="bg-background/50 p-3 rounded border text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{format(call.timestamp, "MMM dd, yyyy HH:mm")}</span>
                        <Badge className={cn("text-white text-xs", getDispositionColor(call.disposition))}>
                          {dispositions.find(d => d.value === call.disposition)?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Duration: {formatDuration(call.duration)}
                      </div>
                      {call.notes && (
                        <p className="text-muted-foreground text-xs bg-background/30 p-2 rounded mt-1">
                          "{call.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCallDetails(false)}>
                Cancel
              </Button>
              <Button
                onClick={startCall}
                className="bg-gradient-primary"
              >
                <Phone className="h-4 w-4 mr-2" />
                Connect Call
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disposition Dialog - Only after call ends */}
      <Dialog open={showDispositionDialog} onOpenChange={setShowDispositionDialog}>
        <DialogContent className="w-full max-w-full sm:max-w-[90vw] md:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Call Completed
            </DialogTitle>
            <DialogDescription>
              Mark disposition for call with {currentCall?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Customer Info */}
            {currentCall && (
              <div className="bg-background/50 p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 bg-gradient-primary">
                    <AvatarFallback className="text-primary-foreground font-bold">
                      {getInitials(currentCall.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{currentCall.name}</h4>
                    <p className="text-sm text-muted-foreground">{currentCall.phone}</p>
                    <p className="text-xs text-muted-foreground">Call Duration: {formatDuration(callDuration)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Disposition Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Call Disposition*</label>
              <Select value={selectedDisposition} onValueChange={setSelectedDisposition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select call outcome" />
                </SelectTrigger>
                <SelectContent>
                  {dispositions.map((disposition) => (
                    <SelectItem key={disposition.value} value={disposition.value}>
                      <div className="flex items-center">
                        <div className={cn("w-3 h-3 rounded-full mr-2", disposition.color)} />
                        {disposition.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Call Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Call Notes</label>
              <Textarea
                placeholder="Add detailed notes about the call..."
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Next Call Date for Follow-ups */}
            {['callback', 'follow_up'].includes(selectedDisposition) && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Schedule Next Call</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nextCallDate ? format(nextCallDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={nextCallDate}
                      onSelect={setNextCallDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDispositionDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={saveCallRecord}
                disabled={!selectedDisposition}
                className="bg-gradient-primary"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Save & Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallManagement;