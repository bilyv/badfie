
import { Card } from "@/components/ui/card";
import { 
  LineChart as RechartsLineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Legend,
  Line,
  BarChart,
  Bar
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface ServiceGraphContainerProps {
  data: any[];
}

const serviceData = [
  { name: "Consultation", value: 35 },
  { name: "Repairs", value: 25 },
  { name: "Maintenance", value: 20 },
  { name: "Installation", value: 15 },
  { name: "Training", value: 5 }
];

const clientData = [
  { month: "Jan", new: 6, returning: 15 },
  { month: "Feb", new: 8, returning: 16 },
  { month: "Mar", new: 12, returning: 18 },
  { month: "Apr", new: 10, returning: 20 },
  { month: "May", new: 14, returning: 22 },
  { month: "Jun", new: 18, returning: 25 }
];

const ServiceGraphContainer = ({ data }: ServiceGraphContainerProps) => {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <Card className="p-3 sm:p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-6 relative z-10">
        <h3 className="text-sm sm:text-base font-semibold text-foreground/80">
          Service Performance Metrics
        </h3>
        
        <Tabs defaultValue="bookings" className="w-full sm:w-auto" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full sm:w-auto grid-cols-3 h-8">
            <TabsTrigger value="bookings" className="text-xs">Bookings</TabsTrigger>
            <TabsTrigger value="services" className="text-xs">Services</TabsTrigger>
            <TabsTrigger value="clients" className="text-xs">Clients</TabsTrigger>
          </TabsList>
        
          <div className="h-[250px] sm:h-[300px]">
            <TabsContent value="bookings" className="h-full mt-0">
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
            </TabsContent>

            <TabsContent value="services" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={serviceData}
                  className="[&_.recharts-cartesian-grid-horizontal]:opacity-20 [&_.recharts-cartesian-grid-vertical]:opacity-20"
                  margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
                >
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <RechartsTooltip
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" name="Services (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="clients" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clientData}
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
                  <Bar dataKey="new" name="New Clients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returning" name="Returning Clients" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Card>
  );
};

export default ServiceGraphContainer;
