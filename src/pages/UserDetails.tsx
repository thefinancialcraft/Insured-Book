import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  Edit3, 
  Save, 
  X,
  Shield
} from "lucide-react";

const UserDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get user data from Google authentication or use defaults
  const [userData, setUserData] = useState({
    userName: user?.user_metadata?.full_name || user?.user_metadata?.name || "Not provided",
    email: user?.email || "Not provided",
    contactNo: user?.user_metadata?.phone_number || "Not provided",
    address: user?.user_metadata?.address || "Not provided",
    city: user?.user_metadata?.city || "Not provided",
    state: user?.user_metadata?.state || "Not provided",
    pincode: user?.user_metadata?.pincode || "Not provided",
    dob: user?.user_metadata?.dob || "Not provided",
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available",
    lastLogin: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Not available"
  });

  const [editData, setEditData] = useState(userData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUserData(editData);
    setIsEditing(false);
    setLoading(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const renderField = (label: string, value: string, name: string, type: string = "text", placeholder?: string) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-600">{label}</Label>
      {isEditing ? (
        <Input
          name={name}
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
          {value}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                onClick={handleCancel} 
                variant="outline"
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderField("Full Name", editData.userName, "userName", "text", "Enter your full name")}
            {renderField("Email Address", editData.email, "email", "email", "Enter your email")}
            {renderField("Contact Number", editData.contactNo, "contactNo", "tel", "Enter phone number")}
            {renderField("Date of Birth", editData.dob, "dob", "date")}
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Address</Label>
              {isEditing ? (
                <Textarea
                  name="address"
                  value={editData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete address"
                  className="w-full"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {editData.address}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">City</Label>
                {isEditing ? (
                  <Input
                    name="city"
                    value={editData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {editData.city}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">State</Label>
                {isEditing ? (
                  <Input
                    name="state"
                    value={editData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {editData.state}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Pincode</Label>
                {isEditing ? (
                  <Input
                    name="pincode"
                    value={editData.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode"
                    maxLength={6}
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {editData.pincode}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderField("User ID", user?.id || "N/A", "userId", "text")}
            {renderField("Join Date", editData.joinDate, "joinDate", "date")}
            {renderField("Last Login", editData.lastLogin, "lastLogin", "text")}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Account Status</Label>
              <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
                Active
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Password</Label>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Two-Factor Authentication</Label>
              <Button variant="outline" className="w-full">
                Enable 2FA
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Login Sessions</Label>
              <Button variant="outline" className="w-full">
                Manage Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetails; 