
// Chart data for the dashboard
export const barData = [
  { month: "Jan", sales: 400, stock: 240 },
  { month: "Feb", sales: 300, stock: 139 },
  { month: "Mar", sales: 200, stock: 980 },
  { month: "Apr", sales: 278, stock: 390 },
  { month: "May", sales: 189, stock: 480 },
  { month: "Jun", sales: 239, stock: 380 },
];

export const lineData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 2000, expenses: 9800 },
  { month: "Apr", revenue: 2780, expenses: 3908 },
  { month: "May", revenue: 1890, expenses: 4800 },
  { month: "Jun", revenue: 2390, expenses: 3800 },
];

export type GraphType = {
  id: string;
  type: 'bar' | 'line';
  title: string;
  data: any[];
};

export const availableGraphs: GraphType[] = [
  {
    id: 'sales-stock',
    type: 'bar',
    title: 'Sales & Stock Overview',
    data: barData
  },
  {
    id: 'revenue-expenses',
    type: 'line',
    title: 'Revenue & Expenses Trend',
    data: lineData
  },
  {
    id: 'monthly-growth',
    type: 'line',
    title: 'Monthly Growth Rate',
    data: lineData
  },
  {
    id: 'inventory-turnover',
    type: 'bar',
    title: 'Inventory Turnover Rate',
    data: barData
  }
];
