import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  Shield,
  ArrowLeft,
  TrendingUp,
  Bell,
  Plus
} from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

const UserDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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
    lastLogin: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Not available",
    role: "employee",
    employee_id: "",
    joining_date: ""
  });

  const [editData, setEditData] = useState(userData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch profile from Supabase on mount to get backend-managed fields
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setUserData({
          userName: data.user_name || "",
          email: data.email || "",
          contactNo: data.contact_no || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          dob: data.dob || "",
          joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available",
          lastLogin: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Not available",
          role: data.role || "employee",
          employee_id: data.employee_id || "",
          joining_date: data.joining_date || ""
        });
        setEditData({
          userName: data.user_name || "",
          email: data.email || "",
          contactNo: data.contact_no || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          dob: data.dob || "",
          joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available",
          lastLogin: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Not available",
          role: data.role || "employee",
          employee_id: data.employee_id || "",
          joining_date: data.joining_date || ""
        });
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Prepare the payload for Supabase (do NOT update employee_id, joining_date, or role)
      const payload = {
        user_id: user.id,
        user_name: editData.userName,
        email: editData.email,
        contact_no: editData.contactNo,
        address: editData.address,
        city: editData.city,
        state: editData.state,
        pincode: editData.pincode,
        dob: editData.dob
      };
      // Check if profile exists
      const { data: existing, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      let result;
      if (existing) {
        // Update
        result = await supabase
          .from('user_profiles')
          .update(payload)
          .eq('user_id', user.id);
      } else {
        // Insert
        result = await supabase
          .from('user_profiles')
          .insert(payload);
      }
      if (result.error) {
        throw result.error;
      }
      setUserData({ ...userData, ...editData });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error updating profile",
        description: err.message || "An error occurred while updating your profile.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  // Fetch sessions from Supabase
  const fetchSessions = async () => {
    setSessionLoading(true);
    if (!user) return;
    try {
      // @ts-ignore
      const { data, error } = await window.supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) setSessions(data || []);
    } catch (e) { }
    setSessionLoading(false);
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

  // --- Redesigned Profile Page ---
  return (
    <div className="container mx-auto px-2 md:px-4 py-6 max-w-4xl space-y-6">
      {/* Hero Section (Dashboard style) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-4 md:p-8 text-white shadow-2xl pt-1 md:pt-8 mb-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center md:items-start flex-1 mb-4 md:mb-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mb-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-lg md:text-3xl lg:text-4xl font-bold pt-2 md:mb-3 leading-tight text-center md:text-left">
              Your Profile
              <br className="md:hidden" />
              <span className="text-purple-200 block text-2xl md:text-4xl lg:text-5xl tracking-wide capitalize">{userData.userName}</span>
            </h1>
            <p className="text-purple-100 text-sm md:text-lg max-w-2xl leading-relaxed hidden md:block">
              Manage your personal information, security settings, and active sessions here.
            </p>
          </div>
          <div className="flex flex-col items-center md:ml-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 flex flex-col items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 shadow-lg mb-2 animate-scale-in">
                <Avatar className="h-24 w-24 md:h-28 md:w-28">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={userData.userName} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-purple-700 text-white text-3xl font-bold">
                    {userData.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-white text-center text-lg font-semibold mb-1">{userData.userName}</p>
              <p className="text-purple-200 text-xs text-center mb-2">{userData.email}</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-purple-100">
                <span className="bg-white/20 px-3 py-1 rounded-full">Joined: {userData.joinDate}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Last Login: {userData.lastLogin}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row (Dashboard style, placeholder values) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="bg-green-100 p-2 rounded-xl">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+5% this month</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-xl">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">No suspicious activity</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Edits</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-xl">
              <Plus className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">Keep your info updated</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Security Level</p>
              <p className="text-2xl font-bold text-gray-900">High</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-xl">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">2FA coming soon</p>
        </div>
      </div>



      {/* Profile Tabs in a glassmorphism card */}
      <Card className="bg-white/80 shadow-card border border-white/60 rounded-2xl animate-fade-in">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4 w-full flex justify-center bg-white/80 shadow-card rounded-xl">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="sessions" onClick={fetchSessions}>Sessions</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField("Full Name", editData.userName, "userName", "text", "Enter your full name")}
                {renderField("Email Address", editData.email, "email", "email", "Enter your email")}
                {renderField("Contact Number", editData.contactNo, "contactNo", "tel", "Enter phone number")}
                {renderField("Date of Birth", editData.dob, "dob", "date")}
                {renderField("Address", editData.address, "address", "text", "Enter your address")}
                {renderField("City", editData.city, "city", "text", "Enter your city")}
                {renderField("State", editData.state, "state", "text", "Enter your state")}
                {renderField("Pincode", editData.pincode, "pincode", "text", "Enter your pincode")}
                {/* Show employee_id, joining_date, and role as read-only fields */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{userData.employee_id || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Joining Date</Label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{userData.joining_date ? new Date(userData.joining_date).toLocaleDateString() : "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Role</Label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">{userData.role}</p>
                </div>
              </div>

              <div className="flex gap-5 mt-4 justify-end">
                {/* Back to Home Button */}
                <div className="flex justify-start">
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Home</span>
                  </Button>
                </div>
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={loading} className="bg-gradient-to-r from-green-500 to-green-700 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" disabled={loading}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (

                  <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

            </CardContent>
          </TabsContent>
          <TabsContent value="security">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Password</Label>
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-2">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setPasswordLoading(true);
                      setPasswordError("");
                      setPasswordSuccess(false);
                      if (!password || !confirmPassword) {
                        setPasswordError("Please fill in all fields.");
                        setPasswordLoading(false);
                        return;
                      }
                      if (password !== confirmPassword) {
                        setPasswordError("Passwords do not match.");
                        setPasswordLoading(false);
                        return;
                      }
                      if (password.length < 6) {
                        setPasswordError("Password must be at least 6 characters long.");
                        setPasswordLoading(false);
                        return;
                      }
                      try {
                        // @ts-ignore
                        const { error } = await window.supabase.auth.updateUser({ password });
                        if (error) {
                          setPasswordError(error.message || "Failed to change password.");
                        } else {
                          setPasswordSuccess(true);
                          setPassword("");
                          setConfirmPassword("");
                        }
                      } catch (err) {
                        setPasswordError("An unexpected error occurred.");
                      }
                      setPasswordLoading(false);
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        disabled={passwordLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        disabled={passwordLoading}
                        required
                      />
                    </div>
                    {passwordError && <div className="text-red-600 text-sm mt-2">{passwordError}</div>}
                    {passwordSuccess && <div className="text-green-600 text-sm mt-2">Password changed successfully!</div>}
                    <DialogFooter className="mt-4">
                      <Button type="submit" disabled={passwordLoading} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
                        {passwordLoading ? "Changing..." : "Change Password"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Separator className="my-4" />
              <Label>Two-Factor Authentication</Label>
              <Button variant="outline" className="w-full mt-2" disabled>
                Enable 2FA (Coming Soon)
              </Button>
            </CardContent>
          </TabsContent>
          <TabsContent value="sessions">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {sessionLoading ? (
                <div>Loading sessions...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device/Browser</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No active sessions found.</TableCell>
                      </TableRow>
                    ) : (
                      sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{session.user_agent || "Unknown"}</TableCell>
                          <TableCell>{session.ip || "-"}</TableCell>
                          <TableCell>{session.created_at ? new Date(session.created_at).toLocaleString() : "-"}</TableCell>
                          <TableCell>{session.updated_at ? new Date(session.updated_at).toLocaleString() : "-"}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async () => {
                                // @ts-ignore
                                await window.supabase.from('sessions').delete().eq('id', session.id);
                                fetchSessions();
                              }}
                            >
                              Revoke
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserDetails; 