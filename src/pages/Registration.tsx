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

  // Mock latest entries data
  const latestEntries = [
    {
      id: 1,
      name: "Rajesh Kumar",
      vehicle: "Maruti Suzuki Swift",
      date: "2024-06-01"
    },
    {
      id: 2,
      name: "Priya Sharma",
      vehicle: "Honda Activa",
      date: "2024-05-28"
    },
    {
      id: 3,
      name: "Amit Verma",
      vehicle: "Hyundai Creta",
      date: "2024-05-25"
    },
    {
      id: 4,
      name: "Sunita Singh",
      vehicle: "Tata Nexon",
      date: "2024-05-22"
    },
    {
      id: 5,
      name: "Vikas Patel",
      vehicle: "Hero Splendor",
      date: "2024-05-20"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Hero + Latest Entries */}
        <div className="lg:w-1/3 w-full">
          <div className="lg:sticky lg:top-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-6 text-white mb-6">
              <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-10 translate-x-10"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                    {isEdit ? (
                      <FileText className="h-6 w-6 text-white" />
                    ) : (
                      <UserPlus className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm font-medium">{isEdit ? "Edit Customer" : "Customer Registration"}</p>
                    <p className="text-xs text-purple-200">{isEdit ? "Update customer and policy details" : "Add new customer and policy details"}</p>
                  </div>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold leading-tight mb-2">
                  {isEdit ? "Update Customer" : "Register New Customer"}
                </h1>
                <p className="text-purple-100 text-sm lg:text-base leading-relaxed">
                  {isEdit
                    ? "Edit and update the details for your customer and their insurance policy."
                    : "Fill out the form to add a new customer and their policy details to your insurance business."}
                </p>
              </div>
            </div>
            {/* Latest Entries */}
            <div className="bg-white/90 rounded-2xl border border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Latest Registrations</h2>
              <ul className="divide-y divide-gray-200">
                {latestEntries.slice(0, 3).map(entry => (
                  <li key={entry.id} className="py-2 flex flex-col">
                    <span className="font-medium text-gray-800">{entry.name}</span>
                    <span className="text-xs text-gray-500">{entry.vehicle}</span>
                    <span className="text-xs text-purple-600">{entry.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Right Side: Registration Form */}
        <div className="lg:w-2/3 w-full">
          <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 p-3 md:p-8 transition-all duration-300">
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
      </div>
    </div>
  );
};

export default Registration;