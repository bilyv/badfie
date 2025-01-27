import { Card } from "@/components/ui/card";
import { Package, ArrowDown, DollarSign, CreditCard, BarChart2, LineChart, PlusCircle, X, Server } from "lucide-react";
import { Bar, BarChart, Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ServiceDashboardMetrics from "@/components/ServiceDashboardMetrics";

const barData = [
  { month: "Jan", sales: 400, stock: 240 },
  { month: "Feb", sales: 300, stock: 139 },
  { month: "Mar", sales: 200, stock: 980 },
  { month: "Apr", sales: 278, stock: 390 },
  { month: "May", sales: 189, stock: 480 },
  { month: "Jun", sales: 239, stock: 380 },
];

const lineData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 2000, expenses: 9800 },
  { month: "Apr", revenue: 2780, expenses: 3908 },
  { month: "May", revenue: 1890, expenses: 4800 },
  { month: "Jun", revenue: 2390, expenses: 3800 },
];

type GraphType = {
  id: string;
  type: 'bar' | 'line';
  title: string;
  data: any[];
};

const availableGraphs: GraphType[] = [
  {
    id: 'sales-stock',
    type: 'bar',
    title: 'Sales & Stock Overview',
    data: barData
  },
  {
    id: 'revenue-expenses',
    type: 'line',
    title: 'Revenue & Expenses Trend',
    data: lineData
  },
  {
    id: 'monthly-growth',
    type: 'line',
    title: 'Monthly Growth Rate',
    data: lineData
  },
  {
    id: 'inventory-turnover',
    type: 'bar',
    title: 'Inventory Turnover Rate',
    data: barData
  }
];

const Index = () => {
  const [mode, setMode] = useState<"product" | "service">("product");
  const [activeGraphs, setActiveGraphs] = useState<string[]>(['sales-stock', 'revenue-expenses']);

  const handleAddGraph = (graphId: string) => {
    setActiveGraphs(prev => [...prev, graphId]);
  };

  const handleRemoveGraph = (graphId: string) => {
    setActiveGraphs(prev => prev.filter(id => id !== graphId));
  };

  const renderGraph = (graph: GraphType) => {
    return (
      <Card key={graph.id} className="p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        
        <button
          onClick={() => handleRemoveGraph(graph.id)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background z-10"
        >
          <X className="h-4 w-4 text-foreground/60" />
        </button>
        
        <h3 className="font-semibold mb-4 text-foreground/80 relative z-10">{graph.title}</h3>
        <div className="h-[300px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            {graph.type === 'bar' ? (
              <BarChart data={graph.data} className="[&_.recharts-cartesian-grid-horizontal]:opacity-20 [&_.recharts-cartesian-grid-vertical]:opacity-20">
                <XAxis dataKey="month" stroke="currentColor" strokeOpacity={0.7} fontSize={12} />
                <YAxis stroke="currentColor" strokeOpacity={0.7} fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#22c55e" radius={[4, 4, 0, 0]} opacity={0.9} />
                <Bar dataKey="stock" fill="#ea384c" radius={[4, 4, 0, 0]} opacity={0.9} />
              </BarChart>
            ) : (
              <RechartsLineChart data={graph.data} className="[&_.recharts-cartesian-grid-horizontal]:opacity-20 [&_.recharts-cartesian-grid-vertical]:opacity-20">
                <XAxis dataKey="month" stroke="currentColor" strokeOpacity={0.7} fontSize={12} />
                <YAxis stroke="currentColor" strokeOpacity={0.7} fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ea384c" 
                  strokeWidth={2}
                  dot={{ fill: "#ea384c", strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </RechartsLineChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {mode === "product" ? "Product Management Overview" : "Service Management Overview"}
          </p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto">
              {mode === "product" ? <Package className="h-5 w-5" /> : <Server className="h-5 w-5" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="end">
            <div className="space-y-2">
              <button
                onClick={() => setMode("product")}
                className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  mode === "product" ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
              >
                Product Mode
              </button>
              <button
                onClick={() => setMode("service")}
                className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  mode === "service" ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
              >
                Service Mode
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {mode === "product" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card 
              className="p-6 relative overflow-hidden group transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-blue-300/10 dark:to-purple-300/10 opacity-0 group-hover:opacity-100 animate-neon-glow dark:animate-neon-glow-dark blur-xl" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Items</p>
                      <h3 className="text-2xl font-bold mt-1">2456</h3>
                    </div>
                  </div>
                  <span className="text-sm text-green-500">+12.5%</span>
                </div>
              </div>
            </Card>
            <Card 
              className="p-6 relative overflow-hidden group transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-blue-300/10 dark:to-purple-300/10 opacity-0 group-hover:opacity-100 animate-neon-glow dark:animate-neon-glow-dark blur-xl" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ArrowDown className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Low Stock</p>
                      <h3 className="text-2xl font-bold mt-1">45</h3>
                    </div>
                  </div>
                  <span className="text-sm text-red-500">-5%</span>
                </div>
              </div>
            </Card>
            <Card 
              className="p-6 relative overflow-hidden group transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-blue-300/10 dark:to-purple-300/10 opacity-0 group-hover:opacity-100 animate-neon-glow dark:animate-neon-glow-dark blur-xl" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Value</p>
                      <h3 className="text-2xl font-bold mt-1">$124,500</h3>
                    </div>
                  </div>
                  <span className="text-sm text-green-500">+2.3%</span>
                </div>
              </div>
            </Card>
            <Card 
              className="p-6 relative overflow-hidden group transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-blue-300/10 dark:to-purple-300/10 opacity-0 group-hover:opacity-100 animate-neon-glow dark:animate-neon-glow-dark blur-xl" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Categories</p>
                      <h3 className="text-2xl font-bold mt-1">12</h3>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeGraphs.map(graphId => {
              const graph = availableGraphs.find(g => g.id === graphId);
              if (graph) return renderGraph(graph);
              return null;
            })}
          </div>
        </>
      ) : (
        <>
          <ServiceDashboardMetrics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Service Bookings Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={lineData} className="[&_.recharts-cartesian-grid-horizontal]:opacity-20 [&_.recharts-cartesian-grid-vertical]:opacity-20">
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Bookings" stroke="#22c55e" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Service Categories Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} className="[&_.recharts-cartesian-grid-horizontal]:opacity-20 [&_.recharts-cartesian-grid-vertical]:opacity-20">
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Completed" fill="#22c55e" />
                    <Bar dataKey="stock" name="Pending" fill="#ea384c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
