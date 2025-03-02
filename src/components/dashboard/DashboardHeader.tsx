
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Package, Server } from "lucide-react";

interface DashboardHeaderProps {
  greeting: string;
  mode: "product" | "service";
  setMode: (mode: "product" | "service") => void;
}

const DashboardHeader = ({ greeting, mode, setMode }: DashboardHeaderProps) => {
  return (
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
  );
};

export default DashboardHeader;
