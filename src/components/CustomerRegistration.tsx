import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Upload, 
  Camera, 
  Car, 
  User, 
  Phone, 
  Calendar,
  CreditCard,
  Shield,
  CheckCircle,
  Bike,
  Truck,
  Bus
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface CustomerRegistrationProps {
  onComplete: (customerData?: any) => void;
  customer?: any;
  isEdit?: boolean;
}

export const CustomerRegistration = ({ onComplete, customer, isEdit = false }: CustomerRegistrationProps) => {
  const [registrationType, setRegistrationType] = useState<"quick" | "full">("quick");
  const [formData, setFormData] = useState({
    // Quick registration fields
    rcNumber: customer?.rcNumber || "",
    name: customer?.name || "",
    contact: customer?.contact || "",
    dob: customer?.birthday || "",
    vehicleCategory: customer?.vehicleType || "",
    vehicleBrand: customer?.brand || "",
    modelName: customer?.model || "",
    expiryDate: customer?.expiryDate || "",
    
    // Full registration additional fields
    email: customer?.email || "",
    previousCompany: customer?.previousCompany || "",
    aadharNumber: customer?.aadharNo || "",
    panNumber: customer?.panNo || "",
    nomineeName: customer?.nomineeName || "",
    nomineeDob: customer?.nomineeDOB || "",
    nomineeRelation: customer?.nomineeRelation || ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.rcNumber || !formData.name || !formData.contact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    const customerData = {
      ...formData,
      birthday: formData.dob,
      vehicleType: formData.vehicleCategory,
      brand: formData.vehicleBrand,
      model: formData.modelName,
      aadharNo: formData.aadharNumber,
      panNo: formData.panNumber,
      nomineeDOB: formData.nomineeDob,
    };

    toast({
      title: isEdit ? "Customer Updated Successfully!" : "Customer Registered Successfully!",
      description: `${formData.name} has been ${isEdit ? 'updated in' : 'added to'} your customer database.`,
    });

    onComplete(customerData);
  };

  const vehicleCategories = [
    { value: "2-Wheeler", label: "2-Wheeler", icon: Bike },
    { value: "3-Wheeler", label: "3-Wheeler", icon: Car },
    { value: "4-Wheeler", label: "4-Wheeler", icon: Car },
    { value: "Bus", label: "Bus", icon: Bus },
    { value: "Passenger Car", label: "Passenger Car", icon: Car },
    { value: "Commercial Vehicle", label: "Commercial Vehicle", icon: Truck }
  ];

  const getVehicleIcon = (category: string) => {
    const vehicle = vehicleCategories.find(v => v.value === category);
    return vehicle ? vehicle.icon : Car;
  };

  const vehicleBrands = [
    "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Honda", "Toyota",
    "Ford", "Chevrolet", "Nissan", "Renault", "Volkswagen", "Skoda",
    "BMW", "Mercedes-Benz", "Audi", "Bajaj", "TVS", "Hero", "Yamaha"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Registration Type Selector - Hide descriptions on mobile */}
      <Card className="bg-gradient-card shadow-card border-0 hidden md:block">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <User className="mr-2 h-5 w-5" />
            {isEdit ? 'Edit Registration Type' : 'Choose Registration Type'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                registrationType === "quick" 
                  ? "border-primary bg-primary/5 shadow-primary" 
                  : "hover:shadow-hover"
              }`}
              onClick={() => setRegistrationType("quick")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-foreground">Quick Registration</h3>
                  <Badge variant={registrationType === "quick" ? "default" : "secondary"}>
                    5 min
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  Essential information for immediate policy processing
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2 text-success" />
                    Basic contact details
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2 text-success" />
                    Vehicle information
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2 text-success" />
                    Policy expiry date
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                registrationType === "full" 
                  ? "border-primary bg-primary/5 shadow-primary" 
                  : "hover:shadow-hover"
              }`}
              onClick={() => setRegistrationType("full")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-foreground">Full Registration</h3>
                  <Badge variant={registrationType === "full" ? "default" : "secondary"}>
                    15 min
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  Complete profile with documents and nominee details
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2 text-success" />
                    Everything in Quick
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2 text-success" />
                    Document uploads
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2 text-success" />
                    Nominee information
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Registration Type Selector */}
      <div className="md:hidden flex space-x-2 mb-4">
        <Button 
          variant={registrationType === "quick" ? "default" : "outline"}
          onClick={() => setRegistrationType("quick")}
          className="flex-1"
          size="sm"
        >
          Quick
        </Button>
        <Button 
          variant={registrationType === "full" ? "default" : "outline"}
          onClick={() => setRegistrationType("full")}
          className="flex-1"
          size="sm"
        >
          Full
        </Button>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        <Tabs value={registrationType} className="space-y-6">
          <TabsContent value="quick" className="space-y-6">
            {/* Personal Information */}
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="name" className="text-sm font-medium">
                       Full Name *
                     </Label>
                     <Input
                       id="name"
                       placeholder="Enter full name"
                       value={formData.name}
                       onChange={(e) => handleInputChange("name", e.target.value)}
                       className="h-12 border-2 focus:border-primary transition-colors"
                     />
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="contact" className="text-sm font-medium">
                       Contact Number *
                     </Label>
                     <Input
                       id="contact"
                       placeholder="+91 98765 43210"
                       value={formData.contact}
                       onChange={(e) => handleInputChange("contact", e.target.value)}
                       className="h-12 border-2 focus:border-primary transition-colors"
                     />
                   </div>
                  
                   <div className="space-y-2">
                     <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button
                           variant="outline"
                           className="w-full justify-start text-left font-normal h-12 border-2 hover:border-primary transition-colors"
                         >
                           <Calendar className="mr-2 h-4 w-4" />
                           {formData.dob ? format(new Date(formData.dob), "PPP") : "Pick a date"}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0" align="start">
                         <CalendarComponent
                           mode="single"
                           selected={formData.dob ? new Date(formData.dob) : undefined}
                           onSelect={(date) => handleInputChange("dob", date ? format(date, "yyyy-MM-dd") : "")}
                           initialFocus
                           className="pointer-events-auto"
                         />
                       </PopoverContent>
                     </Popover>
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="rcNumber" className="text-sm font-medium">
                       RC Number *
                     </Label>
                     <Input
                       id="rcNumber"
                       placeholder="DL-01-AB-1234"
                       value={formData.rcNumber}
                       onChange={(e) => handleInputChange("rcNumber", e.target.value)}
                       className="uppercase h-12 border-2 focus:border-primary transition-colors"
                     />
                   </div>
                 </div>
               </CardContent>
             </Card>

             {/* Vehicle Information */}
             <Card className="bg-gradient-card shadow-card border-0">
               <CardHeader>
                 <CardTitle className="flex items-center text-foreground">
                   <Car className="mr-2 h-5 w-5" />
                   Vehicle Information
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="vehicleCategory" className="text-sm font-medium">Vehicle Category</Label>
                     <Select value={formData.vehicleCategory} onValueChange={(value) => handleInputChange("vehicleCategory", value)}>
                       <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                         <SelectValue placeholder="Select category" />
                       </SelectTrigger>
                       <SelectContent>
                         {vehicleCategories.map((category) => {
                           const IconComponent = category.icon;
                           return (
                             <SelectItem key={category.value} value={category.value}>
                               <div className="flex items-center">
                                 <IconComponent className="mr-2 h-4 w-4" />
                                 {category.label}
                               </div>
                             </SelectItem>
                           );
                         })}
                       </SelectContent>
                     </Select>
                   </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleBrand" className="text-sm font-medium">Vehicle Brand</Label>
                    <Select value={formData.vehicleBrand} onValueChange={(value) => handleInputChange("vehicleBrand", value)}>
                      <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                   <div className="space-y-2">
                     <Label htmlFor="modelName" className="text-sm font-medium">
                       Model Name
                     </Label>
                     <Input
                       id="modelName"
                       placeholder="e.g., Swift, Activa, Creta"
                       value={formData.modelName}
                       onChange={(e) => handleInputChange("modelName", e.target.value)}
                       className="h-12 border-2 focus:border-primary transition-colors"
                     />
                   </div>
                 </div>
               </CardContent>
             </Card>

             {/* Policy Information */}
             <Card className="bg-gradient-card shadow-card border-0">
               <CardHeader>
                 <CardTitle className="flex items-center text-foreground">
                   <Shield className="mr-2 h-5 w-5" />
                   Policy Information
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="expiryDate" className="text-sm font-medium">Policy Expiry Date</Label>
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button
                           variant="outline"
                           className="w-full justify-start text-left font-normal h-12 border-2 hover:border-primary transition-colors"
                         >
                           <Calendar className="mr-2 h-4 w-4" />
                           {formData.expiryDate ? format(new Date(formData.expiryDate), "PPP") : "Pick expiry date"}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0" align="start">
                         <CalendarComponent
                           mode="single"
                           selected={formData.expiryDate ? new Date(formData.expiryDate) : undefined}
                           onSelect={(date) => handleInputChange("expiryDate", date ? format(date, "yyyy-MM-dd") : "")}
                           initialFocus
                           className="pointer-events-auto"
                         />
                       </PopoverContent>
                     </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          <TabsContent value="full" className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="rcNumber">RC Number *</Label>
                    <Input
                      id="rcNumber"
                      placeholder="DL-01-AB-1234"
                      value={formData.rcNumber}
                      onChange={(e) => handleInputChange("rcNumber", e.target.value)}
                      className="uppercase"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number *</Label>
                    <Input
                      id="contact"
                      placeholder="+91 98765 43210"
                      value={formData.contact}
                      onChange={(e) => handleInputChange("contact", e.target.value)}
                    />
                  </div>
                  
                   <div className="space-y-2">
                     <Label htmlFor="email" className="flex items-center">
                       <User className="mr-2 h-4 w-4" />
                       Email Address
                     </Label>
                     <Input
                       id="email"
                       type="email"
                       placeholder="example@email.com"
                       value={formData.email}
                       onChange={(e) => handleInputChange("email", e.target.value)}
                       className="pl-10"
                     />
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="aadharNumber" className="flex items-center">
                       <CreditCard className="mr-2 h-4 w-4" />
                       Aadhaar Number
                     </Label>
                     <Input
                       id="aadharNumber"
                       placeholder="XXXX XXXX XXXX"
                       value={formData.aadharNumber}
                       onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
                       className="pl-10"
                     />
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="panNumber" className="flex items-center">
                       <CreditCard className="mr-2 h-4 w-4" />
                       PAN Number
                     </Label>
                     <Input
                       id="panNumber"
                       placeholder="ABCDE1234F"
                       value={formData.panNumber}
                       onChange={(e) => handleInputChange("panNumber", e.target.value)}
                       className="uppercase pl-10"
                     />
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Car className="mr-2 h-5 w-5" />
                  Vehicle & Policy Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleCategory">Vehicle Category</Label>
                    <Select value={formData.vehicleCategory} onValueChange={(value) => handleInputChange("vehicleCategory", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                       <SelectContent>
                         {vehicleCategories.map((category) => {
                           const IconComponent = category.icon;
                           return (
                             <SelectItem key={category.value} value={category.value}>
                               <div className="flex items-center">
                                 <IconComponent className="mr-2 h-4 w-4" />
                                 {category.label}
                               </div>
                             </SelectItem>
                           );
                         })}
                       </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleBrand">Vehicle Brand</Label>
                    <Select value={formData.vehicleBrand} onValueChange={(value) => handleInputChange("vehicleBrand", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="modelName">Model Name</Label>
                    <Input
                      id="modelName"
                      placeholder="e.g., Swift, Activa, Creta"
                      value={formData.modelName}
                      onChange={(e) => handleInputChange("modelName", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="previousCompany">Previous Insurance Company</Label>
                    <Input
                      id="previousCompany"
                      placeholder="e.g., HDFC ERGO, ICICI Lombard"
                      value={formData.previousCompany}
                      onChange={(e) => handleInputChange("previousCompany", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Policy Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nominee Information */}
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Shield className="mr-2 h-5 w-5" />
                  Nominee Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nomineeName">Nominee Name</Label>
                    <Input
                      id="nomineeName"
                      placeholder="Enter nominee name"
                      value={formData.nomineeName}
                      onChange={(e) => handleInputChange("nomineeName", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nomineeDob">Nominee Date of Birth</Label>
                    <Input
                      id="nomineeDob"
                      type="date"
                      value={formData.nomineeDob}
                      onChange={(e) => handleInputChange("nomineeDob", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nomineeRelation">Relationship</Label>
                    <Select value={formData.nomineeRelation} onValueChange={(value) => handleInputChange("nomineeRelation", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <FileText className="mr-2 h-5 w-5" />
                  Document Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "RC Front", required: true },
                    { label: "RC Back", required: true },
                    { label: "Aadhaar Front", required: false },
                    { label: "Aadhaar Back", required: false },
                    { label: "PAN Card", required: false },
                    { label: "Previous Policy", required: false }
                  ].map((doc, index) => (
                    <div key={index} className="space-y-2">
                      <Label>{doc.label} {doc.required && "*"}</Label>
                       <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                         <input
                           type="file"
                           accept=".pdf,.jpg,.jpeg,.png"
                           className="hidden"
                           id={`file-${index}`}
                           onChange={(e) => {
                             if (e.target.files && e.target.files[0]) {
                               toast({
                                 title: "File Selected",
                                 description: `${doc.label}: ${e.target.files[0].name}`
                               });
                             }
                           }}
                         />
                         <label htmlFor={`file-${index}`} className="flex flex-col items-center space-y-2 cursor-pointer">
                           <div className="flex space-x-2">
                             <Upload className="h-8 w-8 text-muted-foreground" />
                             <Camera className="h-8 w-8 text-muted-foreground" />
                           </div>
                           <p className="text-sm text-muted-foreground">
                             Drop files here or click to upload
                           </p>
                           <p className="text-xs text-muted-foreground">
                             PDF, JPG, PNG (max 5MB)
                           </p>
                         </label>
                       </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

         {/* Submit Buttons */}
         <div className="flex justify-end space-x-4">
           <Button 
             type="button" 
             variant="outline"
             onClick={() => onComplete()}
           >
             Cancel
           </Button>
           <Button type="submit" className="bg-gradient-primary shadow-primary">
             {isEdit ? 'Update Customer' : 'Register Customer'}
           </Button>
         </div>
      </form>
    </div>
  );
};