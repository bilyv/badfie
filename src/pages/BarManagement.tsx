
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wine, Plus, TrendingUp, AlertTriangle } from "lucide-react";

const BarManagement = () => {
  const [drinks] = useState([
    { id: 1, name: "House Wine Red", category: "Wine", stock: 24, minStock: 10, price: 8.50 },
    { id: 2, name: "Premium Whiskey", category: "Spirits", stock: 6, minStock: 8, price: 12.00 },
    { id: 3, name: "Craft Beer IPA", category: "Beer", stock: 48, minStock: 20, price: 6.50 },
    { id: 4, name: "Classic Martini", category: "Cocktails", stock: 15, minStock: 5, price: 11.00 },
  ]);

  const lowStockItems = drinks.filter(drink => drink.stock <= drink.minStock);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Wine className="h-8 w-8 text-primary" />
            Bar Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your bar inventory, drinks menu, and stock levels
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Drink
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drinks</CardTitle>
            <Wine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drinks.length}</div>
            <p className="text-xs text-muted-foreground">Active menu items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">£342.50</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Drinks Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Drinks Inventory</CardTitle>
          <CardDescription>Current stock levels and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {drinks.map((drink) => (
              <div key={drink.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold">{drink.name}</h3>
                    <p className="text-sm text-muted-foreground">{drink.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">£{drink.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Stock: {drink.stock}</span>
                      {drink.stock <= drink.minStock && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarManagement;
