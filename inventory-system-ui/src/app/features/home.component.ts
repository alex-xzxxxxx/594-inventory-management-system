import { Component, inject } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ApiService } from "../core/services/api";
import {
  InventoryAuditEntry,
  InventoryItem,
  InventorySummary,
  Product,
  PurchaseOrder,
  Supplier,
} from "../core/models/models";
@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: ` <section class="page">
    <div class="page-title">
      <div>
        <h1>Inventory Operations</h1>
        <p>Version 2 monitoring, alerts, and audit trail.</p>
      </div>
    </div>
    <div class="cards">
      <div class="stat">
        <span>Products</span><b>{{ summary.totalProducts || products.length }}</b>
      </div>
      <div class="stat">
        <span>Suppliers</span><b>{{ summary.totalSuppliers || suppliers.length }}</b>
      </div>
      <div class="stat">
        <span>Total Units</span><b>{{ summary.totalUnits || getTotalUnits() }}</b>
      </div>
      <div class="stat">
        <span>Low Stock</span><b>{{ summary.lowStockCount || alerts.length }}</b>
      </div>
    </div>
    <div class="card">
      <h2>Business workflow</h2>
      <div class="workflow">
        <span>Supplier</span><i>→</i><span>Product</span><i>→</i
        ><span>Purchase Order</span><i>→</i><span>Receive</span><i>→</i
        ><span>Inventory</span>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <h3>Inventory snapshot</h3>
        <p><strong>{{ summary.inventoryValue || 0 | currency }}</strong> inventory value</p>
        <p>{{ summary.totalInventoryItems || inventory.length }} tracked items</p>
        <p>{{ summary.purchaseOrderCount || orders.length }} purchase orders</p>
      </div>
      <div class="card">
        <h3>Low-stock alerts</h3>
        <ul class="alert-list">
          <li *ngFor="let item of alerts">
            Product {{ item.productId }}: {{ item.quantity }} units (reorder at {{ item.reorderLevel }})
          </li>
          <li *ngIf="!alerts.length">No items currently below reorder threshold.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Recent audit trail</h3>
        <ul class="alert-list">
          <li *ngFor="let entry of auditTrail.slice(0, 5)">{{ entry.action }} — {{ entry.message }}</li>
          <li *ngIf="!auditTrail.length">No audit entries recorded yet.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Quick actions</h3>
        <div class="workflow compact">
          <a routerLink="/products">Products</a>
          <a routerLink="/suppliers">Suppliers</a>
          <a routerLink="/inventory">Inventory</a>
          <a routerLink="/purchase-orders">Orders</a>
        </div>
      </div>
    </div>
  </section>`,
})
export class HomeComponent {
  api = inject(ApiService);
  products: Product[] = [];
  suppliers: Supplier[] = [];
  inventory: InventoryItem[] = [];
  orders: PurchaseOrder[] = [];
  alerts: InventoryItem[] = [];
  auditTrail: InventoryAuditEntry[] = [];
  summary: InventorySummary = {
    totalProducts: 0,
    totalSuppliers: 0,
    totalInventoryItems: 0,
    totalUnits: 0,
    lowStockCount: 0,
    inventoryValue: 0,
    purchaseOrderCount: 0,
  };
  constructor() {
    this.api.products().subscribe((x) => (this.products = x));
    this.api.suppliers().subscribe((x) => (this.suppliers = x));
    this.api.inventory().subscribe((x) => (this.inventory = x));
    this.api.purchaseOrders().subscribe((x) => (this.orders = x));
    this.api.lowStockAlerts().subscribe((x) => (this.alerts = x));
    this.api.auditTrail().subscribe((x) => (this.auditTrail = x));
    this.api.inventorySummary().subscribe((x) => (this.summary = x));
  }
  getTotalUnits() {
    return this.inventory.reduce((sum, item) => sum + item.quantity, 0);
  }
}
