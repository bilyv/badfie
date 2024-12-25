import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const MultiStore = () => {
  const stores = [
    {
      id: 1,
      name: "Main Store",
      location: "New York",
      products: 156,
      status: "Active",
    },
    {
      id: 2,
      name: "Branch Store",
      location: "Los Angeles",
      products: 89,
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Multi-Store Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage all your store locations from one place
        </p>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Store
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Card key={store.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="text-sm text-muted-foreground">{store.location}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Products</span>
                    <span>{store.products}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-600 dark:text-green-400">{store.status}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MultiStore;