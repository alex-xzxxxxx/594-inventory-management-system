import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../core/services/api";
import { InventoryItem, Product } from "../../core/models/models";
@Component({
  selector: "app-inventory",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ` <section class="page">
    <div class="page-title">
      <div>
        <h1>Inventory</h1>
        <p>Track stock levels and perform stock movements.</p>
      </div>
    </div>
    <div class="card form-card">
      <h2>Stock Movement</h2>
      <div class="form-grid">
        <select [(ngModel)]="productId">
          <option [ngValue]="null">Select product</option>
          <option *ngFor="let p of products" [ngValue]="p.id">
            {{ p.name }} ({{ p.sku }})
          </option></select
        ><input
          type="number"
          min="1"
          placeholder="Quantity"
          [(ngModel)]="quantity"
        /><button (click)="stockIn()">Stock In</button
        ><button class="secondary" (click)="stockOut()">Stock Out</button>
      </div>
      <p class="error" *ngIf="error">{{ error }}</p>
    </div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Reorder Level</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let i of inventory">
            <td>{{ productName(i.productId) }}</td>
            <td>{{ productSku(i.productId) }}</td>
            <td>{{ i.quantity }}</td>
            <td>{{ i.reorderLevel }}</td>
            <td>
              <span class="badge" [class.warn]="i.quantity <= i.reorderLevel">{{
                i.quantity <= i.reorderLevel ? "Low Stock" : "OK"
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>`,
})
export class InventoryComponent {
  api = inject(ApiService);
  inventory: InventoryItem[] = [];
  products: Product[] = [];
  productId: number | null = null;
  quantity = 1;
  error = "";
  constructor() {
    this.load();
    this.api.products().subscribe((x) => (this.products = x));
  }
  load() {
    this.api.inventory().subscribe((x) => (this.inventory = x));
  }
  stockIn() {
    this.move(true);
  }
  stockOut() {
    this.move(false);
  }
  move(inbound: boolean) {
    if (!this.productId || this.quantity <= 0) {
      this.error = "Select a product and enter a positive quantity.";
      return;
    }
    const req = inbound
      ? this.api.stockIn(this.productId, this.quantity)
      : this.api.stockOut(this.productId, this.quantity);
    req.subscribe({
      next: () => {
        this.error = "";
        this.load();
      },
      error: (e) =>
        (this.error = e.error?.error ?? "Unable to update inventory."),
    });
  }
  productName(id: number) {
    return this.products.find((p) => p.id === id)?.name ?? "Unknown";
  }
  productSku(id: number) {
    return this.products.find((p) => p.id === id)?.sku ?? "—";
  }
}
