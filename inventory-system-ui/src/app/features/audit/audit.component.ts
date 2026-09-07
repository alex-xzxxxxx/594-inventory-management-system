import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../core/services/api';
import { InventoryAuditEntry } from '../../core/models/models';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <section class="page">
      <div class="page-title">
        <div>
          <h1>Audit Log</h1>
          <p>Track changes across products, suppliers, inventory, and purchase orders.</p>
        </div>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let entry of entries">
              <td>{{ entry.timestamp | date: 'medium' }}</td>
              <td><span class="badge">{{ entry.action }}</span></td>
              <td>{{ entry.message }}</td>
            </tr>
            <tr *ngIf="!entries.length">
              <td colspan="3">No modification history recorded yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class AuditComponent {
  api = inject(ApiService);
  entries: InventoryAuditEntry[] = [];

  constructor() {
    this.api.auditTrail().subscribe((items) => {
      this.entries = [...items].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    });
  }
}
