import { Card } from "@/components/ui/card";

const Expenses = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Expenses</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor your expenses</p>
      </div>
      
      <Card className="p-6">
        <p>Expenses tracking coming soon...</p>
      </Card>
    </div>
  );
};

export default Expenses;