import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, UserPlus } from "lucide-react";
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
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 flex flex-col items-center animate-fade-in">
      {/* Modern Header */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToDashboard}
            className="border border-gray-200 bg-white/60 hover:bg-white/80 shadow-md"
          >
            <ArrowLeft className="h-5 w-5 text-purple-700" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-3 rounded-2xl shadow-lg">
              {isEdit ? (
                <FileText className="h-6 w-6 text-white" />
              ) : (
                <UserPlus className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {isEdit ? "Edit Customer" : "Customer Registration"}
              </h1>
              <p className="text-base md:text-sm text-gray-600">
                {isEdit ? "Update customer and policy details" : "Add new customer and policy details"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form Card */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-2xl p-3 md:p-8 transition-all duration-300">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex gap-2">
            <div className="h-2 w-8 rounded-full bg-purple-600" />
            <div className="h-2 w-8 rounded-full bg-purple-300" />
            <div className="h-2 w-8 rounded-full bg-purple-100" />
          </div>
        </div>
        {/* Registration Form */}
        <CustomerRegistration
          onComplete={handleComplete}
          customer={customerData}
          isEdit={isEdit}
        />
      </div>
    </div>
  );
};

export default Registration;