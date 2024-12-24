import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { name: 'Jan', sales: 4000, expenses: 2400 },
  { name: 'Feb', sales: 3000, expenses: 1398 },
  { name: 'Mar', sales: 2000, expenses: 9800 },
  { name: 'Apr', sales: 2780, expenses: 3908 },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and analyze business reports</p>
      </div>
      
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:max-w-[800px]">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-6">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Sales Overview</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline">Download PDF</Button>
                <Button variant="outline">Export Excel</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Inventory Status</h3>
              <div className="grid gap-4">
                <Button variant="outline" className="justify-start">Stock Level Report</Button>
                <Button variant="outline" className="justify-start">Low Stock Alert Report</Button>
                <Button variant="outline" className="justify-start">Product Movement Report</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Financial Reports</h3>
              <div className="grid gap-4">
                <Button variant="outline" className="justify-start">Profit & Loss Statement</Button>
                <Button variant="outline" className="justify-start">Balance Sheet</Button>
                <Button variant="outline" className="justify-start">Cash Flow Statement</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Custom Reports</h3>
              <p className="text-sm text-gray-500">Create and manage custom reports based on your needs</p>
              <Button>Create New Report</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;