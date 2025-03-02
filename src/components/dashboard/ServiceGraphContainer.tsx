
import { Card } from "@/components/ui/card";
import { 
  LineChart as RechartsLineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Legend,
  Line
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceGraphContainerProps {
  data: any[];
}

const ServiceGraphContainer = ({ data }: ServiceGraphContainerProps) => {
  return (
    <Card className="p-3 sm:p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-6 relative z-10">
        <h3 className="text-sm sm:text-base font-semibold text-foreground/80">
          Service Performance Metrics
        </h3>
        
        <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
          <Select defaultValue="bookings">
            <SelectTrigger className="w-full sm:w-[180px] h-8 sm:h-10 text-xs sm:text-sm">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bookings" className="text-xs sm:text-sm">Service Bookings</SelectItem>
              <SelectItem value="categories" className="text-xs sm:text-sm">Categories Distribution</SelectItem>
              <SelectItem value="satisfaction" className="text-xs sm:text-sm">Customer Satisfaction</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart 
            data={data} 
            className="[&_.recharts-cartesian-grid-horizontal]:opacity-20 [&_.recharts-cartesian-grid-vertical]:opacity-20"
            margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
          >
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Bookings" stroke="#22c55e" />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ServiceGraphContainer;
