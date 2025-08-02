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
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                placeholder="Search customers by name, contact, or RC number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 focus:border-primary transition-all duration-300 bg-background/50 backdrop-blur-sm"
              />
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

            {/* Modern Mobile Filter Dropdown */}
            <div className="md:hidden">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full h-12 border-2 focus:border-primary transition-colors bg-background/50 backdrop-blur-sm">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter customers" />
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="critical">Critical Status</SelectItem>
                  <SelectItem value="birthday">Birthday This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="bg-gradient-card shadow-card border-0 hover:shadow-hover transition-all duration-300 animate-scale-in cursor-pointer"
            onClick={() => handleViewDetails(customer)}
          >
            <CardHeader className="pb-2 md:pb-3 p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12 bg-gradient-primary flex-shrink-0">
                    <AvatarFallback className="text-primary-foreground font-semibold text-sm">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-sm md:text-base truncate">{customer.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground flex items-center truncate">
                      <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                      {customer.contact}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isDaysToBirthday(customer.birthday) && (
                    <Gift
                      className="h-4 w-4 text-warning cursor-pointer hover:text-warning/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsApp(customer, 'birthday');
                      }}
                    />
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
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
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 md:space-y-4 p-3 md:p-6 pt-0">
              {/* Vehicle Info */}
              <div className="flex items-center space-x-1 md:space-x-2">
                <Car className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs md:text-sm text-foreground truncate">{customer.brand} {customer.model}</span>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {customer.vehicleType}
                </Badge>
              </div>

              {/* RC Number */}
              <div className="flex items-center space-x-1 md:space-x-2">
                <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs md:text-sm text-muted-foreground truncate">RC: {customer.rcNumber}</span>
              </div>

              {/* Expiry Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 md:space-x-2 min-w-0 flex-1">
                  <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs md:text-sm text-foreground truncate">Exp: {customer.expiryDate}</span>
                </div>
                <Badge className={`${getStatusColor(customer.status)} border text-xs flex-shrink-0`}>
                  {customer.daysToExpiry}d
                </Badge>
              </div>

              {/* Birthday Info */}
              <div className="flex items-center space-x-1 md:space-x-2">
                <Gift className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs md:text-sm text-muted-foreground truncate">DOB: {customer.birthday}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-1 md:space-x-2 pt-1 md:pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs md:text-sm px-2 py-1 h-7 md:h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCall(customer.contact, customer);
                  }}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Call</span>
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-xs md:text-sm px-2 py-1 h-7 md:h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsApp(customer, 'general');
                  }}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">WhatsApp</span>
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