
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProductMetricCards from "@/components/dashboard/ProductMetricCards";
import GraphContainer from "@/components/dashboard/GraphContainer";
import ServiceGraphContainer from "@/components/dashboard/ServiceGraphContainer";
import { availableGraphs, lineData } from "@/components/dashboard/data";

interface IndexProps {
  mode: "product" | "service";
  setMode: (mode: "product" | "service") => void;
}

const Index = ({ mode, setMode }: IndexProps) => {
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

  return (
    <div className="space-y-4 sm:space-y-8">
      <DashboardHeader 
        greeting={greeting} 
        mode={mode} 
        setMode={setMode} 
      />

      {mode === "product" ? (
        <>
          <ProductMetricCards />
          <GraphContainer 
            availableGraphs={availableGraphs}
            currentGraph={currentGraph}
            handlePrevGraph={handlePrevGraph}
            handleNextGraph={handleNextGraph}
            handleSelectGraph={handleSelectGraph}
          />
        </>
      ) : (
        <>
          <ServiceGraphContainer data={lineData} />
        </>
      )}
    </div>
  );
};

export default Index;
