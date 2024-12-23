import DashboardMetrics from "@/components/DashboardMetrics";
import InventoryList from "@/components/InventoryList";

const Index = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to your inventory management system</p>
      </div>
      
      <DashboardMetrics />
      <InventoryList />
    </div>
  );
};

export default Index;