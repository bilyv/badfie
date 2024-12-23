import DashboardMetrics from "@/components/DashboardMetrics";
import InventoryList from "@/components/InventoryList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your inventory items and track metrics</p>
        </div>
        
        <DashboardMetrics />
        <InventoryList />
      </div>
    </div>
  );
};

export default Index;