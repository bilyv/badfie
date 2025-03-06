
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";
import { Package, Server } from "lucide-react";

interface DashboardHeaderProps {
  greeting: string;
  mode: "product" | "service";
  setMode: (mode: "product" | "service") => void;
}

const DashboardHeader = ({ greeting, mode, setMode }: DashboardHeaderProps) => {
  const items = [
    { name: "Product", icon: Package, value: "product" },
    { name: "Service", icon: Server, value: "service" },
  ];

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
      
      <div className="ml-auto">
        <TubelightNavbar 
          items={items}
          value={mode}
          onValueChange={setMode}
          className="max-w-[250px]"
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
