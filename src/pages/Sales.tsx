import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wine, ChefHat, Plus, Search, Filter, DollarSign, Clock, Users } from "lucide-react";

const Sales = () => {
  const [activeSubTab, setActiveSubTab] = useState<{ [key: string]: string }>({
    bar: "add-sale",
    kitchen: "add-sale"
  });

  // Sample data for demonstration
  const barSales = [
    { id: "#B001", customer: "John Doe", items: "Whiskey, Beer", total: "$45.00", status: "Completed", time: "2:30 PM" },
    { id: "#B002", customer: "Jane Smith", items: "Wine, Cocktail", total: "$65.00", status: "Pending", time: "3:15 PM" },
    { id: "#B003", customer: "Mike Johnson", items: "Beer x3", total: "$18.00", status: "Completed", time: "4:00 PM" },
  ];

  const kitchenSales = [
    { id: "#K001", customer: "Alice Brown", items: "Burger, Fries", total: "$25.00", status: "Preparing", time: "2:45 PM" },
    { id: "#K002", customer: "Bob Wilson", items: "Pizza, Salad", total: "$32.00", status: "Ready", time: "3:20 PM" },
    { id: "#K003", customer: "Carol Davis", items: "Pasta, Soup", total: "$28.00", status: "Completed", time: "4:10 PM" },
  ];

  const barItems = ["Whiskey", "Beer", "Wine", "Cocktail", "Vodka", "Rum"];
  const kitchenItems = ["Burger", "Pizza", "Pasta", "Salad", "Soup", "Fries"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Preparing": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Ready": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const renderSalesContent = (type: "bar" | "kitchen") => {
    const currentSubTab = activeSubTab[type];
    const salesData = type === "bar" ? barSales : kitchenSales;
    const items = type === "bar" ? barItems : kitchenItems;
    const icon = type === "bar" ? Wine : ChefHat;
    const IconComponent = icon;

    return (
      <div className="space-y-6">
        {/* Sub-navigation */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold capitalize">{type} Sales</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentSubTab === "add-sale" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSubTab(prev => ({ ...prev, [type]: "add-sale" }))}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Sale
            </Button>
            <Button
              variant={currentSubTab === "manage-sales" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSubTab(prev => ({ ...prev, [type]: "manage-sales" }))}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Manage Sales
            </Button>
          </div>
        </div>

        {/* Content based on sub-tab */}
        {currentSubTab === "add-sale" && (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Add New {type === "bar" ? "Bar" : "Kitchen"} Sale</CardTitle>
                <CardDescription>
                  Create a new sale transaction for {type === "bar" ? "beverages and drinks" : "food and meals"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`${type}-customer`} className="text-sm font-medium">Customer Name</Label>
                    <Input
                      id={`${type}-customer`}
                      placeholder="Enter customer name"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${type}-item`} className="text-sm font-medium">Select Item</Label>
                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={`Choose ${type} item`} />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item} value={item.toLowerCase()}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${type}-quantity`} className="text-sm font-medium">Quantity</Label>
                    <Input
                      id={`${type}-quantity`}
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${type}-price`} className="text-sm font-medium">Unit Price ($)</Label>
                    <Input
                      id={`${type}-price`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${type}-payment`} className="text-sm font-medium">Payment Method</Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="digital">Digital Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button className="w-full h-12 text-base font-medium">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Process Sale
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentSubTab === "manage-sales" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Today's Sales</p>
                    <p className="text-xl font-bold">
                      ${type === "bar" ? "128.00" : "85.00"}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Orders</p>
                    <p className="text-xl font-bold">{salesData.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Time</p>
                    <p className="text-xl font-bold">
                      {type === "bar" ? "5m" : "15m"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sales Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      Recent {type === "bar" ? "Bar" : "Kitchen"} Sales
                    </CardTitle>
                    <CardDescription>
                      Track and manage your {type} sales transactions
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="hidden sm:table-cell">Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((sale) => (
                        <TableRow key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-medium">{sale.id}</TableCell>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell className="hidden md:table-cell">{sale.items}</TableCell>
                          <TableCell className="font-semibold">{sale.total}</TableCell>
                          <TableCell className="hidden sm:table-cell text-gray-500">
                            {sale.time}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(sale.status)}>
                              {sale.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Sales</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your bar and kitchen sales transactions</p>
      </div>

      <Tabs defaultValue="bar" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="bar" className="flex items-center gap-2 text-sm font-medium">
              <Wine className="h-4 w-4" />
              Bar Sales
            </TabsTrigger>
            <TabsTrigger value="kitchen" className="flex items-center gap-2 text-sm font-medium">
              <ChefHat className="h-4 w-4" />
              Kitchen Sales
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bar" className="space-y-0">
          {renderSalesContent("bar")}
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-0">
          {renderSalesContent("kitchen")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;