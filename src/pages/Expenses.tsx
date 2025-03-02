
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Check, Plus, FileText, AlertCircle, BarChart2, PieChart as PieChartIcon, Filter } from "lucide-react";

const EXPENSE_CATEGORIES = [
  { value: "utilities", label: "Utilities" },
  { value: "rent", label: "Rent" },
  { value: "supplies", label: "Supplies" },
  { value: "salary", label: "Salary" },
  { value: "marketing", label: "Marketing" },
  { value: "transportation", label: "Transportation" },
  { value: "insurance", label: "Insurance" },
  { value: "other", label: "Other" },
];

const SAMPLE_EXPENSES = [
  { id: 1, date: "2023-05-15", category: "Rent", amount: 1200, description: "Office rent May 2023" },
  { id: 2, date: "2023-05-10", category: "Utilities", amount: 250, description: "Electricity bill" },
  { id: 3, date: "2023-05-08", category: "Supplies", amount: 175, description: "Office supplies" },
  { id: 4, date: "2023-05-05", category: "Salary", amount: 4500, description: "Employee salaries" },
  { id: 5, date: "2023-05-03", category: "Marketing", amount: 800, description: "Facebook ads" },
];

const MONTHLY_EXPENSE_DATA = [
  { month: "Jan", amount: 5200 },
  { month: "Feb", amount: 4500 },
  { month: "Mar", amount: 6100 },
  { month: "Apr", amount: 5700 },
  { month: "May", amount: 6900 },
];

const EXPENSE_BY_CATEGORY = [
  { name: "Rent", value: 3600 },
  { name: "Utilities", value: 720 },
  { name: "Supplies", value: 890 },
  { name: "Salary", value: 13500 },
  { name: "Marketing", value: 2400 },
  { name: "Other", value: 1100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const Expenses = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [viewType, setViewType] = useState("bar");
  const { toast } = useToast();

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !date) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Expense added",
      description: "The expense has been successfully recorded",
      variant: "default",
    });
    
    // Reset form
    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Expenses
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitor and manage your business expenses
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses (This Month)</p>
              <h2 className="text-2xl font-bold">$6,900</h2>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Check size={14} /> Within budget
            </span>
          </p>
        </Card>
        
        <Card className="p-4 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Highest Category</p>
              <h2 className="text-2xl font-bold">Salary</h2>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <PieChartIcon className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">$13,500 (58% of total)</p>
        </Card>
        
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recent Expense</p>
              <h2 className="text-xl font-bold">Office Rent</h2>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">$1,200 on May 15, 2023</p>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Expense List</TabsTrigger>
          <TabsTrigger value="add">Add Expense</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-4">
              <h3 className="text-lg font-medium">Recent Expenses</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_EXPENSES.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-right font-medium">${expense.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card className="p-6">
            <form className="space-y-4" onSubmit={handleAddExpense}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="Enter amount" 
                      className="pl-7"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Enter description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Enter any additional details" 
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline">Clear</Button>
                <Button type="submit">Add Expense</Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-medium">Expense Overview</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant={viewType === "bar" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setViewType("bar")}
                  >
                    <BarChart2 className="h-4 w-4 mr-1" />
                    Bar Chart
                  </Button>
                  <Button 
                    variant={viewType === "pie" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setViewType("pie")}
                  >
                    <PieChartIcon className="h-4 w-4 mr-1" />
                    Pie Chart
                  </Button>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                {viewType === "bar" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_EXPENSE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Bar dataKey="amount" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={EXPENSE_BY_CATEGORY}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {EXPENSE_BY_CATEGORY.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="space-y-1">
                    <h4 className="font-medium">Date Range</h4>
                    <p className="text-sm text-muted-foreground">May 1, 2023 - May 31, 2023</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">This Month</Button>
                    <Button variant="outline" size="sm">Last Month</Button>
                    <Button variant="outline" size="sm">Custom</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold">$22,210</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Average</p>
                    <p className="text-lg font-bold">$4,442</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Highest</p>
                    <p className="text-lg font-bold">$6,900</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Lowest</p>
                    <p className="text-lg font-bold">$4,500</p>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" className="gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Export PDF</span>
                </Button>
                <Button variant="outline" className="gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Export Excel</span>
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Expense Categories</h3>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </Button>
              </div>
              <div className="grid gap-4">
                {EXPENSE_CATEGORIES.map((category) => (
                  <div
                    key={category.value}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <span>{category.label}</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;
