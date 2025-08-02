import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
    XCircle,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    AlertTriangle
} from "lucide-react";

interface UserProfile {
    id: string;
    user_name: string;
    email: string;
    contact_no: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    dob: string;
    role: 'admin' | 'manager' | 'employee' | 'supervisor';

    // Approval System (Separate from status)
    approval_status: 'pending' | 'approved' | 'rejected';

    // Status Management System (Separate from approval)
    status: 'active' | 'hold' | 'suspend';

    // Status Reason for rejection, hold, or suspend
    status_reason?: string;

    employee_id?: string;
    joining_date?: string;
    hold_days?: number;
    hold_start_date?: string;
    created_at: string;
}

const SuspendedUser = () => {
    const { user, signOut, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUserProfile = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                setError("Failed to fetch profile data.");
            } else if (data) {
                setProfile(data);
            }
        } catch (error) {
            setError("An error occurred while fetching profile data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (!user && !authLoading) {
            navigate("/login");
            return;
        }

        if (user) {
            fetchUserProfile();

            // Set up real-time subscription for profile updates
            const channel = supabase
                .channel('profile_updates')
                .on('postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'user_profiles',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        setProfile(payload.new as UserProfile);

                        // If status changes from suspend, redirect appropriately
                        if (payload.new.status === 'active') {
                            navigate("/");
                        } else if (payload.new.status === 'approved') {
                            navigate("/");
                        } else if (payload.new.status === 'hold') {
                            navigate("/approval-pending");
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user, authLoading, navigate]);

    const handleBackToLogin = async () => {
        try {
            await signOut();
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
            navigate("/login");
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return "bg-red-50 text-red-700 border-red-100";
            case 'manager':
                return "bg-blue-50 text-blue-700 border-blue-100";
            case 'supervisor':
                return "bg-purple-50 text-purple-700 border-purple-100";
            default:
                return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'manager':
                return 'Manager';
            case 'supervisor':
                return 'Supervisor';
            case 'employee':
                return 'Employee';
            default:
                return role;
        }
    };

    // Show loading spinner while auth is loading or profile is being fetched
    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your account status...</p>
                </div>
            </div>
        );
    }

    // If no user after loading, show error
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Session Expired</h2>
                    <p className="text-gray-600 mb-4">Please log in again to view your account status.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600 mb-4">Please complete your profile first.</p>
                    <button
                        onClick={() => navigate("/profile-completion")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                    >
                        Complete Profile
                    </button>
                </div>
            </div>
        );
    }

    // If user is not suspended, redirect to appropriate page
    if (profile.status !== 'suspend') {
        if (profile.status === 'active' || profile.status === 'approved') {
            navigate("/");
            return null;
        } else if (profile.status === 'hold') {
            navigate("/approval-pending");
            return null;
        } else {
            navigate("/approval-pending");
            return null;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
            <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Account Suspended</h2>
                    <p className="text-gray-600 text-center max-w-md">
                        Your account has been suspended indefinitely. Please contact support for assistance.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="font-medium">Account Suspended</span>
                    </div>

                    {profile.status === 'suspend' && (
                        <div className="space-y-2 text-sm">
                            <p>• Your account has been suspended indefinitely</p>
                            <p>• Please contact support for assistance</p>
                            <p>• You cannot access the system until suspension is lifted</p>
                            {profile.status_reason && (
                                <>
                                    <p><strong>Reason for suspension:</strong></p>
                                    <div className="bg-white p-3 rounded border border-red-200">
                                        <p className="text-red-800">{profile.status_reason}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">Name:</span>
                                <span className="text-sm text-gray-600">{profile.user_name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">Email:</span>
                                <span className="text-sm text-gray-600">{profile.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">Role:</span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                                    {getRoleLabel(profile.role)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">Phone:</span>
                                <span className="text-sm text-gray-600">{profile.contact_no}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">Location:</span>
                                <span className="text-sm text-gray-600">{profile.city}, {profile.state}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">DOB:</span>
                                <span className="text-sm text-gray-600">{new Date(profile.dob).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Pincode:</span>
                                <span className="text-sm text-gray-600">{profile.pincode}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <button
                        onClick={handleBackToLogin}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
                    >
                        Back to Login
                    </button>

                    <p className="text-gray-500 text-sm">
                        Your account has been suspended. Please contact support for assistance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuspendedUser; 