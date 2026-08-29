import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../core/services/api";
import { Supplier } from "../../core/models/models";
@Component({
  selector: "app-suppliers",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ` <section class="page">
    <div class="page-title">
      <div>
        <h1>Suppliers</h1>
        <p>Maintain supplier information used by purchase orders.</p>
      </div>
    </div>
    <div class="card form-card">
      <h2>Add Supplier</h2>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
      @if (success) {
        <p class="success">{{ success }}</p>
      }
      <div class="form-grid">
        <input placeholder="Company name" [(ngModel)]="form.name" /><input
          placeholder="Contact name"
          [(ngModel)]="form.contactName"
        /><input placeholder="Email" [(ngModel)]="form.email" /><input
          placeholder="Phone"
          [(ngModel)]="form.phone"
        /><button (click)="add()">Add Supplier</button>
      </div>
    </div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Phone</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of suppliers">
            <td>{{ s.name }}</td>
            <td>{{ s.contactName }}</td>
            <td>{{ s.email }}</td>
            <td>{{ s.phone }}</td>
            <td>
              <button class="danger" (click)="remove(s.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>`,
})
export class SuppliersComponent {
  api = inject(ApiService);
  suppliers: Supplier[] = [];
  error = "";
  success = "";
  form: any = { name: "", contactName: "", email: "", phone: "" };
  constructor() {
    this.load();
  }
  load() {
    this.api.suppliers().subscribe((x) => (this.suppliers = x));
  }
  add() {
    if (!this.form.name || !this.form.contactName || !this.form.email) {
      this.error = "Please complete the supplier name, contact, and email.";
      this.success = "";
      return;
    }
    this.api.createSupplier(this.form).subscribe({
      next: () => {
        this.success = "Supplier added successfully.";
        this.error = "";
        this.form = { name: "", contactName: "", email: "", phone: "" };
        this.load();
      },
      error: () => {
        this.error = "Unable to add supplier. Please try again.";
        this.success = "";
      },
    });
  }
  remove(id: number) {
    this.api.deleteSupplier(id).subscribe({
      next: () => {
        this.success = "Supplier deleted.";
        this.error = "";
        this.load();
      },
      error: () => {
        this.error = "Unable to delete supplier.";
        this.success = "";
      },
    });
  }
}
