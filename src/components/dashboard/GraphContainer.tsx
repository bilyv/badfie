
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart as RechartsLineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Legend 
} from "recharts";

interface GraphType {
  id: string;
  type: 'bar' | 'line';
  title: string;
  data: any[];
}

interface GraphContainerProps {
  availableGraphs: GraphType[];
  currentGraph: number;
  handlePrevGraph: () => void;
  handleNextGraph: () => void;
  handleSelectGraph: (value: string) => void;
}

const GraphContainer = ({ 
  availableGraphs, 
  currentGraph, 
  handlePrevGraph, 
  handleNextGraph, 
  handleSelectGraph 
}: GraphContainerProps) => {
  
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
  );
};

export default GraphContainer;
