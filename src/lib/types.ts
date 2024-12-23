export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  price: number;
  lastUpdated: string;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}