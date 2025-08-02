import { CustomerList } from "@/components/CustomerList";
import { useSearchParams } from "react-router-dom";

const Customers = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "";

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-base md:text-base text-gray-600">Manage all customer records</p>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg p-3 md:p-6">
        <CustomerList filter={filter} />
      </div>
    </div>
  );
};

export default Customers;