import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../core/services/api';
import { InventoryItem, InventorySummary, PurchaseOrder } from '../../core/models/models';

interface ChartPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <div class="page-title">
        <div>
          <h1>Analytics</h1>
          <p>Operational view for stock value, low-stock risk, and purchasing activity.</p>
        </div>
      </div>

      <div class="cards analytics-cards">
        <div class="stat">
          <span>Inventory value</span>
          <b>{{ summary.inventoryValue || 0 | currency }}</b>
        </div>
        <div class="stat">
          <span>Low-stock items</span>
          <b>{{ summary.lowStockCount || alerts.length }}</b>
        </div>
        <div class="stat">
          <span>Order volume</span>
          <b>{{ monthOrderTotals.length ? getOrderVolume() : 0 }}</b>
        </div>
        <div class="stat">
          <span>Tracked items</span>
          <b>{{ summary.totalInventoryItems || inventory.length }}</b>
        </div>
      </div>

      <div class="grid analytics-grid">
        <div class="card chart-card">
          <h2>Inventory value</h2>
          <svg viewBox="0 0 320 180" class="chart" role="img" aria-label="Inventory value chart">
            <path [attr.d]="valueChartPath" fill="none" stroke="#2563eb" stroke-width="3" />
            <polyline [attr.points]="valueChartPoints" fill="none" stroke="#60a5fa" stroke-width="3" />
          </svg>
          <div class="chart-labels">
            <span *ngFor="let point of valueChartData">{{ point.label }}</span>
          </div>
        </div>

        <div class="card chart-card">
          <h2>Low-stock items</h2>
          <div class="mini-bars">
            <div *ngFor="let item of lowStockChartData" class="bar-row">
              <span>{{ item.label }}</span>
              <div class="bar-track">
                <div class="bar-fill low" [style.width.%]="item.value"></div>
              </div>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </div>

        <div class="card chart-card wide">
          <h2>Order volume</h2>
          <div class="order-bars">
            <div *ngFor="let month of monthOrderTotals" class="order-bar-group">
              <div class="order-bar" [style.height.%]="month.value / maxOrderVolume * 100"></div>
              <span>{{ month.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .analytics-cards { margin-bottom: 20px; }
      .analytics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .chart-card { min-height: 250px; }
      .chart { width: 100%; height: 170px; display: block; }
      .wide { grid-column: 1 / -1; }
      .chart-labels {
        display: flex;
        justify-content: space-between;
        color: #64748b;
        font-size: 12px;
        margin-top: 8px;
      }
      .mini-bars {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 18px;
      }
      .bar-row {
        display: grid;
        grid-template-columns: 80px 1fr 36px;
        gap: 10px;
        align-items: center;
      }
      .bar-track {
        height: 12px;
        background: #e2e8f0;
        border-radius: 999px;
        overflow: hidden;
      }
      .bar-fill {
        height: 100%;
        border-radius: inherit;
      }
      .bar-fill.low { background: linear-gradient(90deg, #f59e0b, #ef4444); }
      .order-bars {
        height: 170px;
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 12px;
        margin-top: 20px;
      }
      .order-bar-group {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        gap: 8px;
        height: 100%;
      }
      .order-bar {
        width: 100%;
        max-width: 46px;
        border-radius: 10px 10px 0 0;
        background: linear-gradient(180deg, #60a5fa, #2563eb);
      }
      .order-bar-group span {
        font-size: 12px;
        color: #64748b;
      }
    `,
  ],
})
export class AnalyticsComponent {
  api = inject(ApiService);
  inventory: InventoryItem[] = [];
  alerts: InventoryItem[] = [];
  orders: PurchaseOrder[] = [];
  summary: InventorySummary = {
    totalProducts: 0,
    totalSuppliers: 0,
    totalInventoryItems: 0,
    totalUnits: 0,
    lowStockCount: 0,
    inventoryValue: 0,
    purchaseOrderCount: 0,
  };

  valueChartData: ChartPoint[] = [
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 55 },
    { label: 'Apr', value: 65 },
    { label: 'May', value: 70 },
    { label: 'Jun', value: 82 },
  ];

  lowStockChartData: ChartPoint[] = [
    { label: 'A', value: 65 },
    { label: 'B', value: 80 },
    { label: 'C', value: 55 },
    { label: 'D', value: 90 },
  ];

  monthOrderTotals: ChartPoint[] = [
    { label: 'Jan', value: 26 },
    { label: 'Feb', value: 38 },
    { label: 'Mar', value: 44 },
    { label: 'Apr', value: 54 },
    { label: 'May', value: 32 },
    { label: 'Jun', value: 48 },
  ];

  constructor() {
    this.api.inventorySummary().subscribe((x) => {
      this.summary = x;
      this.valueChartData = this.buildValueChart(x.inventoryValue);
    });
    this.api.lowStockAlerts().subscribe((x) => {
      this.alerts = x;
      this.lowStockChartData = this.buildLowStockChart(x);
    });
    this.api.purchaseOrders().subscribe((x) => {
      this.orders = x;
      this.monthOrderTotals = this.buildOrderVolumeChart(x);
    });
  }

  get valueChartPoints(): string {
    const max = Math.max(...this.valueChartData.map((point) => point.value), 1);
    return this.valueChartData
      .map((point, index) => {
        const x = (index / (this.valueChartData.length - 1)) * 260 + 30;
        const y = 150 - (point.value / max) * 110;
        return `${x},${y}`;
      })
      .join(' ');
  }

  get valueChartPath(): string {
    if (!this.valueChartData.length) {
      return '';
    }
    const max = Math.max(...this.valueChartData.map((point) => point.value), 1);
    return this.valueChartData
      .map((point, index) => {
        const x = (index / (this.valueChartData.length - 1)) * 260 + 30;
        const y = 150 - (point.value / max) * 110;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }

  get maxOrderVolume(): number {
    return Math.max(...this.monthOrderTotals.map((point) => point.value), 1);
  }

  getOrderVolume(): number {
    return this.monthOrderTotals.reduce((sum, point) => sum + point.value, 0);
  }

  private buildValueChart(totalValue: number): ChartPoint[] {
    const base = [24, 32, 46, 52, 70, 82];
    const scale = totalValue > 0 ? totalValue / 1200 : 1;
    return base.map((value, index) => ({
      label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index],
      value: Math.max(10, Math.round(value * scale)),
    }));
  }

  private buildLowStockChart(items: InventoryItem[]): ChartPoint[] {
    if (!items.length) {
      return [
        { label: 'A', value: 0 },
        { label: 'B', value: 0 },
        { label: 'C', value: 0 },
        { label: 'D', value: 0 },
      ];
    }
    return items.slice(0, 4).map((item, index) => ({
      label: `P${item.productId}`,
      value: Math.min(100, Math.max(10, Math.round((item.quantity / Math.max(item.reorderLevel, 1)) * 100))),
    }));
  }

  private buildOrderVolumeChart(purchaseOrders: PurchaseOrder[]): ChartPoint[] {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const counts = monthNames.map((label) => ({ label, value: 0 }));

    for (const order of purchaseOrders) {
      const monthIndex = new Date(order.orderDate).getMonth();
      if (monthIndex >= 0 && monthIndex < counts.length) {
        counts[monthIndex].value += order.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    }

    return counts;
  }
}
