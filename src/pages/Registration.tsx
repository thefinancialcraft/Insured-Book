import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { CustomerRegistration } from "@/components/CustomerRegistration";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Registration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [customerData, setCustomerData] = useState(null);
  
  const isEdit = searchParams.get("edit") === "true";
  const customerId = searchParams.get("customerId");

  // Mock customer data - in real app this would come from API
  useEffect(() => {
    if (isEdit && customerId) {
      // Mock API call to get customer data
      const mockCustomers = [
        {
          id: 1,
          name: "Rajesh Kumar",
          contact: "+91 98765 43210",
          email: "rajesh.kumar@email.com",
          vehicleType: "4-Wheeler",
          brand: "Maruti Suzuki",
          model: "Swift",
          rcNumber: "DL-01-AB-1234",
          expiryDate: "2024-12-15",
          birthday: "1985-06-15",
          aadharNo: "1234-5678-9012",
          panNo: "ABCDE1234F",
          nomineeName: "Priya Kumar",
          nomineeDOB: "1988-08-20",
          nomineeRelation: "Spouse",
          previousCompany: "Bajaj Allianz"
        },
        {
          id: 2,
          name: "Priya Sharma",
          contact: "+91 87654 32109",
          email: "priya.sharma@email.com",
          vehicleType: "2-Wheeler",
          brand: "Honda",
          model: "Activa",
          rcNumber: "DL-02-XY-5678",
          expiryDate: "2024-08-20",
          birthday: "1990-03-22",
          aadharNo: "2345-6789-0123",
          panNo: "FGHIJ5678K",
          nomineeName: "Amit Sharma",
          nomineeDOB: "1987-12-10",
          nomineeRelation: "Husband"
        }
      ];
      
      const customer = mockCustomers.find(c => c.id === parseInt(customerId));
      setCustomerData(customer || null);
    }
  }, [isEdit, customerId]);

  const handleComplete = () => {
    navigate("/customers");
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? "Edit Customer" : "Customer Registration"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Update customer and policy details" : "Add new customer and policy details"}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleBackToDashboard}
          className="hidden md:flex"
        >
          Back to Dashboard
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleBackToDashboard}
          className="md:hidden"
        >
          <TrendingUp className="h-4 w-4" />
        </Button>
      </div>
      <CustomerRegistration 
        onComplete={handleComplete} 
        customer={customerData}
        isEdit={isEdit}
      />
    </div>
  );
};

export default Registration;