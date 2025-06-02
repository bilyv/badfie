
// Chart data for the restaurant dashboard
export const barData = [
  { month: "Jan", sales: 4200, orders: 340 },
  { month: "Feb", sales: 3800, orders: 290 },
  { month: "Mar", sales: 5200, orders: 420 },
  { month: "Apr", sales: 4780, orders: 390 },
  { month: "May", sales: 5890, orders: 480 },
  { month: "Jun", sales: 6390, orders: 520 },
];

export const lineData = [
  { month: "Jan", revenue: 24000, expenses: 18400 },
  { month: "Feb", revenue: 21000, expenses: 16398 },
  { month: "Mar", revenue: 28000, expenses: 19800 },
  { month: "Apr", revenue: 25780, expenses: 20908 },
  { month: "May", revenue: 31890, expenses: 21800 },
  { month: "Jun", revenue: 34390, expenses: 23800 },
];

export type GraphType = {
  id: string;
  type: 'bar' | 'line';
  title: string;
  data: any[];
};

export const availableGraphs: GraphType[] = [
  {
    id: 'sales-orders',
    type: 'bar',
    title: 'Sales & Orders Overview',
    data: barData
  },
  {
    id: 'revenue-expenses',
    type: 'line',
    title: 'Revenue & Expenses Trend',
    data: lineData
  },
  {
    id: 'monthly-performance',
    type: 'line',
    title: 'Monthly Performance',
    data: lineData
  },
  {
    id: 'customer-flow',
    type: 'bar',
    title: 'Customer Flow Analysis',
    data: barData
  }
];
