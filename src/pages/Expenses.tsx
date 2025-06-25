
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  DollarSign,
  Plus,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Receipt
} from "lucide-react";

const EXPENSE_CATEGORIES = [
  { value: "food-supplies", label: "Food & Supplies", color: "bg-blue-100 text-blue-800" },
  { value: "utilities", label: "Utilities", color: "bg-green-100 text-green-800" },
  { value: "rent", label: "Rent & Lease", color: "bg-purple-100 text-purple-800" },
  { value: "staff", label: "Staff & Payroll", color: "bg-orange-100 text-orange-800" },
  { value: "equipment", label: "Equipment", color: "bg-red-100 text-red-800" },
  { value: "marketing", label: "Marketing", color: "bg-pink-100 text-pink-800" },
  { value: "maintenance", label: "Maintenance", color: "bg-yellow-100 text-yellow-800" },
  { value: "insurance", label: "Insurance", color: "bg-indigo-100 text-indigo-800" },
  { value: "other", label: "Other", color: "bg-gray-100 text-gray-800" },
];

const SAMPLE_EXPENSES = [
  {
    id: 1,
    date: "2024-12-25",
    category: "Food & Supplies",
    amount: 1250,
    description: "Fresh ingredients and beverages",
    paymentMethod: "Card",
    status: "Paid"
  },
  {
    id: 2,
    date: "2024-12-24",
    category: "Utilities",
    amount: 380,
    description: "Electricity and water bill",
    paymentMethod: "Bank Transfer",
    status: "Paid"
  },
  {
    id: 3,
    date: "2024-12-23",
    category: "Staff & Payroll",
    amount: 2800,
    description: "Weekly staff wages",
    paymentMethod: "Bank Transfer",
    status: "Paid"
  },
  {
    id: 4,
    date: "2024-12-22",
    category: "Equipment",
    amount: 450,
    description: "Kitchen equipment repair",
    paymentMethod: "Cash",
    status: "Pending"
  },
  {
    id: 5,
    date: "2024-12-21",
    category: "Marketing",
    amount: 200,
    description: "Social media advertising",
    paymentMethod: "Card",
    status: "Paid"
  },
];

const Expenses = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
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
      title: "Expense added successfully! 💰",
      description: `${category} expense of $${amount} has been recorded`,
      variant: "default",
    });

    // Reset form
    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
    setPaymentMethod("");
    setNotes("");
  };

  const getCategoryColor = (categoryName: string) => {
    const category = EXPENSE_CATEGORIES.find(cat => cat.label === categoryName);
    return category?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Overdue": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const totalExpenses = SAMPLE_EXPENSES.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = SAMPLE_EXPENSES.filter(expense => expense.status === "Paid").length;
  const pendingExpenses = SAMPLE_EXPENSES.filter(expense => expense.status === "Pending").length;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Expenses
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track and manage your restaurant expenses efficiently
        </p>
      </div>

      {/* Stats Overview - Only show on list tab */}
      {activeTab === "list" && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Expenses</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  ${totalExpenses.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Paid Expenses</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{paidExpenses}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Out of {SAMPLE_EXPENSES.length} total</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{pendingExpenses}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">Awaiting payment</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg. Daily</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  ${Math.round(totalExpenses / 30).toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">This month</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 h-12">
            <TabsTrigger value="list" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Expense List
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2 text-sm font-medium">
              <Plus className="h-4 w-4" />
              Add Expense
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 text-sm font-medium">
              <Receipt className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Expenses
                  </CardTitle>
                  <CardDescription>
                    Track and manage all your restaurant expenses
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search expenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden lg:table-cell">Payment</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SAMPLE_EXPENSES.map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                            {/* Show status on mobile as a small badge under date */}
                            <div className="md:hidden mt-1">
                              <Badge className={`${getStatusColor(expense.status)} text-xs`}>
                                {expense.status}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <Badge className={getCategoryColor(expense.category)}>
                              {expense.category}
                            </Badge>
                            {/* Show description on mobile as small text under category */}
                            <span className="md:hidden text-xs text-gray-500 mt-1 truncate max-w-[120px]">
                              {expense.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {expense.description}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {expense.paymentMethod}
                        </TableCell>
                        <TableCell className="font-semibold">
                          <div className="flex flex-col">
                            <span>${expense.amount.toLocaleString()}</span>
                            {/* Show payment method on mobile as small text under amount */}
                            <span className="lg:hidden text-xs text-gray-500 mt-1">
                              {expense.paymentMethod}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={getStatusColor(expense.status)}>
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Add New Expense</CardTitle>
                <CardDescription>
                  Record a new expense for your restaurant operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleAddExpense}>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-medium">Amount *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-10 h-11"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPENSE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        className="h-11"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-method" className="text-sm font-medium">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of the expense"
                      className="h-11"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional details or notes about this expense"
                      className="min-h-[100px]"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => {
                        setAmount("");
                        setCategory("");
                        setDate("");
                        setDescription("");
                        setPaymentMethod("");
                        setNotes("");
                      }}
                    >
                      Clear Form
                    </Button>
                    <Button type="submit" className="flex-1 h-12 text-base font-medium">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Expense
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Expense Categories
                  </CardTitle>
                  <CardDescription>
                    Manage and organize your expense categories
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {EXPENSE_CATEGORIES.map((category) => (
                  <Card key={category.value} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={category.color}>
                        {category.label}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Used in {Math.floor(Math.random() * 10) + 1} expenses
                      </p>
                      <p className="text-lg font-semibold">
                        ${(Math.random() * 5000 + 500).toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">Total spent</p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-4">Quick Stats</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{EXPENSE_CATEGORIES.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Categories</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {EXPENSE_CATEGORIES.filter(cat => cat.label.includes('&')).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Most Used</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">$5,080</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg. per Category</p>
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

export default Expenses;
