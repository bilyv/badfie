
import { Card } from "@/components/ui/card";
import { Users, DollarSign, ChefHat, Wine, TrendingUp, Clock } from "lucide-react";

const RestaurantMetricCards = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
      <Card className="p-4 sm:p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Today's Sales</p>
              <h3 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">£2,450</h3>
              <span className="text-xs text-green-500">+12.5%</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Active Tables</p>
              <h3 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">18/24</h3>
              <span className="text-xs text-blue-500">75% occupancy</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg">
              <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Kitchen Orders</p>
              <h3 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">8</h3>
              <span className="text-xs text-orange-500">Pending</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg">
              <Wine className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Bar Revenue</p>
              <h3 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">£850</h3>
              <span className="text-xs text-purple-500">+8.2%</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-teal-500/10 rounded-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Daily Growth</p>
              <h3 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">15%</h3>
              <span className="text-xs text-teal-500">vs yesterday</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-amber-500/10 rounded-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Avg Wait Time</p>
              <h3 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">12min</h3>
              <span className="text-xs text-amber-500">-3min</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RestaurantMetricCards;
