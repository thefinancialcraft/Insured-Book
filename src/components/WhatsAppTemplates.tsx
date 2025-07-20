import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Gift, AlertTriangle, Megaphone, Percent } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Customer {
  id: number;
  name: string;
  contact: string;
  brand: string;
  model: string;
  expiryDate: string;
  daysToExpiry: number;
}

interface WhatsAppTemplatesProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  messageType?: 'general' | 'birthday' | 'expiry' | 'sales' | 'festival';
}

export const WhatsAppTemplates = ({ customer, isOpen, onClose, messageType = 'general' }: WhatsAppTemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  if (!customer) return null;

  const templates = {
    birthday: [
      {
        title: "Birthday Wishes",
        message: `🎉 Happy Birthday ${customer.name}! 🎂

Wishing you a wonderful year ahead filled with safe travels in your ${customer.brand} ${customer.model}.

As a birthday gift, we have special discounts on policy renewals this month!

Celebrate safely! 🎈`
      },
      {
        title: "Birthday with Special Offer",
        message: `🎈 Happy Birthday ${customer.name}! 🎁

May this special day bring you happiness and joy!

Special Birthday Offer: Get 15% OFF on your ${customer.brand} ${customer.model} policy renewal.
RC: ${customer.contact}

Enjoy your day! ✨`
      }
    ],
    expiry: [
      {
        title: "Policy Expiry Reminder",
        message: `Hi ${customer.name}!

Your ${customer.brand} ${customer.model} insurance policy (RC: ${customer.contact}) is expiring on ${customer.expiryDate}.

Let's renew it to keep you protected! Call us today for the best rates.

Thanks!`
      },
      {
        title: "Early Renewal Benefits",
        message: `Hi ${customer.name}!

Did you know early renewal of your ${customer.brand} ${customer.model} insurance comes with extra benefits?

✅ No Claim Bonus protection
✅ Zero paperwork hassle
✅ Best renewal rates

Don't wait till the last moment! Contact us today.`
      }
    ],
    sales: [
      {
        title: "Special Discount",
        message: `💰 Special Offer for ${customer.name}!

Get up to 25% OFF on your ${customer.brand} ${customer.model} insurance renewal!

Limited time offer - valid till month end.
RC: ${customer.contact}

Call now to avail this exclusive discount! 📞`
      },
      {
        title: "Sales Follow-up",
        message: `Hello ${customer.name},

Hope you're enjoying your ${customer.brand} ${customer.model}!

We wanted to check if you need any assistance with your insurance policy or have any questions.

Our team is here to help you 24/7. Feel free to reach out anytime!

Best regards`
      }
    ],
    festival: [
      {
        title: "Festival Greetings",
        message: `🪔 Festival Greetings ${customer.name}!

May this festive season bring you joy, prosperity and safe journeys with your ${customer.brand} ${customer.model}.

Don't forget to check your insurance coverage before traveling during the festivities!

Happy celebrations! ✨`
      },
      {
        title: "New Year Wishes",
        message: `🎊 Happy New Year ${customer.name}! 🎆

Wishing you safe travels and smooth rides in the year ahead with your ${customer.brand} ${customer.model}!

New Year Special: Get extra coverage at no extra cost for early renewals.

Let's make this year accident-free! 🚗`
      }
    ],
    general: [
      {
        title: "Check-in Message",
        message: `Hi ${customer.name}! 👋

Hope you're doing well! Just checking in to see how your ${customer.brand} ${customer.model} is performing.

Any insurance queries or need assistance with claims? We're here to help!

Have a great day!
Insurance Team`
      },
      {
        title: "Service Reminder",
        message: `Dear ${customer.name},

Regular vehicle maintenance ensures better insurance claims processing.

Your ${customer.brand} ${customer.model} might need a service check. Keep those service records updated!

Need any insurance guidance? We're just a message away.

Insurance Team`
      }
    ]
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'birthday': return <Gift className="h-4 w-4" />;
      case 'expiry': return <AlertTriangle className="h-4 w-4" />;
      case 'sales': return <Percent className="h-4 w-4" />;
      case 'festival': return <Gift className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getTemplateColor = (type: string) => {
    switch (type) {
      case 'birthday': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'expiry': return 'bg-red-100 text-red-700 border-red-200';
      case 'sales': return 'bg-green-100 text-green-700 border-green-200';
      case 'festival': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const sendWhatsApp = (message: string) => {
    const phoneNumber = customer.contact.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Opened",
      description: `Message template loaded for ${customer.name}`,
    });
    
    onClose();
  };

  const currentTemplates = templates[messageType] || templates.general;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-4xl md:max-h-[85vh] md:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            WhatsApp Message Templates
          </DialogTitle>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-muted-foreground">For:</span>
            <Badge variant="secondary">{customer.name}</Badge>
            <Badge className={`${getTemplateColor(messageType)} border text-xs`}>
              {getTemplateIcon(messageType)}
              <span className="ml-1">{messageType.toUpperCase()}</span>
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Template Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {[...currentTemplates, ...templates.birthday, ...templates.sales, ...templates.festival, ...templates.general].map((template, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer hover:shadow-md transition-all duration-300 ${
                  selectedTemplate === template.message ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedTemplate(template.message)}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm md:text-base truncate">{template.title}</h4>
                    {selectedTemplate === template.message && (
                      <Badge variant="default" className="text-xs">Selected</Badge>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {template.message.substring(0, 80)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message Preview/Edit */}
          {selectedTemplate && (
            <div className="space-y-3">
              <h4 className="font-medium">Selected Message</h4>
              <div className="bg-muted/30 p-4 rounded-lg border max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-foreground">
                  {selectedTemplate}
                </pre>
              </div>
              <Textarea
                placeholder="Edit the message or write a custom one..."
                value={selectedTemplate || customMessage}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  setCustomMessage("");
                }}
                rows={6}
                className="resize-none"
              />
            </div>
          )}

          {!selectedTemplate && (
            <div className="space-y-3">
              <h4 className="font-medium">Custom Message</h4>
              <Textarea
                placeholder="Write a custom message or select a template above..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={() => sendWhatsApp(selectedTemplate || customMessage)}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!selectedTemplate && !customMessage}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send via WhatsApp
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};