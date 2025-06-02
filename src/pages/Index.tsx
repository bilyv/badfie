
import { useState, useEffect } from "react";
import GraphContainer from "@/components/dashboard/GraphContainer";
import RestaurantMetricCards from "@/components/dashboard/RestaurantMetricCards";
import { availableGraphs } from "@/components/dashboard/data";

const Index = () => {
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

  return (
    <div className="space-y-4 sm:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {greeting}, Chef!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's what's happening in your restaurant today.
        </p>
      </div>

      <RestaurantMetricCards />
      <GraphContainer 
        availableGraphs={availableGraphs}
        currentGraph={currentGraph}
        handlePrevGraph={handlePrevGraph}
        handleNextGraph={handleNextGraph}
        handleSelectGraph={handleSelectGraph}
      />
    </div>
  );
};

export default Index;
