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
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    const [customHoldDate, setCustomHoldDate] = useState<Date | undefined>(undefined);
    const [customHoldTime, setCustomHoldTime] = useState("");

    useEffect(() => {
        fetchUsers();
        fetchCurrentAdmin();
    }, []);

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
            }
        } catch (error) {
            setError("An error occurred while fetching users.");
        } finally {
            setLoading(false);
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
                setError("Failed to approve user.");
            } else {
                setError("");
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            setError("An error occurred while approving user.");
        }
    };

    const rejectUser = async (userId: string) => {
        try {
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
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    status: 'suspend',
                    status_reason: reason
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to suspend user.");
            } else {
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
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    status: 'active',
                    hold_days: null,
                    hold_start_date: null,
                    hold_end_date: null,
                    status_reason: `Status activated by admin on ${new Date().toLocaleString()}`
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to activate user.");
            } else {
                setError("");
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            setError("An error occurred while activating user.");
        }
    };

    const updateUserRole = async (userId: string, newRole: string) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    role: newRole
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to update user role.");
            } else {
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <Crown className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                                    <p className="text-sm text-gray-500">
                                        {currentAdmin?.employee_id ? `ID: ${currentAdmin.employee_id}` : 'Manage users and roles'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Admin Profile Section */}
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                    {currentAdmin?.user_name || user?.email}
                                </div>
                                <div className="text-xs text-gray-400">
                                    Last login: {new Date().toLocaleDateString()}
                                </div>
                            </div>

                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-indigo-600" />
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
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

                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">User Applications</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {users.filter(u => u.approval_status === 'pending').length} pending, {users.filter(u => u.approval_status === 'approved').length} approved
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Approval Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status Reason
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applied
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <User className="h-6 w-6 text-indigo-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.user_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                <span className="ml-1">{getRoleLabel(user.role)}</span>
                                            </span>
                                            <button
                                                onClick={() => openRoleModal(user)}
                                                className="block text-xs text-indigo-600 hover:text-indigo-900 mt-1"
                                            >
                                                Change Role
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.contact_no}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.city}, {user.state}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalColor(user.approval_status)}`}>
                                                {getApprovalIcon(user.approval_status)}
                                                <span className="ml-1">{user.approval_status}</span>
                                            </span>
                                            {user.employee_id && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    ID: {user.employee_id}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                {getStatusIcon(user.status)}
                                                <span className="ml-1">{user.status}</span>
                                            </span>
                                            {user.status === 'hold' && user.hold_days && user.hold_start_date && (
                                                <div className="text-xs text-orange-600 mt-1">
                                                    Hold: {user.hold_days} day(s) - Started: {new Date(user.hold_start_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.status_reason || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDetails(true);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </button>

                                                {/* Only show status management for specific statuses */}
                                                {user.approval_status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => approveUser(user.user_id)}
                                                            className="text-green-600 hover:text-green-900 flex items-center"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleActionWithReason('reject', user.user_id)}
                                                            className="text-red-600 hover:text-red-900 flex items-center"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {user.approval_status === 'approved' && user.status === 'active' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleActionWithReason('hold', user.user_id)}
                                                            className="text-orange-600 hover:text-orange-900 flex items-center"
                                                        >
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            Hold
                                                        </button>
                                                        <button
                                                            onClick={() => handleActionWithReason('suspend', user.user_id)}
                                                            className="text-red-800 hover:text-red-900 flex items-center"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Suspend
                                                        </button>
                                                    </>
                                                )}

                                                {user.approval_status === 'approved' && user.status === 'hold' && (
                                                    <>
                                                        <button
                                                            onClick={() => activateUser(user.user_id)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Activate
                                                        </button>
                                                        <button
                                                            onClick={() => handleActionWithReason('suspend', user.user_id)}
                                                            className="text-red-800 hover:text-red-900 flex items-center"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Suspend
                                                        </button>
                                                    </>
                                                )}

                                                {user.approval_status === 'approved' && user.status === 'suspend' && (
                                                    <button
                                                        onClick={() => activateUser(user.user_id)}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Activate
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Details Modal */}
                {showDetails && selectedUser && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Name</label>
                                        <p className="text-sm text-gray-900">{selectedUser.user_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="text-sm text-gray-900">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Role</label>
                                        <p className="text-sm text-gray-900">{getRoleLabel(selectedUser.role)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone</label>
                                        <p className="text-sm text-gray-900">{selectedUser.contact_no}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Address</label>
                                        <p className="text-sm text-gray-900">{selectedUser.address}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Location</label>
                                        <p className="text-sm text-gray-900">{selectedUser.city}, {selectedUser.state} - {selectedUser.pincode}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                        <p className="text-sm text-gray-900">{new Date(selectedUser.dob).toLocaleDateString()}</p>
                                    </div>
                                    {selectedUser.employee_id && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Employee ID</label>
                                            <p className="text-sm text-gray-900">{selectedUser.employee_id}</p>
                                        </div>
                                    )}
                                    {selectedUser.joining_date && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Joining Date</label>
                                            <p className="text-sm text-gray-900">{new Date(selectedUser.joining_date).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setShowDetails(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                                    >
                                        Close
                                    </button>
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
            </div>
        </div>
    );
};

export default AdminPanel; 