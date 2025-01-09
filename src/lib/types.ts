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
}

export type ProductType = 'individual' | 'combined';

export interface BaseProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  type: ProductType;
  lastUpdated: string;
}

export interface IndividualProduct extends BaseProduct {
  type: 'individual';
  quantity: number;
}

export interface CombinedProduct extends BaseProduct {
  type: 'combined';
  ingredients: Ingredient[];
}

export type Product = IndividualProduct | CombinedProduct;

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}