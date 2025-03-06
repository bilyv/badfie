import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Edit, Trash2, LogIn, DollarSign } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin } from "lucide-react";

type Store = {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  pin: string;
};

const MultiStore = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStore, setNewStore] = useState({ name: "", location: "", pin: "" });
  const [enteredPin, setEnteredPin] = useState("");
  const [stores, setStores] = useState<Store[]>([
    {
      id: 1,
      name: "Main Store",
      location: "New York",
      status: "active",
      pin: "1234"
    },
    {
      id: 2,
      name: "Branch Store",
      location: "Los Angeles",
      status: "active",
      pin: "5678"
    }
  ]);

  const handleCreateStore = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStore.name || !newStore.location || !newStore.pin) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!/^\d{4}$/.test(newStore.pin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits.",
        variant: "destructive"
      });
      return;
    }

    const newStoreData: Store = {
      id: stores.length + 1,
      name: newStore.name,
      location: newStore.location,
      status: 'active',
      pin: newStore.pin
    };

    setStores(prevStores => [...prevStores, newStoreData]);
    toast({
      title: "Store created",
      description: "Your new store has been created successfully.",
    });
    
    setNewStore({ name: "", location: "", pin: "" });
    setIsDialogOpen(false);
  }, [newStore, stores.length]);

  const handleLogin = (store: Store) => {
    if (enteredPin === store.pin) {
      toast({
        title: "Success",
        description: `Logged in to ${store.name} successfully.`,
      });
      setIsLoginDialogOpen(false);
      setEnteredPin("");
      setSelectedStore(null);
    } else {
      toast({
        title: "Error",
        description: "Incorrect PIN.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStore = (storeId: number) => {
    setStores(prevStores => prevStores.filter(store => store.id !== storeId));
    toast({
      title: "Store deleted",
      description: "The store has been deleted successfully.",
    });
  };

  const handleRenameStore = useCallback(() => {
    if (!selectedStore || !newStoreName.trim()) return;
    
    setStores(prevStores => 
      prevStores.map(s => 
        s.id === selectedStore.id ? { ...s, name: newStoreName } : s
      )
    );
    
    toast({
      title: "Store renamed",
      description: "The store has been renamed successfully.",
    });
    
    setIsRenameDialogOpen(false);
    setNewStoreName("");
    setSelectedStore(null);
  }, [selectedStore, newStoreName]);

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
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add New Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Store</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new store location.
              </DialogDescription>
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
              <div className="space-y-2">
                <Label htmlFor="pin">4-Digit PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  maxLength={4}
                  value={newStore.pin}
                  onChange={(e) => setNewStore(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '') }))}
                  placeholder="Enter 4-digit PIN"
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
            <Card key={store.id} className="relative group overflow-hidden transition-all duration-300 hover:shadow-lg border-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              <div className="p-6 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg tracking-tight">{store.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {store.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {Math.floor(Math.random() * 10000)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full hover:bg-primary/10"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStore(store);
                              setNewStoreName(store.name);
                              setIsRenameDialogOpen(true);
                            }}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteStore(store.id)}
                            className="gap-2 text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        store.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {store.status}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                      onClick={() => {
                        setSelectedStore(store);
                        setIsLoginDialogOpen(true);
                      }}
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={isLoginDialogOpen} onOpenChange={(open) => {
        setIsLoginDialogOpen(open);
        if (!open) {
          setSelectedStore(null);
          setEnteredPin("");
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Store PIN</DialogTitle>
            <DialogDescription>
              Enter the 4-digit PIN for {selectedStore?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">4-Digit PIN</Label>
              <Input
                id="pin"
                type="password"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter PIN"
              />
            </div>
            <Button 
              onClick={() => selectedStore && handleLogin(selectedStore)}
              className="w-full"
              disabled={!enteredPin || enteredPin.length !== 4}
            >
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={(open) => {
        setIsRenameDialogOpen(open);
        if (!open) {
          setSelectedStore(null);
          setNewStoreName("");
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Store</DialogTitle>
            <DialogDescription>
              Enter a new name for {selectedStore?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newName">New Store Name</Label>
              <Input
                id="newName"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                placeholder="Enter new store name"
              />
            </div>
            <Button onClick={handleRenameStore} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiStore;
