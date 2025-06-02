
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";

const KitchenManagement = () => {
  const [orders] = useState([
    { id: 1, table: "Table 5", items: ["Caesar Salad", "Grilled Salmon"], status: "preparing", time: "15 min" },
    { id: 2, table: "Table 12", items: ["Beef Wellington", "Mushroom Risotto"], status: "ready", time: "Ready" },
    { id: 3, table: "Table 3", items: ["Fish & Chips", "Garden Salad"], status: "pending", time: "5 min" },
    { id: 4, table: "Table 8", items: ["Pasta Carbonara"], status: "preparing", time: "8 min" },
  ]);

  const [ingredients] = useState([
    { id: 1, name: "Fresh Salmon", stock: 12, unit: "portions", minStock: 5 },
    { id: 2, name: "Organic Tomatoes", stock: 3, unit: "kg", minStock: 5 },
    { id: 3, name: "Parmesan Cheese", stock: 8, unit: "blocks", minStock: 3 },
    { id: 4, name: "Olive Oil", stock: 15, unit: "bottles", minStock: 4 },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-green-500";
      case "preparing": return "bg-yellow-500";
      case "pending": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const lowStockIngredients = ingredients.filter(ingredient => ingredient.stock <= ingredient.minStock);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            Kitchen Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage orders, inventory, and kitchen operations
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Manual Order
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">In queue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready to Serve</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(order => order.status === "ready").length}
            </div>
            <p className="text-xs text-muted-foreground">Orders completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparing</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(order => order.status === "preparing").length}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockIngredients.length}</div>
            <p className="text-xs text-muted-foreground">Ingredients low</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>Current orders in the kitchen queue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                      <div>
                        <h3 className="font-semibold">{order.table}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.items.join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={order.status === "ready" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                      <span className="text-sm font-medium">{order.time}</span>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ingredients Inventory</CardTitle>
              <CardDescription>Current stock levels for key ingredients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{ingredient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ingredient.stock} {ingredient.unit} available
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {ingredient.stock <= ingredient.minStock && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Restock
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Management</CardTitle>
              <CardDescription>Manage your restaurant menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Caesar Salad</h3>
                      <p className="text-sm text-muted-foreground">Fresh romaine lettuce with caesar dressing</p>
                      <p className="font-medium">£8.50</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="default">Available</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Grilled Salmon</h3>
                      <p className="text-sm text-muted-foreground">Fresh Atlantic salmon with herbs</p>
                      <p className="font-medium">£18.50</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="destructive">Out of Stock</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Beef Wellington</h3>
                      <p className="text-sm text-muted-foreground">Premium beef wrapped in pastry</p>
                      <p className="font-medium">£28.50</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="default">Available</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KitchenManagement;
