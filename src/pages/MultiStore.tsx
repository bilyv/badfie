import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type Store = {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'inactive';
};

const MultiStore = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStore, setNewStore] = useState({ name: "", location: "" });
  const [stores, setStores] = useState<Store[]>([
    {
      id: 1,
      name: "Main Store",
      location: "New York",
      status: "active"
    },
    {
      id: 2,
      name: "Branch Store",
      location: "Los Angeles",
      status: "active"
    }
  ]);

  const handleCreateStore = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStore.name || !newStore.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newStoreData: Store = {
      id: stores.length + 1,
      name: newStore.name,
      location: newStore.location,
      status: 'active'
    };

    setStores(prevStores => [...prevStores, newStoreData]);
    toast({
      title: "Store created",
      description: "Your new store has been created successfully.",
    });
    
    setNewStore({ name: "", location: "" });
    setIsDialogOpen(false);
  }, [newStore, stores.length]);

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Store</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateStore} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  value={newStore.name}
                  onChange={(e) => setNewStore(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter store name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newStore.location}
                  onChange={(e) => setNewStore(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter store location"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create Store</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Card key={store.id} className="relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-700/10 dark:from-blue-300/10 dark:to-purple-300/10 opacity-0 group-hover:opacity-100 animate-neon-glow dark:animate-neon-glow-dark blur-xl" />
              
              <div className="relative z-10 p-6">
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
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-green-600 dark:text-green-400">{store.status}</span>
                    </div>
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