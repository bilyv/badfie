import { Card } from "@/components/ui/card";
import { Package, ArrowDown, DollarSign, CreditCard, BarChart2, LineChart, PlusCircle, X, Server, ChevronLeft, ChevronRight } from "lucide-react";
import { Bar, BarChart, Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ServiceDashboardMetrics from "@/components/ServiceDashboardMetrics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [greeting, setGreeting] = useState<string>("Hello");
  const [currentGraph, setCurrentGraph] = useState<number>(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const handleAddGraph = (graphId: string) => {
    if (!activeGraphs.includes(graphId)) {
      setActiveGraphs(prev => [...prev, graphId]);
    }
  };

  const handleRemoveGraph = (graphId: string) => {
    if (graphId) {
      setActiveGraphs(prev => prev.filter(id => id !== graphId));
    }
  };

  const handlePrevGraph = () => {
    setCurrentGraph(prev => (prev === 0 ? availableGraphs.length - 1 : prev - 1));
  };

  const handleNextGraph = () => {
    setCurrentGraph(prev => (prev === availableGraphs.length - 1 ? 0 : prev + 1));
  };

  const handleSelectGraph = (value: string) => {
    const index = availableGraphs.findIndex(graph => graph.id === value);
    if (index !== -1) {
      setCurrentGraph(index);
    }
  };

  const renderGraph = (graph: GraphType) => {
    if (!graph) return null;
    
    return (
      <div className="h-[250px] sm:h-[300px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          {graph.type === 'bar' ? (
            <BarChart data={graph.data} className="[&_.recharts-cartesian-grid-horizontal]:opacity-20 [&_.recharts-cartesian-grid-vertical]:opacity-20" margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
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
            <RechartsLineChart data={graph.data} className="[&_.recharts-cartesian-grid-horizontal]:opacity-20 [&_.recharts-cartesian-grid-vertical]:opacity-20" margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
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
    );
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {greeting}, <span className="text-primary">Brian</span>
            </h1>
            <div className="hidden sm:flex w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
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

          <Card className="p-3 sm:p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-6 relative z-10">
              <h3 className="text-sm sm:text-base font-semibold text-foreground/80">
                {availableGraphs[currentGraph]?.title || "Graph View"}
              </h3>
              
              <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                <div className="hidden sm:flex">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePrevGraph}
                    className="mr-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNextGraph}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex space-x-2 sm:hidden">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrevGraph}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNextGraph}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Select onValueChange={handleSelectGraph} value={availableGraphs[currentGraph]?.id}>
                  <SelectTrigger className="w-full sm:w-[180px] h-8 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Select graph" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGraphs.map((graph) => (
                      <SelectItem key={graph.id} value={graph.id} className="text-xs sm:text-sm">
                        {graph.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {renderGraph(availableGraphs[currentGraph])}
          </Card>
        </>
      ) : (
        <>
          <ServiceDashboardMetrics />
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
                  data={lineData} 
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
        </>
      )}
    </div>
  );
};

export default Index;
