import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../core/services/api";
import { Product, Supplier } from "../../core/models/models";
@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ` <section class="page">
    <div class="page-title">
      <div>
        <h1>Products</h1>
        <p>Maintain the products stored in the warehouse.</p>
      </div>
    </div>
    <div class="card form-card">
      <h2>Add Product</h2>
      <div class="form-grid">
        <input placeholder="SKU" [(ngModel)]="form.sku" /><input
          placeholder="Product name"
          [(ngModel)]="form.name"
        /><input placeholder="Category" [(ngModel)]="form.category" /><input
          type="number"
          placeholder="Unit price"
          [(ngModel)]="form.unitPrice"
        /><select [(ngModel)]="form.supplierId">
          <option [ngValue]="null">Supplier</option>
          <option *ngFor="let s of suppliers" [ngValue]="s.id">
            {{ s.name }}
          </option></select
        ><button (click)="add()">Add Product</button>
      </div>
    </div>
    <div class="card">
      <input
        class="search"
        placeholder="Search by SKU, name, category"
        [(ngModel)]="query"
        (input)="load()"
      />
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Supplier</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of products">
            <td>{{ p.sku }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.category }}</td>
            <td>{{ p.unitPrice | currency }}</td>
            <td>{{ supplierName(p.supplierId) }}</td>
            <td>
              <button class="danger" (click)="remove(p.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>`,
})
export class ProductsComponent {
  api = inject(ApiService);
  products: Product[] = [];
  suppliers: Supplier[] = [];
  query = "";
  form: any = {
    sku: "",
    name: "",
    category: "",
    unitPrice: 0,
    supplierId: null,
  };
  constructor() {
    this.api.suppliers().subscribe((x) => (this.suppliers = x));
    this.load();
  }
  load() {
    this.api.products(this.query).subscribe((x) => (this.products = x));
  }
  add() {
    if (!this.form.sku || !this.form.name || !this.form.category) return;
    this.api.createProduct(this.form).subscribe(() => {
      this.form = {
        sku: "",
        name: "",
        category: "",
        unitPrice: 0,
        supplierId: null,
      };
      this.load();
    });
  }
  remove(id: number) {
    this.api.deleteProduct(id).subscribe(() => this.load());
  }
  supplierName(id: number | null) {
    return this.suppliers.find((s) => s.id === id)?.name ?? "—";
  }
}
