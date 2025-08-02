import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Phone,
  MessageCircle,
  Edit,
  Calendar,
  Car,
  AlertCircle,
  Gift,
  MoreVertical,
  Trash2,
  Eye,
  FileText,
  Bike,
  Bus,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CustomerDetails } from "./CustomerDetails";
import { WhatsAppTemplates } from "./WhatsAppTemplates";
import { CustomerRegistration } from "./CustomerRegistration";
import { toast } from "@/hooks/use-toast";

interface CustomerListProps {
  filter?: string;
}

export const CustomerList = ({ filter }: CustomerListProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsAppType, setWhatsAppType] = useState<'general' | 'birthday' | 'expiry' | 'sales' | 'festival'>('general');
  const [deleteCustomer, setDeleteCustomer] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      contact: "9876543210",
      email: "rajesh@email.com",
      vehicleType: "4-Wheeler",
      brand: "Maruti",
      model: "Swift",
      rcNumber: "DL-01-AB-1234",
      expiryDate: "2024-01-15",
      daysToExpiry: 3,
      birthday: "1985-03-15",
      status: "critical",
      aadharNo: "1234 5678 9012",
      panNo: "ABCDE1234F",
      nomineeName: "Sunita Kumar",
      nomineeDOB: "1987-05-20",
      nomineeRelation: "Wife",
      previousCompany: "HDFC ERGO"
    },
    {
      id: 2,
      name: "Priya Sharma",
      contact: "8765432109",
      email: "priya@email.com",
      vehicleType: "2-Wheeler",
      brand: "Honda",
      model: "Activa",
      rcNumber: "DL-02-CD-5678",
      expiryDate: "2024-02-20",
      daysToExpiry: 45,
      birthday: "1990-07-22",
      status: "active"
    },
    {
      id: 3,
      name: "Amit Singh",
      contact: "7654321098",
      email: "amit@email.com",
      vehicleType: "4-Wheeler",
      brand: "Hyundai",
      model: "Creta",
      rcNumber: "DL-03-EF-9012",
      expiryDate: "2024-01-22",
      daysToExpiry: 10,
      birthday: "1988-12-05",
      status: "warning"
    },
    {
      id: 4,
      name: "Sunita Gupta",
      contact: "6543210987",
      email: "sunita@email.com",
      vehicleType: "2-Wheeler",
      brand: "TVS",
      model: "Jupiter",
      rcNumber: "DL-04-GH-3456",
      expiryDate: "2024-06-15",
      daysToExpiry: 180,
      birthday: "1992-01-18",
      status: "active"
    },
    {
      id: 5,
      name: "Vikash Yadav",
      contact: "5432109876",
      email: "vikash@email.com",
      vehicleType: "Commercial",
      brand: "Tata",
      model: "Ace",
      rcNumber: "DL-05-IJ-7890",
      expiryDate: "2024-03-10",
      daysToExpiry: 65,
      birthday: "1987-09-30",
      status: "active"
    }
  ]);

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [customFilter, setCustomFilter] = useState<string | null>(null);

  // Event handlers
  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setShowEdit(true);
  };

  const handleDeleteCustomer = (customer: any) => {
    setDeleteCustomer(customer);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteCustomer) {
      setCustomers(customers.filter(c => c.id !== deleteCustomer.id));
      toast({
        title: "Customer Deleted",
        description: `${deleteCustomer.name} has been removed from the system.`,
      });
    }
    setShowDeleteDialog(false);
    setDeleteCustomer(null);
  };

  const handleWhatsApp = (customer: any, type: 'general' | 'birthday' | 'expiry' | 'sales' | 'festival' = 'general') => {
    setSelectedCustomer(customer);
    setWhatsAppType(type);
    setShowWhatsApp(true);
  };

  const handleCall = (contact: string, customer: any) => {
    // Redirect to call management page with customer ID
    navigate(`/call-management?customerId=${customer.id}`);
  };

  const updateCustomer = (updatedCustomer: any) => {
    setCustomers(customers.map(c =>
      c.id === updatedCustomer.id ? updatedCustomer : c
    ));
    toast({
      title: "Customer Updated",
      description: `${updatedCustomer.name}'s details have been updated.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'active': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isDaysToBirthday = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    const currentYear = today.getFullYear();
    const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

    if (nextBirthday < today) {
      nextBirthday.setFullYear(currentYear + 1);
    }

    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 7;
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.includes(searchTerm) ||
      customer.rcNumber.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter) {
      switch (filter) {
        case 'expiring':
          matchesFilter = customer.daysToExpiry <= 30;
          break;
        case 'birthday':
          const today = new Date();
          const birthday = new Date(customer.birthday);
          matchesFilter = birthday.getMonth() === today.getMonth();
          break;
        case 'active':
          matchesFilter = customer.status === 'active';
          break;
        case 'all':
        default:
          matchesFilter = true;
      }
    } else {
      if (filterBy === "all") matchesFilter = true;
      else if (filterBy === "expiring") matchesFilter = customer.daysToExpiry <= 30;
      else if (filterBy === "critical") matchesFilter = customer.status === "critical";
      else if (filterBy === "birthday") matchesFilter = isDaysToBirthday(customer.birthday);
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Modern Search and Filter Bar */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Enhanced Search Bar */}
            <div className="flex-1 relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                placeholder="Search customers by name, contact, or RC number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
              />
              {/* Filter Icon Button (Mobile Only) */}
              <div className="relative">
                <button
                  type="button"
                  className="md:hidden ml-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowMobileFilter(true)}
                  aria-label="Open filter options"
                >
                  <Filter className="h-5 w-5 text-blue-600" />
                </button>
                {/* Mobile Filter Popup/Modal (now absolute) */}
                
                {showMobileFilter && (
                  <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl p-6 w-64 shadow-xl border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">Filter Customers</h3>
                    <div className="space-y-2">
                      {['All Customers', 'Expiring Soon', 'Critical', 'Birthday', 'Custom'].map((option) => (
                        <button
                          key={option}
                          className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-800 font-medium"
                          onClick={() => {
                            setShowMobileFilter(false);
                            setCustomFilter(option.toLowerCase() === 'custom' ? 'custom' : null);
                            setFilterBy(option.toLowerCase().replace(/ /g, ''));
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <button
                      className="mt-4 w-full py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
                      onClick={() => setShowMobileFilter(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Filter Buttons */}
            <div className="hidden md:flex gap-2">
              <Button
                variant={filterBy === "all" ? "default" : "outline"}
                onClick={() => setFilterBy("all")}
                size="sm"
                className="h-12 px-4 transition-all duration-300 hover:scale-105"
              >
                All Customers
              </Button>
              <Button
                variant={filterBy === "expiring" ? "default" : "outline"}
                onClick={() => setFilterBy("expiring")}
                size="sm"
                className="h-12 px-4 transition-all duration-300 hover:scale-105"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Expiring Soon
              </Button>
              <Button
                variant={filterBy === "critical" ? "default" : "outline"}
                onClick={() => setFilterBy("critical")}
                size="sm"
                className="h-12 px-4 transition-all duration-300 hover:scale-105"
              >
                Critical
              </Button>
              <Button
                variant={filterBy === "birthday" ? "default" : "outline"}
                onClick={() => setFilterBy("birthday")}
                size="sm"
                className="h-12 px-4 transition-all duration-300 hover:scale-105"
              >
                <Gift className="h-4 w-4 mr-2" />
                Birthdays
              </Button>
            </div>
          </div>

          {/* Custom Filter Chips (Mobile Only, below search input) */}
          {customFilter === 'custom' && (
            <div className="flex flex-wrap gap-2 mt-3 md:hidden">
              {/* Example chips, implement logic as needed */}
              {['Month', 'Year', 'Date', 'Expire', 'Upcoming', 'Critical', 'Active'].map((chip) => (
                <button
                  key={chip}
                  className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition"
                  onClick={() => {/* set custom filter logic here */ }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

         
        </CardContent>
      </Card>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="bg-white/80 backdrop-blur-sm border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden relative"
            onClick={() => handleViewDetails(customer)}
          >
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <CardHeader className="pb-3 p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Avatar className="h-12 w-12 md:h-14 md:w-14 bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0 shadow-lg">
                    <AvatarFallback className="text-white font-bold text-sm md:text-base">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-base md:text-lg truncate">{customer.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center truncate">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      {customer.contact}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isDaysToBirthday(customer.birthday) && (
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Gift
                        className="h-4 w-4 text-yellow-600 cursor-pointer hover:text-yellow-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsApp(customer, 'birthday');
                        }}
                      />
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(customer);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEditCustomer(customer);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomer(customer);
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-4 md:p-6 pt-0 relative z-10">
              {/* Vehicle Info */}
              <div className="bg-gray-50/50 rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Car className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-900 text-sm">{customer.brand} {customer.model}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    {customer.vehicleType}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">RC: {customer.rcNumber}</span>
                </div>
              </div>

              {/* Expiry Status */}
              <div className="bg-orange-50/50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                    <span className="font-medium text-gray-900 text-sm">Expires: {customer.expiryDate}</span>
                  </div>
                  <Badge className={`${getStatusColor(customer.status)} text-xs font-bold px-3 py-1`}>
                    {customer.daysToExpiry} days
                  </Badge>
                </div>
              </div>

              {/* Birthday Info */}
              <div className="bg-purple-50/50 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Birthday: {customer.birthday}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCall(customer.contact, customer);
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsApp(customer, 'general');
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCustomers.length === 0 && (
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No customers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>Showing {filteredCustomers.length} of {customers.length} customers</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-destructive rounded-full mr-2"></div>
                Critical: {customers.filter(c => c.status === 'critical').length}
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-warning rounded-full mr-2"></div>
                Warning: {customers.filter(c => c.status === 'warning').length}
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Active: {customers.filter(c => c.status === 'active').length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <CustomerDetails
        customer={selectedCustomer}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      {/* WhatsApp Templates Dialog */}
      <WhatsAppTemplates
        customer={selectedCustomer}
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        messageType={whatsAppType}
      />

      {/* Edit Customer Dialog */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Edit Customer Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEdit(false);
                    setEditingCustomer(null);
                  }}
                >
                  ✕
                </Button>
              </div>
              <CustomerRegistration
                customer={editingCustomer}
                onComplete={(updatedCustomer) => {
                  // Update customer in the list
                  setCustomers(customers.map(c =>
                    c.id === editingCustomer.id ? { ...updatedCustomer, id: editingCustomer.id } : c
                  ));
                  setShowEdit(false);
                  setEditingCustomer(null);
                  toast({
                    title: "Customer Updated",
                    description: `${updatedCustomer.name || editingCustomer.name} details have been updated successfully.`,
                  });
                }}
                isEdit={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteCustomer?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};