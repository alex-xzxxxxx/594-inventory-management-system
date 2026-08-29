export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  supplierId: number | null;
}
export interface Supplier {
  id: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
}
export interface InventoryItem {
  productId: number;
  quantity: number;
  reorderLevel: number;
}
export interface PurchaseOrderItem {
  productId: number;
  quantity: number;
}
export type PurchaseOrderStatus = "CREATED" | "RECEIVED";
export interface PurchaseOrder {
  id: number;
  supplierId: number;
  orderDate: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
}
export interface LoginResponse {
  authenticated: boolean;
  username: string | null;
  message: string;
}
export interface InventorySummary {
  totalProducts: number;
  totalSuppliers: number;
  totalInventoryItems: number;
  totalUnits: number;
  lowStockCount: number;
  inventoryValue: number;
  purchaseOrderCount: number;
}
export interface InventoryAuditEntry {
  action: string;
  message: string;
  timestamp: string;
}
