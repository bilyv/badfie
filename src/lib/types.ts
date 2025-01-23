export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  price: number;
  lastUpdated: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPrice: number;
}

export type ProductType = 'individual' | 'combined';

export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  type: ProductType;
  lastUpdated: string;
}

export interface IndividualProduct extends BaseProduct {
  type: 'individual';
  quantity: number;
  costPrice: number;
  sellingPrice: number;
}

export interface CombinedProduct extends BaseProduct {
  type: 'combined';
  ingredients: Ingredient[];
  sellingPrice: number;
}

export type Product = IndividualProduct | CombinedProduct;

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface BaseMenuItem {
  icon: React.ComponentType;
}

export interface RegularMenuItem extends BaseMenuItem {
  title: string;
  path: string;
}

export interface GroupedMenuItem extends BaseMenuItem {
  group: string;
  items: RegularMenuItem[];
}

export type MenuItem = RegularMenuItem | GroupedMenuItem;
