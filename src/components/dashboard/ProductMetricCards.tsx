
import { Card } from "@/components/ui/card";
import { Package, ArrowDown, DollarSign, CreditCard } from "lucide-react";

const ProductMetricCards = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
      <Card 
        className="p-4 sm:p-6 relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-blue-300/10 dark:to-purple-300/10 opacity-0 group-hover:opacity-100 animate-neon-glow dark:animate-neon-glow-dark blur-xl" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Items</p>
                <h3 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">2456</h3>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-green-500">+12.5%</span>
          </div>
        </div>
      </Card>
      <Card 
        className="p-4 sm:p-6 relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-blue-300/10 dark:to-purple-300/10 opacity-0 group-hover:opacity-100 animate-neon-glow dark:animate-neon-glow-dark blur-xl" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Low Stock</p>
                <h3 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">45</h3>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-red-500">-5%</span>
          </div>
        </div>
      </Card>
      <Card 
        className="p-4 sm:p-6 relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-blue-300/10 dark:to-purple-300/10 opacity-0 group-hover:opacity-100 animate-neon-glow dark:animate-neon-glow-dark blur-xl" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Value</p>
                <h3 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">$124,500</h3>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-green-500">+2.3%</span>
          </div>
        </div>
      </Card>
      <Card 
        className="p-4 sm:p-6 relative overflow-hidden group transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-blue-300/10 dark:to-purple-300/10 opacity-0 group-hover:opacity-100 animate-neon-glow dark:animate-neon-glow-dark blur-xl" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Categories</p>
                <h3 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">12</h3>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductMetricCards;
