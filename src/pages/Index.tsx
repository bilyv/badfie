import { Card } from "@/components/ui/card";
import { Package, ArrowDown, DollarSign, CreditCard, BarChart2, LineChart, PlusCircle, X } from "lucide-react";
import { Bar, BarChart, Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const allMetrics = {
  default: [
    { label: "Total Items", value: 2456, change: "+12.5%", trend: "up", icon: Package },
    { label: "Low Stock", value: 45, change: "-5%", trend: "down", icon: ArrowDown },
    { label: "Total Value", value: "$124,500", change: "+2.3%", trend: "up", icon: DollarSign },
    { label: "Pending Payments", value: "$12,450", trend: "neutral", icon: CreditCard },
  ],
  profit: [
    { label: "Net Profit", value: "$45,678", change: "+8.3%", trend: "up", icon: DollarSign },
    { label: "Gross Profit", value: "$78,900", change: "+5.7%", trend: "up", icon: DollarSign },
    { label: "Profit Margin", value: "32%", change: "+2.1%", trend: "up", icon: DollarSign },
    { label: "Operating Profit", value: "$34,567", change: "+4.2%", trend: "up", icon: DollarSign },
  ],
  pending: [
    { label: "Pending Orders", value: 156, change: "+12%", trend: "up", icon: Package },
    { label: "Pending Shipments", value: 89, change: "-3%", trend: "down", icon: Package },
    { label: "Pending Payments", value: "$23,456", change: "+15%", trend: "up", icon: DollarSign },
    { label: "Pending Returns", value: 34, change: "-8%", trend: "down", icon: Package },
  ]
};

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
  const [selectedMetric, setSelectedMetric] = useState<keyof typeof allMetrics>("default");
  const [activeGraphs, setActiveGraphs] = useState<string[]>(['sales-stock', 'revenue-expenses']);

  const handleAddGraph = (graphId: string) => {
    setActiveGraphs(prev => [...prev, graphId]);
  };

  const handleRemoveGraph = (graphId: string) => {
    setActiveGraphs(prev => prev.filter(id => id !== graphId));
  };

  const renderGraph = (graph: GraphType) => {
    return (
      <Card key={graph.id} className="p-6 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-gray-700/20 dark:to-gray-900/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
        <div className="absolute inset-0 animate-neon-glow dark:animate-neon-glow-dark blur-xl opacity-50" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{graph.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveGraph(graph.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {graph.type === 'bar' ? (
                <BarChart data={graph.data}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#4f46e5" name="Sales" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="stock" fill="#e5e7eb" name="Stock" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <RechartsLineChart data={graph.data}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    dot={{ fill: "#4f46e5" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: "#ef4444" }}
                  />
                </RechartsLineChart>
              )}
            </ResponsiveContainer>
          </div>
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
            Welcome to your inventory management system
          </p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto">
              <BarChart2 className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="end">
            <div className="space-y-2">
              <button
                onClick={() => setSelectedMetric("default")}
                className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedMetric === "default" ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
              >
                Default Metrics
              </button>
              <button
                onClick={() => setSelectedMetric("profit")}
                className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedMetric === "profit" ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
              >
                Profit Metrics
              </button>
              <button
                onClick={() => setSelectedMetric("pending")}
                className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedMetric === "pending" ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
              >
                Pending Items
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {currentMetrics.map((metric, index) => {
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

      <div className="grid gap-6 md:grid-cols-2">
        {activeGraphs.map(graphId => {
          const graph = availableGraphs.find(g => g.id === graphId);
          if (graph) return renderGraph(graph);
          return null;
        })}
        
        <Dialog>
          <DialogTrigger asChild>
            <Card className="p-6 border-dashed flex items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors">
              <PlusCircle className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Add Graph</span>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Graph</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {availableGraphs
                .filter(graph => !activeGraphs.includes(graph.id))
                .map(graph => (
                  <Button
                    key={graph.id}
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      handleAddGraph(graph.id);
                      const dialogClose = document.querySelector('[data-dialog-close]') as HTMLButtonElement;
                      dialogClose?.click();
                    }}
                  >
                    {graph.type === 'bar' ? <BarChart2 className="mr-2 h-4 w-4" /> : <LineChart className="mr-2 h-4 w-4" />}
                    {graph.title}
                  </Button>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
