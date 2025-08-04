import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CheckCircle,
    AlertCircle
} from "lucide-react";

interface UserData {
    userName: string;
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

const ProfileCompletion = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { profile, loading: profileLoading, refresh: refreshProfile } = useProfileCompletion();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<UserData>({
        userName: "",
        email: user?.email || "",
        contactNo: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        dob: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        // Check if user already has profile data
        checkExistingProfile();
    }, [user, navigate]);

    const checkExistingProfile = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (data && !error) {
                // User already has profile data, redirect to approval pending
                navigate("/approval-pending");
            }
        } catch (error) {
            console.log("No existing profile found");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setError("User not authenticated");
            return;
        }

        // Validation
        if (!userData.userName || !userData.contactNo || !userData.address || !userData.city || !userData.state || !userData.pincode || !userData.dob) {
            setError("All fields are required.");
            return;
        }

        // Phone number validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(userData.contactNo)) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        // Pincode validation
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(userData.pincode)) {
            setError("Please enter a valid 6-digit pincode.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // First, verify that the user exists in auth.users
            console.log("User ID:", user.id);
            console.log("User email:", user.email);

            // Check if user exists in auth.users table
            const { data: authUser, error: authError } = await supabase.auth.getUser();

            if (authError || !authUser.user) {
                setError("User authentication failed. Please try logging in again.");
                setLoading(false);
                return;
            }

            console.log("Auth user verified:", authUser.user.id);

            const profileData = {
                user_id: user.id,
                user_name: userData.userName,
                email: userData.email,
                contact_no: userData.contactNo,
                address: userData.address,
                city: userData.city,
                state: userData.state,
                pincode: userData.pincode,
                dob: userData.dob,
                approval_status: 'pending',
                status: 'active' // Default to active when approved
            };

            console.log("Inserting profile data:", profileData);
            console.log("User ID for insert:", user.id);

            const { data, error } = await supabase
                .from('user_profiles')
                .insert(profileData)
                .select(); // Add select to get the inserted data back

            if (error) {
                console.error("Database error:", error);
                console.error("Error details:", {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                if (error.code === '23503') {
                    setError("User account not found. Please try logging in again.");
                } else {
                    setError(error.message || "Failed to save profile data.");
                }
            } else {
                console.log("Profile insert successful, data:", data);
                console.log("Inserted profile details:", data?.[0] ? {
                    id: data[0].id,
                    user_id: data[0].user_id,
                    user_name: data[0].user_name,
                    approval_status: data[0].approval_status,
                    status: data[0].status,
                    role: data[0].role
                } : "No data returned");

                // Wait a moment for the database to fully commit the transaction
                console.log("Waiting for database transaction to commit...");
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Verify the profile was saved correctly
                const { data: verifyData, error: verifyError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                console.log("Profile verification result:", { verifyData, verifyError });

                // Also check all profiles for this user to see if there are multiple entries
                const { data: allProfiles, error: allProfilesError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', user.id);

                console.log("All profiles for user:", { allProfiles, allProfilesError });

                if (verifyData && verifyData.approval_status === 'pending') {
                    console.log("Profile verified successfully, refreshing profile data");
                    setSuccess(true);
                    setError("");

                    // Refresh the profile data in the hook
                    await refreshProfile();

                    // Wait a moment for the profile to be refreshed
                    await new Promise(resolve => setTimeout(resolve, 500));

                    console.log("Profile refreshed, redirecting to approval pending");
                    navigate("/approval-pending", { replace: true });
                } else {
                    console.error("Profile verification failed or approval status incorrect");
                    setError("Profile saved but verification failed. Please try again.");
                }
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setError("An error occurred while saving your profile.");
        }

        setLoading(false);
    };

    const getCitiesForState = (state: string) => {
        return indianCities[state as keyof typeof indianCities] || [];
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
            <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="flex flex-col items-center mb-7">
                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-2">
                        <User className="w-8 h-8 text-green-500" />
                    </span>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1 tracking-tight">Complete Your Profile</h2>
                    <p className="text-gray-400 text-sm">Please provide your details to complete your account setup</p>
                </div>

                {success ? (
                    <div className="text-center space-y-4">
                        <div className="bg-green-50 text-green-600 px-3 py-2 rounded mb-2 text-center text-sm border border-green-100 flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Profile completed successfully! Redirecting to approval page...
                        </div>

                        <button
                            onClick={async () => {
                                console.log("Manual profile check after completion:");
                                const { data, error } = await supabase
                                    .from('user_profiles')
                                    .select('*')
                                    .eq('user_id', user?.id)
                                    .single();
                                console.log("Profile after completion:", { data, error });
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition text-sm"
                        >
                            Check Profile Status
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 px-3 py-2 rounded mb-2 text-center text-sm border border-red-100 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="userName" className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Full Name *
                            </label>
                            <input
                                id="userName"
                                name="userName"
                                type="text"
                                value={userData.userName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-gray-700 text-sm transition"
                                required
                                autoFocus
                                disabled={loading}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                Email *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={userData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-gray-700 text-sm transition"
                                required
                                disabled={true}
                                placeholder="Your email address"
                            />
                        </div>

                        <div>
                            <label htmlFor="contactNo" className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                Contact Number *
                            </label>
                            <input
                                id="contactNo"
                                name="contactNo"
                                type="tel"
                                value={userData.contactNo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-gray-700 text-sm transition"
                                required
                                disabled={loading}
                                placeholder="Enter 10-digit phone number"
                                maxLength={10}
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Address *
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={userData.address}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-gray-700 text-sm transition resize-none"
                                required
                                disabled={loading}
                                placeholder="Enter your street address, house number, locality"
                                rows={2}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label htmlFor="state" className="block text-xs font-medium text-gray-500 mb-1">State *</label>
                                <select
                                    id="state"
                                    name="state"
                                    value={userData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-gray-700 text-sm transition"
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select State</option>
                                    {indianStates.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-xs font-medium text-gray-500 mb-1">City *</label>
                                <select
                                    id="city"
                                    name="city"
                                    value={userData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-gray-700 text-sm transition"
                                    required
                                    disabled={loading || !userData.state}
                                >
                                    <option value="">Select City</option>
                                    {userData.state && getCitiesForState(userData.state).map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="pincode" className="block text-xs font-medium text-gray-500 mb-1">Pincode *</label>
                                <input
                                    id="pincode"
                                    name="pincode"
                                    type="text"
                                    value={userData.pincode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-gray-700 text-sm transition"
                                    required
                                    disabled={loading}
                                    placeholder="6-digit pincode"
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="dob" className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Date of Birth *
                            </label>
                            <input
                                id="dob"
                                name="dob"
                                type="date"
                                value={userData.dob}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-gray-700 text-sm transition"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Saving Profile..." : "Complete Profile"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfileCompletion; 