export interface InventoryData {
  sku: string;
  productName: string;
  currentStock: number;
  targetStock: number;
  expectedSales: number;
  unitCost: number;
  allocatedBudget: number;
  leadTime: number;
  seasonMultiplier: number;
  safetyBuffer: number;
  lastUpdated: string;
}

export interface Activity {
  id: string;
  type: 'shipment' | 'order' | 'alert';
  description: string;
  timestamp: string;
  units?: number;
  status?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface ForecastPoint {
  day: number;
  actual?: number;
  predicted?: number;
  projectedStock?: number;
  isRiskZone?: boolean;
}
