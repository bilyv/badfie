import { Card } from "@/components/ui/card";
import { Users, Clock, Calendar, DollarSign } from "lucide-react";

const metrics = [
  { label: "Active Services", value: "24", change: "+8%", trend: "up", icon: Users },
  { label: "Bookings Today", value: "12", change: "+15%", trend: "up", icon: Calendar },
  { label: "Avg. Duration", value: "2.5h", change: "-5%", trend: "down", icon: Clock },
  { label: "Revenue", value: "$5,678", change: "+12%", trend: "up", icon: DollarSign },
];

const ServiceDashboardMetrics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={index} 
            className="p-6 relative overflow-hidden group transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-blue-300/10 dark:to-purple-300/10 opacity-0 group-hover:opacity-100 animate-neon-glow dark:animate-neon-glow-dark blur-xl" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{metric.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                  </div>
                </div>
                {metric.change && (
                  <span className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-500' : 
                    metric.trend === 'down' ? 'text-red-500' : 
                    'text-gray-500'
                  }`}>
                    {metric.change}
                  </span>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ServiceDashboardMetrics;