import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Tax = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Tax Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure and manage tax settings</p>
      </div>
      
      <Tabs defaultValue="add-tax" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:max-w-[600px]">
          <TabsTrigger value="add-tax">Add Tax</TabsTrigger>
          <TabsTrigger value="tax-rates">Tax Rates</TabsTrigger>
          <TabsTrigger value="tax-reports">Tax Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="add-tax" className="mt-6">
          <Card className="p-6">
            <form className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-name">Tax Name</Label>
                  <Input id="tax-name" placeholder="Enter tax name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" placeholder="Enter tax rate" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-description">Description</Label>
                  <Input id="tax-description" placeholder="Enter tax description" />
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto">Add Tax</Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="tax-rates" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Tax Rates</h3>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Standard VAT</h4>
                    <p className="text-sm text-gray-500">20% on most goods and services</p>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Reduced Rate</h4>
                    <p className="text-sm text-gray-500">5% on specific items</p>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tax-reports" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tax Reports</h3>
              <div className="grid gap-4">
                <Button variant="outline" className="justify-start">
                  <span>Monthly Tax Report - March 2024</span>
                </Button>
                <Button variant="outline" className="justify-start">
                  <span>Quarterly Tax Report - Q1 2024</span>
                </Button>
                <Button variant="outline" className="justify-start">
                  <span>Annual Tax Report - 2023</span>
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tax;