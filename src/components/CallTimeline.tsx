import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CallRecord {
  id: string;
  callType: 'outgoing' | 'incoming';
  disposition: string;
  notes: string;
  duration: number;
  timestamp: Date;
  nextCallDate?: Date;
}

interface CallTimelineProps {
  customerId: string;
  customerName: string;
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

const CallTimeline = ({ customerId, customerName }: CallTimelineProps) => {
  // Mock call history - in real app, this would come from API
  const callHistory: CallRecord[] = [
    {
      id: '1',
      callType: 'outgoing',
      disposition: 'callback',
      notes: 'Customer requested callback tomorrow after 2 PM. Interested in vehicle insurance.',
      duration: 180,
      timestamp: new Date(2024, 6, 18, 14, 30),
      nextCallDate: new Date(2024, 6, 19, 14, 0)
    },
    {
      id: '2',
      callType: 'outgoing',
      disposition: 'no_answer',
      notes: 'No response, will try again later.',
      duration: 0,
      timestamp: new Date(2024, 6, 17, 10, 15)
    },
    {
      id: '3',
      callType: 'incoming',
      disposition: 'interested',
      notes: 'Customer called asking about life insurance premiums. Provided basic information.',
      duration: 420,
      timestamp: new Date(2024, 6, 15, 16, 45)
    }
  ];

  const getDispositionColor = (disposition: string) => {
    return dispositions.find(d => d.value === disposition)?.color || 'bg-gray-500';
  };

  const getDispositionLabel = (disposition: string) => {
    return dispositions.find(d => d.value === disposition)?.label || disposition;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Phone className="h-5 w-5 mr-2" />
          Call History & Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {callHistory.length === 0 ? (
          <div className="text-center py-8">
            <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No call history available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Timeline */}
            <div className="relative">
              {callHistory.map((record, index) => (
                <div key={record.id} className="relative">
                  {/* Timeline line */}
                  {index < callHistory.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                  )}
                  
                  {/* Timeline item */}
                  <div className="flex items-start space-x-4 pb-6">
                    {/* Timeline dot */}
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-medium",
                      record.callType === 'outgoing' ? 'bg-blue-500' : 'bg-green-500'
                    )}>
                      <Phone className={cn(
                        "h-5 w-5",
                        record.callType === 'incoming' && "rotate-180"
                      )} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-card border rounded-lg p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={record.callType === 'outgoing' ? 'default' : 'secondary'}>
                              {record.callType === 'outgoing' ? 'Outgoing' : 'Incoming'}
                            </Badge>
                            <Badge className={cn("text-white", getDispositionColor(record.disposition))}>
                              {getDispositionLabel(record.disposition)}
                            </Badge>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{record.duration > 0 ? formatDuration(record.duration) : 'No answer'}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Notes */}
                        {record.notes && (
                          <div className="mb-3">
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <p className="text-sm">{record.notes}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Next call date */}
                        {record.nextCallDate && (
                          <div className="mb-3">
                            <div className="flex items-center space-x-2 text-sm text-blue-600">
                              <Calendar className="h-4 w-4" />
                              <span>Next call: {format(record.nextCallDate, "PPP 'at' p")}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Timestamp */}
                        <div className="text-xs text-muted-foreground">
                          {format(record.timestamp, "EEEE, MMMM dd, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{callHistory.length}</div>
                  <div className="text-sm text-muted-foreground">Total Calls</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {callHistory.filter(c => c.duration > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Connected</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(callHistory.reduce((acc, c) => acc + c.duration, 0) / 60)}m
                  </div>
                  <div className="text-sm text-muted-foreground">Total Time</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CallTimeline;