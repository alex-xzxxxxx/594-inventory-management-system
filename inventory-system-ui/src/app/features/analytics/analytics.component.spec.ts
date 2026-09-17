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
        { id: 1, supplierId: 1, orderDate: '2026-08-01', status: 'CREATED', items: [{ productId: 1, quantity: 8 }] },
        { id: 2, supplierId: 2, orderDate: '2026-08-02', status: 'RECEIVED', items: [{ productId: 2, quantity: 5 }] },
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
});
