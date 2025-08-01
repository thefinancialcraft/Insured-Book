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
    status: 'pending' | 'approved' | 'rejected' | 'hold' | 'suspend' | 'active';
    employee_id?: string;
    joining_date?: string;
    hold_days?: number;
    hold_start_date?: string;
    created_at: string;
}

const AdminPanel = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [userToUpdateRole, setUserToUpdateRole] = useState<UserProfile | null>(null);
    const [currentAdmin, setCurrentAdmin] = useState<UserProfile | null>(null);

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
            console.error("Error signing out:", error);
            navigate("/login");
        }
    };

    const approveUser = async (userId: string) => {
        try {
            // Generate employee ID
            const employeeId = `EMP${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

            const { error } = await supabase
                .from('user_profiles')
                .update({
                    status: 'approved',
                    employee_id: employeeId,
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
                    status: 'rejected'
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to reject user.");
            } else {
                setError("");
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            setError("An error occurred while rejecting user.");
        }
    };

    const holdUser = async (userId: string, days: number) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    status: 'hold',
                    hold_days: days,
                    hold_start_date: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to put user on hold.");
            } else {
                setError("");
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
                    status: 'suspend'
                })
                .eq('user_id', userId);

            if (error) {
                setError("Failed to suspend user.");
            } else {
                setError("");
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
                    hold_start_date: null
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
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'hold':
                return <Clock className="w-4 h-4 text-orange-500" />;
            case 'suspend':
                return <XCircle className="w-4 h-4 text-red-600" />;
            case 'active':
                return <CheckCircle className="w-4 h-4 text-blue-500" />;
            default:
                return <Clock className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return "bg-green-50 text-green-700 border-green-100";
            case 'rejected':
                return "bg-red-50 text-red-700 border-red-100";
            case 'hold':
                return "bg-orange-50 text-orange-700 border-orange-100";
            case 'suspend':
                return "bg-red-100 text-red-800 border-red-200";
            case 'active':
                return "bg-blue-50 text-blue-700 border-blue-100";
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
                            {users.filter(u => u.status === 'pending').length} pending, {users.filter(u => u.status === 'approved').length} approved
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
                                        Status
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
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                {getStatusIcon(user.status)}
                                                <span className="ml-1">{user.status}</span>
                                            </span>
                                            {user.employee_id && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    ID: {user.employee_id}
                                                </div>
                                            )}
                                            {user.status === 'hold' && user.hold_days && user.hold_start_date && (
                                                <div className="text-xs text-orange-600 mt-1">
                                                    Hold: {user.hold_days} day(s) - Started: {new Date(user.hold_start_date).toLocaleDateString()}
                                                </div>
                                            )}
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
                                                {user.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => approveUser(user.user_id)}
                                                            className="text-green-600 hover:text-green-900 flex items-center"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => rejectUser(user.user_id)}
                                                            className="text-red-600 hover:text-red-900 flex items-center"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Reject
                                                        </button>
                                                        <button
                                                            onClick={() => holdUser(user.user_id, 1)}
                                                            className="text-orange-600 hover:text-orange-900 flex items-center"
                                                        >
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            Hold 1 Day
                                                        </button>
                                                        <button
                                                            onClick={() => holdUser(user.user_id, 2)}
                                                            className="text-orange-600 hover:text-orange-900 flex items-center"
                                                        >
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            Hold 2 Days
                                                        </button>
                                                        <button
                                                            onClick={() => holdUser(user.user_id, 3)}
                                                            className="text-orange-600 hover:text-orange-900 flex items-center"
                                                        >
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            Hold 3 Days
                                                        </button>
                                                        <button
                                                            onClick={() => suspendUser(user.user_id)}
                                                            className="text-red-800 hover:text-red-900 flex items-center"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Suspend
                                                        </button>
                                                    </>
                                                )}
                                                {user.status === 'hold' && (
                                                    <>
                                                        <button
                                                            onClick={() => activateUser(user.user_id)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Activate
                                                        </button>
                                                        <button
                                                            onClick={() => suspendUser(user.user_id)}
                                                            className="text-red-800 hover:text-red-900 flex items-center"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Suspend
                                                        </button>
                                                    </>
                                                )}
                                                {user.status === 'suspend' && (
                                                    <button
                                                        onClick={() => activateUser(user.user_id)}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Activate
                                                    </button>
                                                )}
                                                {user.status === 'active' && (
                                                    <>
                                                        <button
                                                            onClick={() => holdUser(user.user_id, 1)}
                                                            className="text-orange-600 hover:text-orange-900 flex items-center"
                                                        >
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            Hold 1 Day
                                                        </button>
                                                        <button
                                                            onClick={() => suspendUser(user.user_id)}
                                                            className="text-red-800 hover:text-red-900 flex items-center"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Suspend
                                                        </button>
                                                    </>
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
            </div>
        </div>
    );
};

export default AdminPanel; 