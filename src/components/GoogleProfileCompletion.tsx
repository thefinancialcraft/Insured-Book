import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  ChevronDown
} from "lucide-react";

interface GoogleUserData {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dob: string;
}

// Indian States and Cities data
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Lakshadweep", "Puducherry", "Andaman and Nicobar Islands"
];

const indianCities = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Kakinada", "Tirupati", "Anantapur", "Kadapa"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Bomdila", "Tawang", "Ziro", "Along", "Tezu", "Roing", "Changlang"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tinsukia", "Sivasagar", "Tezpur", "Nagaon", "Bongaigaon", "Dhubri"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Bihar Sharif", "Katihar", "Chapra"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Bilaspur", "Korba"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Mormugao", "Bicholim", "Sanquelim", "Valpoi", "Curchorem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Anand", "Bharuch", "Gandhidham"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Solan", "Kullu", "Dharamshala", "Bilaspur", "Una", "Hamirpur", "Chamba", "Kangra"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Dumka", "Phusro", "Adityapur"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kottayam", "Kannur", "Pathanamthitta"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Senapati", "Tamenglong", "Chandel", "Ukhrul", "Jiribam", "Kakching"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Resubelpara", "Baghmara", "Nongpoh", "Mairang", "Ampati"],
  "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Mamit", "Khawzawl", "Hnahthial", "Saitual"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Longleng", "Kiphire", "Peren"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Pathankot", "Hoshiarpur", "Moga", "Firozpur", "Sangrur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sri Ganganagar", "Sikar"],
  "Sikkim": ["Gangtok", "Namchi", "Mangan", "Gyalshing", "Ravong", "Lachung", "Lachen", "Pelling", "Rumtek", "Rangpo"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Vellore", "Erode", "Thoothukkudi", "Tiruppur", "Dindigul"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Siddipet"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar", "Belonia", "Khowai", "Teliamura", "Amarpur", "Sabroom", "Jirania"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Kotdwara", "Ramnagar", "Pithoragarh"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur"],
  "Delhi": ["New Delhi", "Delhi Cantonment", "Civil Lines", "Karol Bagh", "Paharganj", "Connaught Place", "Chanakyapuri", "Dwarka", "Rohini", "Pitampura"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Udhampur", "Pulwama", "Rajouri", "Kupwara", "Samba"],
  "Ladakh": ["Leh", "Kargil", "Drass", "Nubra", "Zanskar", "Changthang", "Suru", "Wakha", "Shyok", "Indus"],
  "Chandigarh": ["Chandigarh", "Sector 17", "Sector 22", "Sector 35", "Industrial Area", "Manimajra", "Burail", "Maloya", "Kajheri", "Palsora"],
  "Dadra and Nagar Haveli": ["Silvassa", "Naroli", "Dadra", "Rakholi", "Khanvel", "Masat", "Samarvarni", "Kadod", "Galonda", "Kherdi"],
  "Daman and Diu": ["Daman", "Diu", "Moti Daman", "Nani Daman", "Ghogol", "Kachigam", "Kadaiya", "Magarwada", "Varkund", "Devka"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Amini", "Andrott", "Kadmat", "Kalpeni", "Kiltan", "Minicoy", "Chetlat", "Bitra"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam", "Ozhukarai", "Villianur", "Mannadipet", "Ariyankuppam", "Nettapakkam", "Kurumbapet"],
  "Andaman and Nicobar Islands": ["Port Blair", "Car Nicobar", "Hut Bay", "Mayabunder", "Diglipur", "Rangat", "Campbell Bay", "Teressa", "Katchal", "Kamorta"]
};

const GoogleProfileCompletion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<GoogleUserData>({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dob: ""
  });

  useEffect(() => {
    if (user) {
      // Extract data from Google user
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const googleData = {
        firstName: firstName,
        lastName: lastName,
        email: user.email || "",
        contactNo: user.user_metadata?.phone_number || user.user_metadata?.phone || "",
        address: user.user_metadata?.address || user.user_metadata?.street_address || "",
        city: user.user_metadata?.city || user.user_metadata?.locality || "",
        state: user.user_metadata?.state || user.user_metadata?.administrative_area || "",
        pincode: user.user_metadata?.pincode || user.user_metadata?.postal_code || "",
        dob: user.user_metadata?.dob || user.user_metadata?.birth_date || user.user_metadata?.birthday || ""
      };
      
      setUserData(googleData);
      
      // Log Google user data for debugging
      console.log("Google User Data:", user.user_metadata);
      console.log("Extracted Data:", googleData);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!userData.firstName || !userData.email || !userData.contactNo || !userData.address || 
        !userData.city || !userData.state || !userData.pincode || !userData.dob) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(userData.contactNo)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      });
      return;
    }

    // Validate pincode
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(userData.pincode)) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          full_name: `${userData.firstName} ${userData.lastName}`.trim(),
          phone_number: userData.contactNo,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          pincode: userData.pincode,
          dob: userData.dob
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Profile Completed",
        description: "Your profile has been updated successfully!",
      });

      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getGoogleDataStatus = () => {
    const filledFields = Object.values(userData).filter(value => value.trim() !== "").length;
    const totalFields = Object.keys(userData).length;
    return { filledFields, totalFields };
  };

  const { filledFields, totalFields } = getGoogleDataStatus();
  const { getProfileCompletionPercentage } = useProfileCompletion();
  const completionPercentage = getProfileCompletionPercentage();

  // Get cities for selected state
  const getCitiesForState = (state: string) => {
    return indianCities[state as keyof typeof indianCities] || [];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
            </div>
            <p className="text-gray-600">
              We've extracted some information from your Google account. Please complete the remaining details.
            </p>
            
            {/* Progress indicator */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Profile Completion</span>
                <span>{filledFields}/{totalFields} fields filled</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-600">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={userData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-600">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={userData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-600">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactNo" className="text-sm font-medium text-gray-600">
                    Contact Number *
                  </Label>
                  <Input
                    id="contactNo"
                    name="contactNo"
                    type="tel"
                    value={userData.contactNo}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dob" className="text-sm font-medium text-gray-600">
                    Date of Birth *
                  </Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={userData.dob}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Address Information
                </h3>
                
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-600">
                    Street Address *
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your street address, house number, locality"
                    rows={3}
                    className="mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-gray-600">
                      State *
                    </Label>
                    <div className="relative mt-1">
                      <select
                        id="state"
                        name="state"
                        value={userData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-gray-700 text-sm transition appearance-none"
                        required
                      >
                        <option value="">Select State</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-600">
                      City *
                    </Label>
                    <div className="relative mt-1">
                      <select
                        id="city"
                        name="city"
                        value={userData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-gray-700 text-sm transition appearance-none"
                        required
                        disabled={!userData.state}
                      >
                        <option value="">Select City</option>
                        {userData.state && getCitiesForState(userData.state).map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="pincode" className="text-sm font-medium text-gray-600">
                      Pincode *
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      value={userData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? "Updating Profile..." : "Complete Profile"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Skip for Now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleProfileCompletion; 