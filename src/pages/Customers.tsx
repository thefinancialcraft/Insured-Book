import { CustomerList } from "@/components/CustomerList";
import { useSearchParams } from "react-router-dom";

const Customers = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage all customer records</p>
        </div>
      </div>
      <CustomerList filter={filter} />
    </div>
  );
};

export default Customers;