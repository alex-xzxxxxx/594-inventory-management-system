import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiService } from "../core/services/api";
import {
  InventoryItem,
  Product,
  PurchaseOrder,
  Supplier,
} from "../core/models/models";
@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink],
  template: ` <section class="page">
    <div class="page-title">
      <div>
        <h1>Inventory Operations</h1>
        <p>Version 1 core workflow.</p>
      </div>
    </div>
    <div class="cards">
      <div class="stat">
        <span>Products</span><b>{{ products.length }}</b>
      </div>
      <div class="stat">
        <span>Suppliers</span><b>{{ suppliers.length }}</b>
      </div>
      <div class="stat">
        <span>Inventory Items</span><b>{{ inventory.length }}</b>
      </div>
      <div class="stat">
        <span>Purchase Orders</span><b>{{ orders.length }}</b>
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
      <a class="card link-card" routerLink="/products"
        ><h3>Manage Products</h3>
        <p>Create and maintain product records.</p></a
      ><a class="card link-card" routerLink="/suppliers"
        ><h3>Manage Suppliers</h3>
        <p>Maintain supplier contacts.</p></a
      ><a class="card link-card" routerLink="/inventory"
        ><h3>Manage Inventory</h3>
        <p>Perform stock-in and stock-out.</p></a
      ><a class="card link-card" routerLink="/purchase-orders"
        ><h3>Purchase Orders</h3>
        <p>Create and receive incoming stock.</p></a
      >
    </div>
  </section>`,
})
export class HomeComponent {
  api = inject(ApiService);
  products: Product[] = [];
  suppliers: Supplier[] = [];
  inventory: InventoryItem[] = [];
  orders: PurchaseOrder[] = [];
  constructor() {
    this.api.products().subscribe((x) => (this.products = x));
    this.api.suppliers().subscribe((x) => (this.suppliers = x));
    this.api.inventory().subscribe((x) => (this.inventory = x));
    this.api.purchaseOrders().subscribe((x) => (this.orders = x));
  }
}
