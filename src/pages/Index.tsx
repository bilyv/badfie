import { Card } from "@/components/ui/card";
import { Package, ArrowDown, DollarSign, CreditCard, BarChart2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

const data = [
  { month: "Jan", sales: 400, stock: 240 },
  { month: "Feb", sales: 300, stock: 139 },
  { month: "Mar", sales: 200, stock: 980 },
  { month: "Apr", sales: 278, stock: 390 },
  { month: "May", sales: 189, stock: 480 },
  { month: "Jun", sales: 239, stock: 380 },
];

const Index = () => {
  const [selectedMetric, setSelectedMetric] = useState<keyof typeof allMetrics>("default");

  const currentMetrics = allMetrics[selectedMetric];

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
              {/* Neon glow effect - dark in light mode, light in dark mode */}
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sales & Stock Overview</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="sales" fill="#4f46e5" name="Sales" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stock" fill="#e5e7eb" name="Stock" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Index;