
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, Hotel, PartyPopper, Scissors, Search, Users, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const Services = () => {
  const [serviceType, setServiceType] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    category: "room",
    duration: "",
    price: "",
  });

  // Service categories
  const serviceCategories = [
    { value: "room", label: "Room", icon: Hotel },
    { value: "event", label: "Event", icon: PartyPopper },
    { value: "saloon", label: "Saloon", icon: Scissors },
    { value: "spa", label: "Spa & Wellness", icon: Users }
  ];

  const handleAddService = () => {
    setIsLoading(true);
    
    // Simulate adding a service
    setTimeout(() => {
      setIsLoading(false);
      setDialogOpen(false);
      
      // Reset form
      setNewService({
        name: "",
        category: "room",
        duration: "",
        price: "",
      });
      
      // You would typically add the service to your state/database here
      console.log("Service added:", newService);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-sm text-muted-foreground">Manage your service offerings and appointments</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="rooms">Rooms</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="saloon">Saloon</SelectItem>
              <SelectItem value="spa">Spa & Wellness</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-1" /> Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>
                  Enter the details for the new service you want to add.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="service-name">Service Name</Label>
                  <Input 
                    id="service-name" 
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    placeholder="Deluxe Room" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newService.category}
                    onValueChange={(value) => setNewService({...newService, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input 
                      id="duration" 
                      value={newService.duration}
                      onChange={(e) => setNewService({...newService, duration: e.target.value})}
                      placeholder="24h" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input 
                      id="price" 
                      value={newService.price}
                      onChange={(e) => setNewService({...newService, price: e.target.value})}
                      placeholder="199" 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button type="submit" onClick={handleAddService} disabled={isLoading}>
                  {isLoading ? (
                    <Skeleton className="h-4 w-4 rounded-full mr-2 animate-pulse" />
                  ) : (
                    <Plus className="h-4 w-4 mr-1" />
                  )}
                  {isLoading ? "Adding..." : "Add Service"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-2">
            <Hotel className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Rooms</h3>
          </div>
          <p className="text-2xl font-bold mt-2">24</p>
          <p className="text-sm text-muted-foreground">Active listings</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Events</h3>
          </div>
          <p className="text-2xl font-bold mt-2">12</p>
          <p className="text-sm text-muted-foreground">Upcoming events</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-pink-600" />
            <h3 className="font-semibold">Saloon</h3>
          </div>
          <p className="text-2xl font-bold mt-2">8</p>
          <p className="text-sm text-muted-foreground">Active services</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Total Bookings</h3>
          </div>
          <p className="text-2xl font-bold mt-2">156</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search services..." className="pl-8" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Service Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Deluxe Room</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary">Room</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    24h
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    199
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="default">Available</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Wedding Package</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary">Event</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    6h
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    2999
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="default">Available</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Services;
