import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AnalyticsComponent } from './analytics.component';
import { ApiService } from '../../core/services/api';

describe('AnalyticsComponent', () => {
  let fixture: ComponentFixture<AnalyticsComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['inventorySummary', 'lowStockAlerts', 'purchaseOrders']);
    apiSpy.inventorySummary.and.returnValue(
      of({
        totalProducts: 8,
        totalSuppliers: 3,
        totalInventoryItems: 4,
        totalUnits: 120,
        lowStockCount: 2,
        inventoryValue: 4600,
        purchaseOrderCount: 6,
      }),
    );
    apiSpy.lowStockAlerts.and.returnValue(
      of([
        { productId: 1, quantity: 3, reorderLevel: 5 },
        { productId: 2, quantity: 2, reorderLevel: 4 },
      ]),
    );
    apiSpy.purchaseOrders.and.returnValue(
      of([
        {
          id: 1,
          supplierId: 1,
          orderDate: '2026-07-15',
          status: 'RECEIVED',
          items: [
            { productId: 1, quantity: 20 },
            { productId: 2, quantity: 30 },
          ],
        },
        {
          id: 2,
          supplierId: 2,
          orderDate: '2026-08-01',
          status: 'RECEIVED',
          items: [
            { productId: 3, quantity: 50 },
            { productId: 4, quantity: 60 },
          ],
        },
        {
          id: 3,
          supplierId: 3,
          orderDate: '2026-08-15',
          status: 'CREATED',
          items: [
            { productId: 5, quantity: 12 },
            { productId: 6, quantity: 18 },
          ],
        },
        {
          id: 4,
          supplierId: 4,
          orderDate: '2026-09-01',
          status: 'RECEIVED',
          items: [
            { productId: 7, quantity: 25 },
            { productId: 8, quantity: 10 },
          ],
        },
      ]),
    );

    await TestBed.configureTestingModule({
      imports: [AnalyticsComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    fixture.detectChanges();
  });

  it('should create and render analytics metrics', () => {
    expect(fixture.componentInstance).toBeTruthy();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Inventory value');
    expect(text).toContain('Low-stock items');
    expect(text).toContain('Order volume');
  });

  it('sums units across all purchase orders and charts their actual months', () => {
    expect(fixture.componentInstance.getOrderVolume()).toBe(225);
    expect(fixture.componentInstance.monthOrderTotals).toEqual([
      { label: 'Jul 2026', value: 50 },
      { label: 'Aug 2026', value: 140 },
      { label: 'Sep 2026', value: 35 },
    ]);
  });
});
