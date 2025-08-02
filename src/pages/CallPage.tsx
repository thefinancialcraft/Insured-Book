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
import { Phone, PhoneOff, Clock, User, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CallPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const customerId = searchParams.get("customerId");
  const customerName = searchParams.get("customerName") || "Unknown Customer";
  const customerPhone = searchParams.get("customerPhone") || "+91 00000 00000";

  // Debug logging
  useEffect(() => {
    console.log("=== CALL PAGE DEBUG ===");
    console.log("CallPage component rendered");
    console.log("Customer ID:", customerId);
    console.log("Customer Name:", customerName);
    console.log("Customer Phone:", customerPhone);
    console.log("All search params:", Object.fromEntries(searchParams.entries()));
  }, [customerId, customerName, customerPhone, searchParams]);

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
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 animate-fade-in">
      {/* Debug info */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Debug Information</h3>
        <p className="text-sm text-blue-700">CallPage is loading!</p>
        <p className="text-sm text-blue-700">Customer ID: {customerId}</p>
        <p className="text-sm text-blue-700">Customer Name: {customerName}</p>
        <p className="text-sm text-blue-700">Customer Phone: {customerPhone}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Call Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Calling {customerName}</h1>
                <p className="text-muted-foreground">{customerPhone}</p>
              </div>
            </div>

          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              <span>{formatDuration(callDuration)}</span>
            </div>

            {isCallActive && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-600 font-medium">Connected</span>
              </div>
            )}
          </div>

          {/* Hangup Button */}
          {isCallActive && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleHangup}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full"
                size="lg"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                Hang Up
              </Button>
            </div>
          )}
        </Card>

        {/* Call History Timeline */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Call History & Timeline</h3>

          {callHistory.length === 0 ? (
            <p className="text-muted-foreground">No call history available</p>
          ) : (
            <div className="space-y-4">
              {callHistory.map((call, index) => (
                <div key={call.id} className="flex space-x-4 pb-4 border-b border-border last:border-b-0">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    {index < callHistory.length - 1 && (
                      <div className="w-px h-16 bg-border mt-2" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{call.callType}</Badge>
                      <Badge className={`text-white ${getDispositionColor(call.disposition)}`}>
                        {getDispositionLabel(call.disposition)}
                      </Badge>
                      {call.duration > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(call.duration)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-foreground">{call.notes}</p>

                    {call.nextCallDate && (
                      <p className="text-sm text-blue-600 font-medium">
                        Next call: {new Date(call.nextCallDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
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
          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{callHistory.length}</p>
                <p className="text-sm text-muted-foreground">Total Calls</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {callHistory.filter(call => call.disposition === "interested" || call.disposition === "callback_requested").length}
                </p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatDuration(callHistory.reduce((total, call) => total + call.duration, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Total Time</p>
              </div>
            </div>
          </div>
        </Card>
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
                className="px-6"
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