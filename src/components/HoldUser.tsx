import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    AlertCircle,
    CheckCircle,
    Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    hold_end_date?: string;
    created_at: string;
}

const HoldUser = () => {
    const { user, signOut, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [canActivate, setCanActivate] = useState(false);
    const [activating, setActivating] = useState(false);

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
                calculateTimeRemaining(data);
            }
        } catch (error) {
            setError("An error occurred while fetching profile data.");
        } finally {
            setLoading(false);
        }
    };

    const calculateTimeRemaining = (userProfile: UserProfile) => {
        if (!userProfile.hold_end_date) return;

        const now = new Date().getTime();
        const endDate = new Date(userProfile.hold_end_date).getTime();
        const remaining = endDate - now;

        if (remaining <= 0) {
            setTimeRemaining(0);
            setCanActivate(true);
        } else {
            setTimeRemaining(remaining);
            setCanActivate(false);
        }
    };

    const formatTimeRemaining = (milliseconds: number) => {
        if (milliseconds <= 0) return "00:00:00";

        const totalSeconds = Math.floor(milliseconds / 1000);
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = totalSeconds % 60;

        if (days > 0) {
            return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleActivateAccount = async () => {
        if (!user) return;

        setActivating(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    status: 'active',
                    hold_days: null,
                    hold_start_date: null,
                    hold_end_date: null,
                    status_reason: `Account activated by user on ${new Date().toLocaleString()}`
                })
                .eq('user_id', user.id);

            if (error) {
                setError("Failed to activate account.");
            } else {
                console.log("Account activated successfully, updating local state");

                // Update local state immediately
                setProfile(prev => prev ? {
                    ...prev,
                    status: 'active',
                    hold_days: null,
                    hold_start_date: null,
                    hold_end_date: null,
                    status_reason: `Account activated by user on ${new Date().toLocaleString()}`
                } : null);

                console.log("Local state updated, redirecting to dashboard in 500ms");

                // Clear the last redirect path to prevent AuthGuard from redirecting back
                // Wait a moment for the update to propagate, then redirect
                setTimeout(() => {
                    console.log("Redirecting to dashboard now");
                    navigate("/", { replace: true });
                }, 500);
            }
        } catch (error) {
            setError("An error occurred while activating account.");
        } finally {
            setActivating(false);
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
                        console.log("Profile updated via real-time:", payload.new);
                        setProfile(payload.new as UserProfile);

                        // If status changes from hold, redirect appropriately
                        if (payload.new.status === 'active') {
                            console.log("Status changed to active, redirecting to dashboard");
                            navigate("/", { replace: true });
                        } else if (payload.new.status === 'approved') {
                            console.log("Status changed to approved, redirecting to dashboard");
                            navigate("/", { replace: true });
                        } else if (payload.new.status === 'rejected') {
                            console.log("Status changed to rejected, redirecting to rejection page");
                            navigate("/rejected", { replace: true });
                        } else if (payload.new.status === 'suspend') {
                            console.log("Status changed to suspend, redirecting to suspended page");
                            navigate("/suspended", { replace: true });
                        } else if (payload.new.status === 'hold' && payload.old.status === 'hold') {
                            // Hold status updated (e.g., hold extended or reason changed)
                            console.log("Hold status updated, refreshing page");
                            window.location.reload();
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user, authLoading, navigate]);

    // Countdown timer effect
    useEffect(() => {
        if (timeRemaining <= 0) return;

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                const newTime = prev - 1000;
                if (newTime <= 0) {
                    setCanActivate(true);
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeRemaining]);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
                    <Button onClick={handleBackToLogin}>Back to Login</Button>
                </div>
            </div>
        );
    }

    // If user is already active, redirect to dashboard
    if (profile.status === 'active') {
        console.log("User is already active, redirecting to dashboard");
        navigate("/", { replace: true });
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-8">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-10 h-10 text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Account On Hold</h1>
                    <p className="text-gray-600">Your account is temporarily suspended</p>
                </div>

                {/* Countdown Timer */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-orange-800 mb-2">
                            {canActivate ? "Hold Period Complete!" : "Time Remaining"}
                        </h3>
                        <div className="text-4xl font-mono font-bold text-orange-600 mb-2">
                            {formatTimeRemaining(timeRemaining)}
                        </div>
                        {canActivate ? (
                            <p className="text-orange-700 text-sm">
                                You can now activate your account
                            </p>
                        ) : (
                            <p className="text-orange-700 text-sm">
                                Your account will be available after this time
                            </p>
                        )}
                    </div>
                </div>

                {/* Activation Button */}
                {canActivate && (
                    <div className="mb-6">
                        <Button
                            onClick={handleActivateAccount}
                            disabled={activating}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                        >
                            {activating ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Activating...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Play className="w-5 h-5" />
                                    <span>Activate Account</span>
                                </div>
                            )}
                        </Button>
                    </div>
                )}

                {/* Profile Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-base text-gray-500">Name</p>
                                <p className="font-medium">{profile.user_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-base text-gray-500">Email</p>
                                <p className="font-medium">{profile.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-base text-gray-500">Contact</p>
                                <p className="font-medium">{profile.contact_no}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-base text-gray-500">Location</p>
                                <p className="font-medium">{profile.city}, {profile.state}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-base text-gray-500">Role</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                                    {getRoleLabel(profile.role)}
                                </span>
                            </div>
                        </div>
                        {profile.employee_id && (
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-base text-gray-500">Employee ID</p>
                                    <p className="font-medium">{profile.employee_id}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hold Details */}
                {profile.status_reason && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Hold Reason</h3>
                        <p className="text-yellow-700">{profile.status_reason}</p>
                    </div>
                )}

                {/* Hold Period Details */}
                {profile.hold_start_date && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Hold Period Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                            <div>
                                <p className="text-blue-600">Start Date:</p>
                                <p className="font-medium">{new Date(profile.hold_start_date).toLocaleString()}</p>
                            </div>
                            {profile.hold_end_date && (
                                <div>
                                    <p className="text-blue-600">End Date:</p>
                                    <p className="font-medium">{new Date(profile.hold_end_date).toLocaleString()}</p>
                                </div>
                            )}
                            {profile.hold_days && (
                                <div>
                                    <p className="text-blue-600">Duration:</p>
                                    <p className="font-medium">{profile.hold_days} day(s)</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center">
                    <Button
                        onClick={handleBackToLogin}
                        variant="outline"
                        className="bg-white hover:bg-gray-50"
                    >
                        Back to Login
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default HoldUser; 