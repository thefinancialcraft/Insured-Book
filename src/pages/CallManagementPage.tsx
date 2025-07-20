import CallManagement from "@/components/CallManagement";

const CallManagementPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Call Management</h1>
          <p className="text-muted-foreground">Manage customer calls and dispositions</p>
        </div>
      </div>
      <CallManagement />
    </div>
  );
};

export default CallManagementPage;