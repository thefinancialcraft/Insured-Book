import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle,
    XCircle,
    Clock,
    User,
    Mail,
    Phone,
    Calendar,
    Eye,
    Briefcase,
    Crown,
    LogOut,
    Settings,
    History,
    AlertTriangle,
    Play,
    Pause,
    Trash2,
    Users,
    TrendingUp,
    TrendingDown,
    Activity,
    Shield,
    Bell,
    Search,
    Filter,
    RefreshCw,
    BarChart3,
    PieChart,
    FileText,
    MoreHorizontal,
    MapPin,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface UserProfile {
    id: string;
    user_id: string;
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

interface UserActivityLog {
    id: string;
    user_id: string;
    admin_user_id?: string;
    action_type: string;
    previous_status?: string;
    new_status?: string;
    previous_role?: string;
    new_role?: string;
    reason?: string;
    hold_days?: number;
    hold_start_date?: string;
    hold_end_date?: string;
    admin_comment?: string;
    created_at: string;
}

const AdminPanel = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState<UserProfile | null>(null);
    const [reason, setReason] = useState("");
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [actionType, setActionType] = useState<'reject' | 'hold' | 'suspend' | null>(null);
    const [targetUserId, setTargetUserId] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [userToUpdateRole, setUserToUpdateRole] = useState<UserProfile | null>(null);

    // Hold options state
    const [holdOption, setHoldOption] = useState<'1' | '2' | '3' | 'custom'>('1');

    // Notification state for new user registrations
    const [notifications, setNotifications] = useState<Array<{
        id: string;
        message: string;
        type: 'new_user' | 'user_updated';
        timestamp: Date;
        userData?: UserProfile;
    }>>([]);

    // Sound notification state
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Track newly registered users for highlighting
    const [newUserIds, setNewUserIds] = useState<Set<string>>(new Set());

    // Track last refresh time
    const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
    const [customHoldDate, setCustomHoldDate] = useState<Date | undefined>(undefined);
    const [customHoldTime, setCustomHoldTime] = useState("");

    // Logs state
    const [showLogsModal, setShowLogsModal] = useState(false);
    const [selectedUserLogs, setSelectedUserLogs] = useState<UserActivityLog[]>([]);
    const [logsLoading, setLogsLoading] = useState(false);

    // Delete user state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
    const [deleteReason, setDeleteReason] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [roleFilter, setRoleFilter] = useState<string>("all");

    useEffect(() => {
        fetchUsers();
        fetchCurrentAdmin();

        // Test database connection and schema
        testDatabaseConnection();

        // Set up real-time subscription for new user registrations
        const channel = supabase
            .channel('admin_user_updates')
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'user_profiles'
                },
                (payload) => {
                    console.log('New user registered:', payload.new);
                    const newUser = payload.new as UserProfile;

                    // Add the new user to the list
                    setUsers(prevUsers => [newUser, ...prevUsers]);

                    // Add notification for new user
                    const notification = {
                        id: Date.now().toString(),
                        message: `New user ${newUser.user_name} has registered and needs approval`,
                        type: 'new_user' as const,
                        timestamp: new Date(),
                        userData: newUser
                    };

                    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only last 5 notifications
                    setError(""); // Clear any existing errors

                    // Play notification sound for new user registrations
                    playNotificationSound();

                    // Highlight the new user in the table
                    setNewUserIds(prev => new Set([...prev, newUser.id]));

                    // Remove highlight after 10 seconds
                    setTimeout(() => {
                        setNewUserIds(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(newUser.id);
                            return newSet;
                        });
                    }, 10000);
                }
            )
            .on('postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'user_profiles'
                },
                (payload) => {
                    console.log('User profile updated:', payload.new);
                    // Update the user in the list
                    setUsers(prevUsers =>
                        prevUsers.map(user =>
                            user.id === payload.new.id ? payload.new as UserProfile : user
                        )
                    );
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Periodic refresh every 30 seconds to ensure data is up-to-date
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUsers();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    const testDatabaseConnection = async () => {
        try {
            console.log("Testing database connection...");

            // Test basic query
            const { data, error } = await supabase
                .from('user_profiles')
                .select('user_id, user_name, email, role, status, approval_status')
                .limit(1);

            if (error) {
                console.error("Database connection test failed:", error);
            } else {
                console.log("Database connection successful, sample data:", data);
            }
        } catch (error) {
            console.error("Database test error:", error);
        }
    };

    const fetchCurrentAdmin = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (data && !error) {
                setCurrentAdmin(data);
            }
        } catch (error) {
            console.error("Error fetching current admin:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                setError("Failed to fetch users.");
            } else {
                setUsers(data || []);
                setLastRefreshTime(new Date());
            }
        } catch (error) {
            setError("An error occurred while fetching users.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserLogs = async (userId: string) => {
        setLogsLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_activity_logs')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching logs:", error);
            } else {
                setSelectedUserLogs(data || []);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLogsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const approveUser = async (userId: string) => {
        try {
            console.log("Approving user:", userId);

            // Admin tracking is now handled automatically by database trigger using auth.uid()

            const { error } = await supabase
                .from('user_profiles')
                .update({
                    approval_status: 'approved',
                    status: 'active',
                    employee_id: `EMP${Date.now()}`,
                    joining_date: new Date().toISOString().split('T')[0]
                })
                .eq('user_id', userId);

            if (error) {
                console.error("Supabase error:", error);
                setError(`Failed to approve user: ${error.message}`);
            } else {
                console.log("User approved successfully");
                // Note: Activity logging is handled automatically by database trigger
                setError("");
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error("Error in approveUser:", error);
            setError(`An error occurred while approving user: ${error.message}`);
        }
    };

    const rejectUser = async (userId: string) => {
        try {
            // Admin tracking is now handled automatically by database trigger using auth.uid()

            const { error } = await supabase
                .from('user_profiles')
                .update({
                    approval_status: 'rejected',
                    status_reason: reason
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to reject user.");
            } else {
                console.log("User rejected successfully");
                // Note: Activity logging is handled automatically by database trigger
                setError("");
                setReason("");
                setShowReasonModal(false);
                setActionType(null);
                setTargetUserId(null);
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            setError("An error occurred while rejecting user.");
        }
    };

    const holdUser = async (userId: string, days?: number, customEndDate?: string) => {
        try {
            // Admin tracking is now handled automatically by database trigger using auth.uid()

            let holdEndDate: string;
            let holdDays: number;

            if (customEndDate) {
                // Custom date/time selected
                holdEndDate = customEndDate;
                const startDate = new Date();
                const endDate = new Date(customEndDate);
                holdDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            } else {
                // Predefined days (1, 2, 3)
                holdDays = days || 1;
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + holdDays);
                holdEndDate = endDate.toISOString();
            }

            const { error } = await supabase
                .from('user_profiles')
                .update({
                    status: 'hold',
                    hold_days: holdDays,
                    hold_start_date: new Date().toISOString(),
                    hold_end_date: holdEndDate,
                    status_reason: reason
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to put user on hold.");
            } else {
                console.log("User put on hold successfully");
                // Note: Activity logging is handled automatically by database trigger
                setError("");
                setReason("");
                setShowReasonModal(false);
                setActionType(null);
                setTargetUserId(null);
                setHoldOption('1');
                setCustomHoldDate(undefined);
                setCustomHoldTime("");
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            setError("An error occurred while putting user on hold.");
        }
    };

    const suspendUser = async (userId: string) => {
        try {
            // Admin tracking is now handled automatically by database trigger using auth.uid()

            const { error } = await supabase
                .from('user_profiles')
                .update({
                    status: 'suspend',
                    // Reset hold-related fields when suspending
                    hold_days: null,
                    hold_start_date: null,
                    hold_end_date: null,
                    status_reason: reason
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to suspend user.");
            } else {
                console.log("User suspended successfully");
                // Note: Activity logging is handled automatically by database trigger
                setError("");
                setReason("");
                setShowReasonModal(false);
                setActionType(null);
                setTargetUserId(null);
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            setError("An error occurred while suspending user.");
        }
    };

    const activateUser = async (userId: string) => {
        try {
            // Admin tracking is now handled automatically by database trigger using auth.uid()

            const { error } = await supabase
                .from('user_profiles')
                .update({
                    status: 'active',
                    // Reset all hold-related fields when activating
                    hold_days: null,
                    hold_start_date: null,
                    hold_end_date: null,
                    status_reason: `Status activated by admin on ${new Date().toLocaleString()}`
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to activate user.");
            } else {
                console.log("User activated successfully");
                // Note: Activity logging is handled automatically by database trigger
                setError("");
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            setError("An error occurred while activating user.");
        }
    };

    const updateUserRole = async (userId: string, newRole: string) => {
        try {
            // Admin tracking is now handled automatically by database trigger using auth.uid()

            const { error } = await supabase
                .from('user_profiles')
                .update({
                    role: newRole
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to update user role.");
            } else {
                console.log("User role updated successfully");
                // Note: Activity logging is handled automatically by database trigger
                setError("");
                fetchUsers(); // Refresh the list
                setShowRoleModal(false);
                setUserToUpdateRole(null);
                setSelectedRole("");
            }
        } catch (error) {
            setError("An error occurred while updating user role.");
        }
    };

    const deleteUser = async (userId: string, userEmail: string) => {
        setDeleting(true);
        try {
            console.log("Deleting user:", userId);
            console.log("User email:", userEmail);
            console.log("Admin user ID:", user?.id);
            console.log("Delete reason:", deleteReason);

            // First, let's check what user we're trying to delete
            const userToDelete = users.find(u => u.user_id === userId);
            if (userToDelete) {
                console.log("User to delete details:", {
                    user_id: userToDelete.user_id,
                    user_name: userToDelete.user_name,
                    email: userToDelete.email,
                    role: userToDelete.role,
                    status: userToDelete.status
                });
            }

            // Use the SQL function to delete both profile and auth entry together
            const { data, error } = await supabase.rpc('delete_user_with_auth', {
                p_user_id: userId,
                p_admin_user_id: user?.id || null,
                p_delete_reason: deleteReason
            });

            if (error) {
                console.error("Error deleting user:", error);
                setError(`Failed to delete user: ${error.message}`);
                setDeleting(false);
                return;
            }

            if (!data) {
                console.error("User deletion failed - user may not exist or be the last admin");
                console.log("This could mean:");
                console.log("1. The user doesn't exist in the database");
                console.log("2. The user is the last admin user in the system");
                console.log("3. There's an issue with the SQL function");
                setError("Failed to delete user. User may not exist or be the last admin user.");
                setDeleting(false);
                return;
            }

            console.log("User deleted successfully");
            setError("");
            setShowDeleteModal(false);
            setUserToDelete(null);
            setDeleteReason("");
            fetchUsers(); // Refresh the list

            // Add notification for deleted user
            const notification = {
                id: Date.now().toString(),
                message: `User ${userEmail} has been deleted`,
                type: 'user_updated' as const,
                timestamp: new Date()
            };
            setNotifications(prev => [notification, ...prev.slice(0, 4)]);

        } catch (error) {
            console.error("Error in deleteUser:", error);
            setError(`An error occurred while deleting user: ${error.message}`);
        } finally {
            setDeleting(false);
        }
    };

    const openDeleteModal = (user: UserProfile) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const openRoleModal = (user: UserProfile) => {
        setUserToUpdateRole(user);
        setSelectedRole(user.role);
        setShowRoleModal(true);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'hold':
                return <Clock className="w-4 h-4 text-orange-500" />;
            case 'suspend':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getApprovalIcon = (approvalStatus: string) => {
        switch (approvalStatus) {
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return "bg-green-50 text-green-700 border-green-100";
            case 'hold':
                return "bg-orange-50 text-orange-700 border-orange-100";
            case 'suspend':
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-yellow-50 text-yellow-700 border-yellow-100";
        }
    };

    const getApprovalColor = (approvalStatus: string) => {
        switch (approvalStatus) {
            case 'approved':
                return "bg-green-50 text-green-700 border-green-100";
            case 'rejected':
                return "bg-red-50 text-red-700 border-red-100";
            default:
                return "bg-yellow-50 text-yellow-700 border-yellow-100";
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

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Crown className="w-3 h-3" />;
            default:
                return <Briefcase className="w-3 h-3" />;
        }
    };

    const handleActionWithReason = (action: 'reject' | 'hold' | 'suspend', userId: string) => {
        setActionType(action);
        setTargetUserId(userId);
        setShowReasonModal(true);
    };

    const handleConfirmAction = () => {
        if (!targetUserId || !actionType) return;

        switch (actionType) {
            case 'reject':
                rejectUser(targetUserId);
                break;
            case 'hold':
                if (holdOption === 'custom' && customHoldDate && customHoldTime) {
                    // Create custom end date with time
                    const customDate = new Date(customHoldDate);
                    const [hours, minutes] = customHoldTime.split(':');
                    customDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    holdUser(targetUserId, undefined, customDate.toISOString());
                } else {
                    // Use predefined days
                    const days = parseInt(holdOption);
                    holdUser(targetUserId, days);
                }
                break;
            case 'suspend':
                suspendUser(targetUserId);
                break;
        }
    };

    const handleViewLogs = async (user: UserProfile) => {
        setSelectedUser(user);
        await fetchUserLogs(user.user_id);
        setShowLogsModal(true);
    };

    const getActionLabel = (actionType: string) => {
        switch (actionType) {
            case 'approval_requested':
                return 'Approval Requested';
            case 'approval_accepted':
                return 'Approval Accepted';
            case 'approval_rejected':
                return 'Approval Rejected';
            case 'activated':
                return 'Account Activated';
            case 'hold_applied':
                return 'Hold Applied';
            case 'hold_removed':
                return 'Hold Removed';
            case 'suspended':
                return 'Account Suspended';
            case 'unsuspended':
                return 'Account Unsuspended';
            case 'role_changed':
                return 'Role Changed';
            case 'profile_updated':
                return 'Profile Updated';
            default:
                return actionType;
        }
    };

    const getActionIcon = (actionType: string) => {
        switch (actionType) {
            case 'approval_requested':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'approval_accepted':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'approval_rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'activated':
                return <Play className="w-4 h-4 text-green-500" />;
            case 'hold_applied':
                return <Pause className="w-4 h-4 text-orange-500" />;
            case 'hold_removed':
                return <Play className="w-4 h-4 text-green-500" />;
            case 'suspended':
                return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'unsuspended':
                return <Play className="w-4 h-4 text-green-500" />;
            case 'role_changed':
                return <Briefcase className="w-4 h-4 text-blue-500" />;
            case 'profile_updated':
                return <User className="w-4 h-4 text-gray-500" />;
            default:
                return <User className="w-4 h-4 text-gray-500" />;
        }
    };

    const clearNotification = (notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const playNotificationSound = () => {
        if (soundEnabled) {
            try {
                // Create a simple notification sound using Web Audio API
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            } catch (error) {
                console.log('Could not play notification sound:', error);
            }
        }
    };

    // Calculate dashboard statistics
    const stats = {
        total: users.length,
        pending: users.filter(u => u.approval_status === 'pending').length,
        approved: users.filter(u => u.approval_status === 'approved').length,
        active: users.filter(u => u.status === 'active').length,
        hold: users.filter(u => u.status === 'hold').length,
        suspended: users.filter(u => u.status === 'suspend').length,
        admins: users.filter(u => u.role === 'admin').length,
        managers: users.filter(u => u.role === 'manager').length,
        supervisors: users.filter(u => u.role === 'supervisor').length,
        employees: users.filter(u => u.role === 'employee').length
    };

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.contact_no.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesStatus && matchesRole;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Compact Elegant Header with Glass Effect */}
            <div className="bg-white/90 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-3">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Crown className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Admin Dashboard
                                    </h1>
                                    <p className="text-xs text-gray-600 font-medium">
                                        {currentAdmin?.employee_id ? `ID: ${currentAdmin.employee_id}` : 'Manage users and roles'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Compact Admin Profile Section */}
                        <div className="flex items-center space-x-4">
                            {/* Sound Toggle with Animation */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${soundEnabled
                                    ? 'text-green-700 bg-green-100 hover:bg-green-200 shadow-sm'
                                    : 'text-gray-500 bg-gray-100 hover:bg-gray-200 shadow-sm'
                                    }`}
                            >
                                {soundEnabled ? (
                                    <CheckCircle className="w-3.5 h-3.5 animate-pulse" />
                                ) : (
                                    <XCircle className="w-3.5 h-3.5" />
                                )}
                                <span className="hidden sm:inline text-xs font-medium">Sound</span>
                            </Button>

                            <div className="text-right">
                                <div className="text-xs font-semibold text-gray-900">
                                    {currentAdmin?.user_name || user?.email}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Last login: {new Date().toLocaleDateString()}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                            </div>

                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-300 px-3 py-1.5 rounded-lg hover:bg-red-50 text-xs"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="font-medium">Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                {/* Elegant Dashboard Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-semibold text-blue-100 flex items-center gap-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Users className="w-5 h-5" />
                                </div>
                                Total Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold mb-2">{stats.total}</div>
                            <p className="text-blue-100 text-sm">All registered users</p>
                            <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                                <div className="bg-white h-1 rounded-full" style={{ width: `${Math.min((stats.total / 100) * 100, 100)}%` }}></div>
                            </div>
                        </CardContent>
                        <div className="absolute top-4 right-4 opacity-20">
                            <Users className="w-16 h-16" />
                        </div>
                    </Card>

                    <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-semibold text-orange-100 flex items-center gap-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Clock className="w-5 h-5" />
                                </div>
                                Pending Approval
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold mb-2">{stats.pending}</div>
                            <p className="text-orange-100 text-sm">Awaiting review</p>
                            <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                                <div className="bg-white h-1 rounded-full" style={{ width: `${Math.min((stats.pending / 50) * 100, 100)}%` }}></div>
                            </div>
                        </CardContent>
                        <div className="absolute top-4 right-4 opacity-20">
                            <Clock className="w-16 h-16" />
                        </div>
                    </Card>

                    <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-semibold text-green-100 flex items-center gap-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                Active Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold mb-2">{stats.active}</div>
                            <p className="text-green-100 text-sm">Currently active</p>
                            <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                                <div className="bg-white h-1 rounded-full" style={{ width: `${Math.min((stats.active / 100) * 100, 100)}%` }}></div>
                            </div>
                        </CardContent>
                        <div className="absolute top-4 right-4 opacity-20">
                            <CheckCircle className="w-16 h-16" />
                        </div>
                    </Card>

                    <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-semibold text-purple-100 flex items-center gap-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Shield className="w-5 h-5" />
                                </div>
                                Administrators
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold mb-2">{stats.admins}</div>
                            <p className="text-purple-100 text-sm">Admin users</p>
                            <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                                <div className="bg-white h-1 rounded-full" style={{ width: `${Math.min((stats.admins / 10) * 100, 100)}%` }}></div>
                            </div>
                        </CardContent>
                        <div className="absolute top-4 right-4 opacity-20">
                            <Shield className="w-16 h-16" />
                        </div>
                    </Card>
                </div>

                {/* Elegant Notifications Section */}
                {notifications.length > 0 && (
                    <Card className="mb-8 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-200 shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-transparent"></div>
                        <CardHeader className="relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold text-amber-800 flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-xl shadow-sm">
                                        <Bell className="w-6 h-6 text-amber-700" />
                                    </div>
                                    Recent Activity
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllNotifications}
                                    className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-xl transition-all duration-300"
                                >
                                    Clear All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="space-y-4">
                                {notifications.map((notification, index) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 rounded-xl border-l-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 ${notification.type === 'new_user'
                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 text-blue-800'
                                            : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 text-green-800'
                                            }`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${notification.type === 'new_user'
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-green-100 text-green-600'
                                                }`}>
                                                {notification.type === 'new_user' ? (
                                                    <User className="w-5 h-5" />
                                                ) : (
                                                    <CheckCircle className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{notification.message}</p>
                                                <p className="text-xs opacity-75 mt-1">
                                                    {notification.timestamp.toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => clearNotification(notification.id)}
                                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Elegant Main Content Tabs */}
                <Tabs defaultValue="users" className="space-y-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
                        <TabsList className="grid w-full h-full  grid-cols-3 bg-transparent">
                            <TabsTrigger
                                value="users"
                                className="flex items-center gap-3 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                            >
                                <Users className="w-5 h-5" />
                                <span className="font-semibold">User Management</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="analytics"
                                className="flex items-center gap-3 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                            >
                                <BarChart3 className="w-5 h-5" />
                                <span className="font-semibold">Analytics</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="activity"
                                className="flex items-center gap-3 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                            >
                                <Activity className="w-5 h-5" />
                                <span className="font-semibold">Activity Logs</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="users" className="space-y-6">
                        {/* Enhanced Search and Filter Controls */}
                        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            User Applications
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 font-medium">
                                            {stats.pending} pending, {stats.approved} approved
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={fetchUsers}
                                            className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200 shadow-sm rounded-xl"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Refresh
                                        </Button>
                                        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            Last updated: {lastRefreshTime.toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Enhanced Search and Filter Bar */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                placeholder="Search users by name, email, or phone..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-12 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 bg-white shadow-sm"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="hold">Hold</option>
                                            <option value="suspend">Suspended</option>
                                        </select>
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 bg-white shadow-sm"
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="admin">Admin</option>
                                            <option value="manager">Manager</option>
                                            <option value="supervisor">Supervisor</option>
                                            <option value="employee">Employee</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Redesigned Users Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredUsers.map((user) => (
                                        <Card
                                            key={user.id}
                                            className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl ${newUserIds.has(user.id)
                                                ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-300 animate-pulse'
                                                : 'bg-white/95 backdrop-blur-sm border-gray-200 hover:border-indigo-200'
                                                }`}
                                        >
                                            {/* Card Header with Gradient Background */}
                                            <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 p-6 pb-4">
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-purple-100/20"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                                                            <div className="relative">
                                                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                                                    <User className="h-8 w-8 text-white" />
                                                                </div>
                                                                {newUserIds.has(user.id) && (
                                                                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="text-lg font-bold text-gray-900 truncate">
                                                                        {user.user_name}
                                                                    </h3>
                                                                    {newUserIds.has(user.id) && (
                                                                        <Badge className="bg-blue-500 text-white animate-pulse shadow-md text-xs font-bold flex-shrink-0">
                                                                            NEW
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 font-medium truncate">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end space-y-2 min-w-0">
                                                            <Badge className={`${getRoleColor(user.role)} text-xs font-bold px-2 py-1 truncate max-w-full`}>
                                                                {getRoleIcon(user.role)}
                                                                <span className="ml-1 truncate">{getRoleLabel(user.role)}</span>
                                                            </Badge>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openRoleModal(user)}
                                                                className="text-xs text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-all duration-300 whitespace-nowrap"
                                                            >
                                                                Change Role
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <CardContent className="p-6 pt-4">
                                                {/* Contact & Location Section */}
                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="bg-gray-50 p-3 rounded-xl">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Phone className="w-4 h-4 text-gray-500" />
                                                            <p className="text-xs text-gray-500 font-semibold">Contact</p>
                                                        </div>
                                                        <p className="text-sm text-gray-900 font-bold">{user.contact_no}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-xl">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <MapPin className="w-4 h-4 text-gray-500" />
                                                            <p className="text-xs text-gray-500 font-semibold">Location</p>
                                                        </div>
                                                        <p className="text-sm text-gray-900 font-bold">{user.city}, {user.state}</p>
                                                    </div>
                                                </div>

                                                {/* Status Information */}
                                                <div className="space-y-4 mb-6">
                                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                            <span className="text-xs text-gray-600 font-semibold">Approval</span>
                                                        </div>
                                                        <Badge className={`${getApprovalColor(user.approval_status)} text-xs font-bold px-3 py-1`}>
                                                            {getApprovalIcon(user.approval_status)}
                                                            <span className="ml-1">{user.approval_status}</span>
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                                        <div className="flex items-center gap-2">
                                                            <Activity className="w-4 h-4 text-blue-600" />
                                                            <span className="text-xs text-gray-600 font-semibold">Status</span>
                                                        </div>
                                                        <Badge className={`${getStatusColor(user.status)} text-xs font-bold px-3 py-1`}>
                                                            {getStatusIcon(user.status)}
                                                            <span className="ml-1">{user.status}</span>
                                                        </Badge>
                                                    </div>
                                                    {user.employee_id && (
                                                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                                            <div className="flex items-center gap-2">
                                                                <Shield className="w-4 h-4 text-purple-600" />
                                                                <span className="text-xs text-gray-600 font-semibold">Employee ID</span>
                                                            </div>
                                                            <span className="text-xs text-gray-700 font-bold">{user.employee_id}</span>
                                                        </div>
                                                    )}
                                                    {user.status === 'hold' && user.hold_days && user.hold_start_date && (
                                                        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Clock className="w-4 h-4 text-orange-600" />
                                                                <p className="text-xs text-orange-700 font-bold">Hold Information</p>
                                                            </div>
                                                            <p className="text-xs text-orange-700 font-medium">
                                                                Hold: {user.hold_days} day(s) - Started: {new Date(user.hold_start_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Applied Date */}
                                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl mb-6">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-500" />
                                                        <span className="text-xs text-gray-600 font-semibold">Applied</span>
                                                    </div>
                                                    <span className="text-xs text-gray-700 font-bold">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {/* Enhanced Action Buttons */}
                                                <div className="space-y-3">
                                                    {/* Primary Actions */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setShowDetails(true);
                                                            }}
                                                            className="flex-1 bg-white hover:bg-indigo-50 border-indigo-200 hover:border-indigo-300 text-indigo-700 hover:text-indigo-800 text-xs font-semibold py-2 rounded-lg transition-all duration-300"
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Details
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewLogs(user)}
                                                            className="flex-1 bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 text-xs font-semibold py-2 rounded-lg transition-all duration-300"
                                                        >
                                                            <History className="w-4 h-4 mr-2" />
                                                            Activity Logs
                                                        </Button>
                                                    </div>

                                                    {/* Status Management Actions */}
                                                    {user.approval_status === 'pending' && (
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => approveUser(user.user_id)}
                                                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs font-bold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleActionWithReason('reject', user.user_id)}
                                                                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xs font-bold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {user.approval_status === 'approved' && user.status === 'active' && (
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleActionWithReason('hold', user.user_id)}
                                                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                                            >
                                                                <Clock className="w-4 h-4 mr-2" />
                                                                Hold User
                                                            </Button>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleActionWithReason('suspend', user.user_id)}
                                                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Suspend
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {user.approval_status === 'approved' && user.status === 'hold' && (
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => activateUser(user.user_id)}
                                                                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Activate
                                                            </Button>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleActionWithReason('suspend', user.user_id)}
                                                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Suspend
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {user.approval_status === 'approved' && user.status === 'suspend' && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => activateUser(user.user_id)}
                                                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Activate User
                                                        </Button>
                                                    )}

                                                    {/* Delete Action */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openDeleteModal(user)}
                                                        className="w-full bg-white hover:bg-red-50 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 text-xs font-semibold py-2 rounded-lg transition-all duration-300"
                                                        title="Delete user permanently"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete User
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Enhanced Role Distribution */}
                            <Card className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-transparent"></div>
                                <CardHeader className="relative z-10">
                                    <CardTitle className="flex items-center gap-3 text-indigo-800">
                                        <div className="p-2 bg-indigo-100 rounded-xl shadow-sm">
                                            <PieChart className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        Role Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                                            <span className="text-sm font-semibold text-gray-700">Admins</span>
                                            <Badge className="bg-indigo-500 text-white shadow-md">{stats.admins}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                                            <span className="text-sm font-semibold text-gray-700">Managers</span>
                                            <Badge className="bg-purple-500 text-white shadow-md">{stats.managers}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                                            <span className="text-sm font-semibold text-gray-700">Supervisors</span>
                                            <Badge className="bg-pink-500 text-white shadow-md">{stats.supervisors}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                                            <span className="text-sm font-semibold text-gray-700">Employees</span>
                                            <Badge className="bg-blue-500 text-white shadow-md">{stats.employees}</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Enhanced Status Overview */}
                            <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-transparent"></div>
                                <CardHeader className="relative z-10">
                                    <CardTitle className="flex items-center gap-3 text-emerald-800">
                                        <div className="p-2 bg-emerald-100 rounded-xl shadow-sm">
                                            <BarChart3 className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        Status Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                                            <span className="text-sm font-semibold text-gray-700">Active</span>
                                            <Badge className="bg-emerald-500 text-white shadow-md">{stats.active}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                                            <span className="text-sm font-semibold text-gray-700">On Hold</span>
                                            <Badge className="bg-amber-500 text-white shadow-md">{stats.hold}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                                            <span className="text-sm font-semibold text-gray-700">Suspended</span>
                                            <Badge className="bg-red-500 text-white shadow-md">{stats.suspended}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                                            <span className="text-sm font-semibold text-gray-700">Pending</span>
                                            <Badge className="bg-yellow-500 text-white shadow-md">{stats.pending}</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Enhanced Quick Actions */}
                            <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-transparent"></div>
                                <CardHeader className="relative z-10">
                                    <CardTitle className="flex items-center gap-3 text-amber-800">
                                        <div className="p-2 bg-amber-100 rounded-xl shadow-sm">
                                            <Activity className="w-6 h-6 text-amber-600" />
                                        </div>
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="space-y-4">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start bg-white/70 hover:bg-white border-amber-200 hover:border-amber-300 text-amber-700 hover:text-amber-800 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <Users className="w-5 h-5 mr-3" />
                                            <span className="font-semibold">View All Users</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start bg-white/70 hover:bg-white border-amber-200 hover:border-amber-300 text-amber-700 hover:text-amber-800 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                                            onClick={() => setStatusFilter("pending")}
                                        >
                                            <Clock className="w-5 h-5 mr-3" />
                                            <span className="font-semibold">Pending Approvals</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start bg-white/70 hover:bg-white border-amber-200 hover:border-amber-300 text-amber-700 hover:text-amber-800 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                                            onClick={() => setStatusFilter("hold")}
                                        >
                                            <Pause className="w-5 h-5 mr-3" />
                                            <span className="font-semibold">Users on Hold</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-8">
                        <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-50 border-0 shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-100/20 to-transparent"></div>
                            <CardHeader className="relative z-10 bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-xl">
                                <CardTitle className="flex items-center gap-3 text-slate-800">
                                    <div className="p-2 bg-slate-100 rounded-xl shadow-sm">
                                        <FileText className="w-6 h-6 text-slate-600" />
                                    </div>
                                    Recent Activity Logs
                                </CardTitle>
                                <CardDescription className="text-slate-600 font-medium">
                                    View recent user activity and system events
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 p-8">
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <Activity className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Activity Yet</h3>
                                    <p className="text-slate-500 max-w-md mx-auto">
                                        Activity logs will appear here when users perform actions. This helps you track all system events and user activities.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Redesigned User Details Modal */}
                {showDetails && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
                        <div className="relative top-10 mx-auto p-0 border-0 w-full max-w-2xl shadow-2xl rounded-2xl bg-white overflow-hidden">
                            {/* Header with Gradient */}
                            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                                <User className="h-8 w-8 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">User Details</h3>
                                                <p className="text-indigo-100 font-medium">{selectedUser.user_name}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowDetails(false)}
                                            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Personal Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <User className="w-5 h-5 text-indigo-600" />
                                            Personal Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="bg-gray-50 p-4 rounded-xl">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                                                <p className="text-lg font-bold text-gray-900 mt-1">{selectedUser.user_name}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedUser.email}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedUser.contact_no}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">{new Date(selectedUser.dob).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-purple-600" />
                                            Professional Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                                                <label className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Role</label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={`${getRoleColor(selectedUser.role)} text-sm font-bold px-3 py-1`}>
                                                        {getRoleIcon(selectedUser.role)}
                                                        <span className="ml-1">{getRoleLabel(selectedUser.role)}</span>
                                                    </Badge>
                                                </div>
                                            </div>
                                            {selectedUser.employee_id && (
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                                                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Employee ID</label>
                                                    <p className="text-lg font-bold text-blue-900 mt-1">{selectedUser.employee_id}</p>
                                                </div>
                                            )}
                                            {selectedUser.joining_date && (
                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                                                    <label className="text-xs font-semibold text-green-600 uppercase tracking-wide">Joining Date</label>
                                                    <p className="text-lg font-bold text-green-900 mt-1">{new Date(selectedUser.joining_date).toLocaleDateString()}</p>
                                                </div>
                                            )}
                                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                                                <label className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Account Created</label>
                                                <p className="text-lg font-bold text-amber-900 mt-1">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="mt-6">
                                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                        <MapPin className="w-5 h-5 text-green-600" />
                                        Address Information
                                    </h4>
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-green-600 uppercase tracking-wide">Full Address</label>
                                                <p className="text-lg font-semibold text-green-900 mt-1">{selectedUser.address}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-green-600 uppercase tracking-wide">Location</label>
                                                <p className="text-lg font-semibold text-green-900 mt-1">{selectedUser.city}, {selectedUser.state} - {selectedUser.pincode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Information */}
                                <div className="mt-6">
                                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                        Account Status
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                                            <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Approval Status</label>
                                            <div className="mt-1">
                                                <Badge className={`${getApprovalColor(selectedUser.approval_status)} text-sm font-bold px-3 py-1`}>
                                                    {getApprovalIcon(selectedUser.approval_status)}
                                                    <span className="ml-1">{selectedUser.approval_status}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                                            <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Account Status</label>
                                            <div className="mt-1">
                                                <Badge className={`${getStatusColor(selectedUser.status)} text-sm font-bold px-3 py-1`}>
                                                    {getStatusIcon(selectedUser.status)}
                                                    <span className="ml-1">{selectedUser.status}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <div className="mt-8 flex justify-end">
                                    <Button
                                        onClick={() => setShowDetails(false)}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Close Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Role Assignment Modal */}
                {showRoleModal && userToUpdateRole && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Role</h3>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Assign role for <strong>{userToUpdateRole.user_name}</strong>
                                    </p>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="supervisor">Supervisor</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowRoleModal(false);
                                            setUserToUpdateRole(null);
                                            setSelectedRole("");
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => updateUserRole(userToUpdateRole.user_id, selectedRole)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                                    >
                                        Update Role
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Reason Modal */}
                {showReasonModal && targetUserId && actionType && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    {actionType === 'hold' ? 'Hold User' : actionType === 'suspend' ? 'Suspend User' : 'Reject User'}
                                </h3>

                                {/* Hold Options - Only show for hold action */}
                                {actionType === 'hold' && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium text-gray-800 mb-3">Hold Duration</h4>
                                        <RadioGroup value={holdOption} onValueChange={(value) => setHoldOption(value as '1' | '2' | '3' | 'custom')}>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="1" id="hold-1" />
                                                    <Label htmlFor="hold-1" className="text-sm">1 Day</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="2" id="hold-2" />
                                                    <Label htmlFor="hold-2" className="text-sm">2 Days</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="3" id="hold-3" />
                                                    <Label htmlFor="hold-3" className="text-sm">3 Days</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="custom" id="hold-custom" />
                                                    <Label htmlFor="hold-custom" className="text-sm">Custom Date & Time</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>

                                        {/* Custom Date & Time Selection */}
                                        {holdOption === 'custom' && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm font-medium">Date</Label>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full justify-start text-left font-normal mt-1"
                                                                >
                                                                    {customHoldDate ? format(customHoldDate, "PPP") : "Pick a date"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0">
                                                                <CalendarComponent
                                                                    mode="single"
                                                                    selected={customHoldDate}
                                                                    onSelect={setCustomHoldDate}
                                                                    disabled={(date) => date < new Date()}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium">Time</Label>
                                                        <Input
                                                            type="time"
                                                            value={customHoldTime}
                                                            onChange={(e) => setCustomHoldTime(e.target.value)}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <Label className="text-sm font-medium text-gray-700 mb-2">
                                        Reason for {actionType === 'hold' ? 'hold' : actionType === 'suspend' ? 'suspension' : 'rejection'}
                                    </Label>
                                    <Textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={4}
                                        placeholder={`Enter reason for ${actionType}...`}
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowReasonModal(false);
                                            setReason("");
                                            setActionType(null);
                                            setTargetUserId(null);
                                            setHoldOption('1');
                                            setCustomHoldDate(undefined);
                                            setCustomHoldTime("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleConfirmAction}
                                        disabled={
                                            !reason.trim() ||
                                            (actionType === 'hold' && holdOption === 'custom' && (!customHoldDate || !customHoldTime))
                                        }
                                    >
                                        Confirm {actionType === 'hold' ? 'Hold' : actionType === 'suspend' ? 'Suspend' : 'Reject'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Redesigned User Activity Logs Modal */}
                {showLogsModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
                        <div className="relative top-10 mx-auto p-0 border-0 w-full max-w-4xl shadow-2xl rounded-2xl bg-white overflow-hidden">
                            {/* Header with Gradient */}
                            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-6 text-white">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                                <History className="h-8 w-8 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">Activity Logs</h3>
                                                <p className="text-purple-100 font-medium">{selectedUser.user_name}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowLogsModal(false);
                                                setSelectedUser(null);
                                                setSelectedUserLogs([]);
                                            }}
                                            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {logsLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-600 rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
                                        </div>
                                        <p className="text-gray-600 font-medium mt-4">Loading activity logs...</p>
                                    </div>
                                ) : selectedUserLogs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <History className="w-12 h-12 text-purple-400" />
                                        </div>
                                        <h4 className="text-xl font-semibold text-gray-900 mb-2">No Activity Logs</h4>
                                        <p className="text-gray-500 max-w-md mx-auto">
                                            No activity logs found for this user. Activity logs will appear here when actions are performed on this account.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Summary Stats */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <Activity className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Actions</p>
                                                        <p className="text-2xl font-bold text-blue-900">{selectedUserLogs.length}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <Clock className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Latest Activity</p>
                                                        <p className="text-sm font-bold text-green-900">
                                                            {selectedUserLogs.length > 0 ? new Date(selectedUserLogs[0].created_at).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-100 rounded-lg">
                                                        <User className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">User Status</p>
                                                        <p className="text-sm font-bold text-purple-900">{selectedUser.status}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activity Timeline */}
                                        <div className="max-h-96 overflow-y-auto space-y-4">
                                            {selectedUserLogs.map((log, index) => (
                                                <div key={log.id} className="relative">
                                                    {/* Timeline Connector */}
                                                    {index < selectedUserLogs.length - 1 && (
                                                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-purple-200 to-pink-200"></div>
                                                    )}

                                                    <div className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                                                        {/* Action Header */}
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="relative">
                                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-sm">
                                                                        {getActionIcon(log.action_type)}
                                                                    </div>
                                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-lg font-bold text-gray-900">
                                                                        {getActionLabel(log.action_type)}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-500 font-medium">
                                                                        {new Date(log.created_at).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1">
                                                                #{selectedUserLogs.length - index}
                                                            </Badge>
                                                        </div>

                                                        {/* Action Details */}
                                                        <div className="space-y-4">
                                                            {/* Status Changes */}
                                                            {log.previous_status && log.new_status && (
                                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Activity className="w-4 h-4 text-blue-600" />
                                                                        <span className="text-sm font-semibold text-blue-700">Status Change</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-3">
                                                                        <Badge className={`${getStatusColor(log.previous_status)} text-xs font-bold px-3 py-1`}>
                                                                            {log.previous_status}
                                                                        </Badge>
                                                                        <div className="flex items-center space-x-1">
                                                                            <div className="w-8 h-0.5 bg-gray-300"></div>
                                                                            <ArrowRight className="w-4 h-4 text-gray-400" />
                                                                            <div className="w-8 h-0.5 bg-gray-300"></div>
                                                                        </div>
                                                                        <Badge className={`${getStatusColor(log.new_status)} text-xs font-bold px-3 py-1`}>
                                                                            {log.new_status}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Role Changes */}
                                                            {log.previous_role && log.new_role && (
                                                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Shield className="w-4 h-4 text-purple-600" />
                                                                        <span className="text-sm font-semibold text-purple-700">Role Change</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-3">
                                                                        <Badge className={`${getRoleColor(log.previous_role)} text-xs font-bold px-3 py-1`}>
                                                                            {getRoleLabel(log.previous_role)}
                                                                        </Badge>
                                                                        <div className="flex items-center space-x-1">
                                                                            <div className="w-8 h-0.5 bg-gray-300"></div>
                                                                            <ArrowRight className="w-4 h-4 text-gray-400" />
                                                                            <div className="w-8 h-0.5 bg-gray-300"></div>
                                                                        </div>
                                                                        <Badge className={`${getRoleColor(log.new_role)} text-xs font-bold px-3 py-1`}>
                                                                            {getRoleLabel(log.new_role)}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Reason */}
                                                            {log.reason && (
                                                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                                                        <span className="text-sm font-semibold text-amber-700">Reason</span>
                                                                    </div>
                                                                    <p className="text-sm text-amber-800 font-medium">
                                                                        {log.reason}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Hold Information */}
                                                            {log.hold_days && (
                                                                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Clock className="w-4 h-4 text-orange-600" />
                                                                        <span className="text-sm font-semibold text-orange-700">Hold Duration</span>
                                                                    </div>
                                                                    <p className="text-sm text-orange-800 font-medium">
                                                                        {log.hold_days} day(s)
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Hold Period */}
                                                            {log.hold_start_date && log.hold_end_date && (
                                                                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Calendar className="w-4 h-4 text-red-600" />
                                                                        <span className="text-sm font-semibold text-red-700">Hold Period</span>
                                                                    </div>
                                                                    <div className="text-sm text-red-800 font-medium">
                                                                        <p>From: {new Date(log.hold_start_date).toLocaleString()}</p>
                                                                        <p>To: {new Date(log.hold_end_date).toLocaleString()}</p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Admin Comment */}
                                                            {log.admin_comment && (
                                                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <User className="w-4 h-4 text-indigo-600" />
                                                                        <span className="text-sm font-semibold text-indigo-700">Admin Comment</span>
                                                                    </div>
                                                                    <p className="text-sm text-indigo-800 font-medium">
                                                                        {log.admin_comment}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete User Confirmation Modal */}
                {showDeleteModal && userToDelete && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <Trash2 className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
                                        <p className="text-sm text-gray-500">
                                            This action cannot be undone
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="font-medium text-red-800 mb-2">Warning</h4>
                                    <p className="text-sm text-red-700">
                                        You are about to permanently delete <strong>{userToDelete.user_name}</strong> ({userToDelete.email}).
                                        This will:
                                    </p>
                                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                                        <li>• Remove all user profile data from the database</li>
                                        <li>• Delete the user account from authentication system</li>
                                        <li>• Remove all associated activity logs</li>
                                        <li>• This action cannot be reversed</li>
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <Label className="text-sm font-medium text-gray-700 mb-2">
                                        Reason for deletion (required)
                                    </Label>
                                    <Textarea
                                        value={deleteReason}
                                        onChange={(e) => setDeleteReason(e.target.value)}
                                        rows={3}
                                        placeholder="Enter reason for deleting this user..."
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setUserToDelete(null);
                                            setDeleteReason("");
                                        }}
                                        disabled={deleting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => deleteUser(userToDelete.user_id, userToDelete.email)}
                                        disabled={!deleteReason.trim() || deleting}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {deleting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete User Permanently
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel; 