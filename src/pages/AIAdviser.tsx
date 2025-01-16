import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Robot, Send } from "lucide-react";
import { useState } from "react";

const AIAdviser = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          AI Business Adviser
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Get AI-powered insights and recommendations for your business
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Robot className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Ask your business question</h2>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Type your question here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Insights</h3>
          <p className="text-muted-foreground">No recent insights available.</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Suggested Topics</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Inventory Optimization
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Sales Forecasting
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Cost Reduction Strategies
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIAdviser;