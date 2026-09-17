import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { ApiService } from '../core/services/api';

describe('HomeComponent', () => {
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['products', 'suppliers', 'inventory', 'purchaseOrders', 'lowStockAlerts', 'auditTrail', 'inventorySummary']);
    apiSpy.products.and.returnValue(of([{ id: 1, sku: 'A1', name: 'Widget', category: 'Tools', unitPrice: 10, supplierId: 2 }]));
    apiSpy.suppliers.and.returnValue(of([{ id: 2, name: 'Acme', contactName: 'Alice', email: 'alice@acme.com', phone: '123' }]));
    apiSpy.inventory.and.returnValue(of([{ productId: 1, quantity: 8, reorderLevel: 5 }]));
    apiSpy.purchaseOrders.and.returnValue(of([{ id: 1, supplierId: 2, orderDate: '2026-08-28', status: 'CREATED', items: [{ productId: 1, quantity: 2 }] }]));
    apiSpy.lowStockAlerts.and.returnValue(of([{ productId: 1, quantity: 4, reorderLevel: 5 }]));
    apiSpy.auditTrail.and.returnValue(of([{ action: 'stock-in', message: 'Added 5 units', timestamp: '2026-08-28T00:00:00' }]));
    apiSpy.inventorySummary.and.returnValue(of({ totalProducts: 1, totalSuppliers: 1, totalInventoryItems: 1, totalUnits: 8, lowStockCount: 1, inventoryValue: 80, purchaseOrderCount: 1 }));

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [{ provide: ApiService, useValue: apiSpy }],
    }).compileComponents();
  });

  it('should create and load summary data', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
    expect(component.products.length).toBe(1);
    expect(component.suppliers.length).toBe(1);
    expect(component.inventory.length).toBe(1);
    expect(component.orders.length).toBe(1);
  });
});
