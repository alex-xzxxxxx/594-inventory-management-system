import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../core/services/api";
import { Product, PurchaseOrder, Supplier } from "../../core/models/models";
@Component({
  selector: "app-purchase-orders",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ` <section class="page">
    <div class="page-title">
      <div>
        <h1>Purchase Orders</h1>
        <p>Create purchase orders and receive incoming inventory.</p>
      </div>
    </div>
    <div class="card form-card">
      <h2>Create Purchase Order</h2>
      <div class="form-grid">
        <select [(ngModel)]="supplierId">
          <option [ngValue]="null">Select supplier</option>
          <option *ngFor="let s of suppliers" [ngValue]="s.id">
            {{ s.name }}
          </option></select
        ><select [(ngModel)]="productId">
          <option [ngValue]="null">Select product</option>
          <option *ngFor="let p of products" [ngValue]="p.id">
            {{ p.name }}
          </option></select
        ><input
          type="number"
          min="1"
          placeholder="Quantity"
          [(ngModel)]="quantity"
        /><button (click)="create()">Create Order</button>
      </div>
      <p class="error" *ngIf="error">{{ error }}</p>
    </div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>PO</th>
            <th>Supplier</th>
            <th>Order Date</th>
            <th>Items</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let po of orders">
            <td>PO-{{ po.id }}</td>
            <td>{{ supplierName(po.supplierId) }}</td>
            <td>{{ po.orderDate }}</td>
            <td>{{ itemSummary(po) }}</td>
            <td>
              <span class="badge" [class.warn]="po.status === 'CREATED'">{{
                po.status
              }}</span>
            </td>
            <td>
              <button *ngIf="po.status === 'CREATED'" (click)="receive(po.id)">
                Receive
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>`,
})
export class PurchaseOrdersComponent {
  api = inject(ApiService);
  orders: PurchaseOrder[] = [];
  suppliers: Supplier[] = [];
  products: Product[] = [];
  supplierId: number | null = null;
  productId: number | null = null;
  quantity = 1;
  error = "";
  constructor() {
    this.load();
    this.api.suppliers().subscribe((x) => (this.suppliers = x));
    this.api.products().subscribe((x) => (this.products = x));
  }
  load() {
    this.api.purchaseOrders().subscribe((x) => (this.orders = x));
  }
  create() {
    if (!this.supplierId || !this.productId || this.quantity <= 0) {
      this.error = "Select a supplier, product, and positive quantity.";
      return;
    }
    this.api
      .createPurchaseOrder(this.supplierId, [
        { productId: this.productId, quantity: this.quantity },
      ])
      .subscribe({
        next: () => {
          this.error = "";
          this.load();
        },
        error: (e) =>
          (this.error = e.error?.error ?? "Unable to create order."),
      });
  }
  receive(id: number) {
    this.api
      .receivePurchaseOrder(id)
      .subscribe({
        next: () => this.load(),
        error: (e) =>
          (this.error = e.error?.error ?? "Unable to receive order."),
      });
  }
  supplierName(id: number) {
    return this.suppliers.find((s) => s.id === id)?.name ?? "Unknown";
  }
  itemSummary(po: PurchaseOrder) {
    return po.items
      .map(
        (i) =>
          `${this.products.find((p) => p.id === i.productId)?.name ?? "Product"} x ${i.quantity}`,
      )
      .join(", ");
  }
}
