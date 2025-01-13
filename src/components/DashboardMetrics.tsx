import { DashboardMetric } from "@/lib/types";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

const metrics: DashboardMetric[] = [
  { label: "Total Items", value: 2456, change: "+12.5%", trend: "up" },
  { label: "Low Stock", value: 45, change: "-5%", trend: "down" },
  { label: "Total Value", value: "$124,500", change: "+2.3%", trend: "up" },
  { label: "Categories", value: 12, trend: "neutral" },
];

const DashboardMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          className="p-4 hover:shadow-lg transition-shadow relative overflow-hidden group"
        >
          {/* Neon glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 animate-neon-glow blur-xl" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{metric.label}</p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
              </div>
              {metric.trend && (
                <div className={`flex items-center ${
                  metric.trend === 'up' ? 'text-green-500' : 
                  metric.trend === 'down' ? 'text-red-500' : 
                  'text-gray-400'
                }`}>
                  {metric.trend === 'up' ? <ArrowUpIcon className="w-4 h-4" /> :
                   metric.trend === 'down' ? <ArrowDownIcon className="w-4 h-4" /> :
                   <MinusIcon className="w-4 h-4" />}
                  {metric.change && <span className="ml-1 text-sm">{metric.change}</span>}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;