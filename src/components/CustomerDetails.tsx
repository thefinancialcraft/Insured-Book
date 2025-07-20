import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { 
  Copy, 
  FileDown, 
  Phone, 
  Mail, 
  Car, 
  FileText, 
  Calendar,
  User,
  MapPin,
  CreditCard,
  Shield
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CallTimeline from "@/components/CallTimeline";

interface Customer {
  id: number;
  name: string;
  contact: string;
  email: string;
  vehicleType: string;
  brand: string;
  model: string;
  rcNumber: string;
  expiryDate: string;
  daysToExpiry: number;
  birthday: string;
  status: string;
  aadharNo?: string;
  panNo?: string;
  nomineeName?: string;
  nomineeDOB?: string;
  nomineeRelation?: string;
  previousCompany?: string;
  documents?: {
    rcFront?: string;
    rcBack?: string;
    aadharFront?: string;
    aadharBack?: string;
    panCard?: string;
    previousPolicy?: string;
  };
}

interface CustomerDetailsProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetails = ({ customer, isOpen, onClose }: CustomerDetailsProps) => {
  const navigate = useNavigate();
  if (!customer) return null;

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name.split(' ').map(n => n && n[0] ? n[0] : '').join('').toUpperCase();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const generatePDF = async () => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      // Get the dialog content element
      const element = document.querySelector('[data-radix-dialog-content]');
      if (!element) return;

      // Create canvas from the element
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${customer.name}_details.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Customer details saved as PDF",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'active': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const FieldWithCopy = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center space-x-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => copyToClipboard(value, label)}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-full h-full md:max-w-2xl md:max-h-[80vh] md:w-auto md:h-auto overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 bg-gradient-primary">
                <AvatarFallback className="text-primary-foreground font-bold text-lg">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">{customer.name}</DialogTitle>
                <Badge className={`${getStatusColor(customer.status || 'active')} border text-xs mt-1`}>
                  {(customer.status || 'active').toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  onClose();
                  navigate(`/registration?edit=true&customerId=${customer.id}`);
                }} 
                size="sm" 
                variant="outline"
                className="md:flex hidden"
              >
                <FileText className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                onClick={() => {
                  onClose();
                  navigate(`/registration?edit=true&customerId=${customer.id}`);
                }} 
                size="sm" 
                variant="outline"
                className="md:hidden"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button onClick={generatePDF} size="sm" className="bg-gradient-primary md:flex hidden">
                <FileDown className="h-4 w-4 mr-2" />
                Save as PDF
              </Button>
              <Button onClick={generatePDF} size="sm" className="bg-gradient-primary md:hidden">
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                    <p className="text-sm font-medium">{customer.contact}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(customer.contact, "Phone Number")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => navigate(`/call-management?customerId=${customer.id}`)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FieldWithCopy icon={Mail} label="Email Address" value={customer.email} />
              <FieldWithCopy icon={Calendar} label="Date of Birth" value={customer.birthday} />
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldWithCopy icon={FileText} label="RC Number" value={customer.rcNumber} />
              <FieldWithCopy icon={Car} label="Vehicle Type" value={customer.vehicleType} />
              <FieldWithCopy icon={Car} label="Brand & Model" value={`${customer.brand} ${customer.model}`} />
              <FieldWithCopy icon={Calendar} label="Expiry Date" value={customer.expiryDate} />
            </div>
          </div>

          {/* Document Information */}
          {(customer.aadharNo || customer.panNo) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Document Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customer.aadharNo && (
                  <FieldWithCopy icon={CreditCard} label="Aadhar Number" value={customer.aadharNo} />
                )}
                {customer.panNo && (
                  <FieldWithCopy icon={CreditCard} label="PAN Number" value={customer.panNo} />
                )}
                {customer.previousCompany && (
                  <FieldWithCopy icon={Shield} label="Previous Company" value={customer.previousCompany} />
                )}
              </div>
            </div>
          )}

          {/* Nominee Information */}
          {(customer.nomineeName || customer.nomineeDOB || customer.nomineeRelation) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2" />
                Nominee Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customer.nomineeName && (
                  <FieldWithCopy icon={User} label="Nominee Name" value={customer.nomineeName} />
                )}
                {customer.nomineeDOB && (
                  <FieldWithCopy icon={Calendar} label="Nominee DOB" value={customer.nomineeDOB} />
                )}
                {customer.nomineeRelation && (
                  <FieldWithCopy icon={User} label="Relation" value={customer.nomineeRelation} />
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          {customer.documents && Object.keys(customer.documents).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documents
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {customer.documents.rcFront && (
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-xs font-medium">RC Front</p>
                  </div>
                )}
                {customer.documents.rcBack && (
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-xs font-medium">RC Back</p>
                  </div>
                )}
                {customer.documents.aadharFront && (
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <CreditCard className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-xs font-medium">Aadhar Front</p>
                  </div>
                )}
                {customer.documents.aadharBack && (
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <CreditCard className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-xs font-medium">Aadhar Back</p>
                  </div>
                )}
                {customer.documents.panCard && (
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <CreditCard className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-xs font-medium">PAN Card</p>
                  </div>
                )}
                {customer.documents.previousPolicy && (
                  <div className="bg-muted/30 p-3 rounded-lg text-center">
                    <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="text-xs font-medium">Previous Policy</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expiry Status */}
          <div className="bg-gradient-card p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Policy Status</span>
              </div>
              <Badge className={`${getStatusColor(customer.status || 'active')} border`}>
                {customer.daysToExpiry || 0} days remaining
              </Badge>
            </div>
          </div>

          {/* Call Management Section */}
          <div className="space-y-6">
            <CallTimeline customerId={customer.id.toString()} customerName={customer.name} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};