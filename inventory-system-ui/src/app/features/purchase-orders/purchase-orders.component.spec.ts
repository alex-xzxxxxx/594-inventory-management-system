import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PurchaseOrdersComponent } from './purchase-orders.component';
import { ApiService } from '../../core/services/api';

describe('PurchaseOrdersComponent', () => {
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['suppliers', 'products', 'purchaseOrders', 'createPurchaseOrder', 'receivePurchaseOrder']);
    apiSpy.suppliers.and.returnValue(of([{ id: 2, name: 'Acme', contactName: 'Alice', email: 'alice@acme.com', phone: '123' }]));
    apiSpy.products.and.returnValue(of([{ id: 1, sku: 'A1', name: 'Widget', category: 'Tools', unitPrice: 15, supplierId: 2 }]));
    apiSpy.purchaseOrders.and.returnValue(of([{ id: 9, supplierId: 2, orderDate: '2026-08-28', status: 'CREATED', items: [{ productId: 1, quantity: 2 }] }]));
    apiSpy.createPurchaseOrder.and.returnValue(of({ id: 10, supplierId: 2, orderDate: '2026-08-28', status: 'CREATED', items: [{ productId: 1, quantity: 2 }] }));
    apiSpy.receivePurchaseOrder.and.returnValue(of({ id: 9, supplierId: 2, orderDate: '2026-08-28', status: 'RECEIVED', items: [{ productId: 1, quantity: 2 }] }));

    await TestBed.configureTestingModule({
      imports: [PurchaseOrdersComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }],
    }).compileComponents();
  });

  it('should load suppliers, products, and orders on creation', () => {
    const fixture = TestBed.createComponent(PurchaseOrdersComponent);
    const component = fixture.componentInstance;

    expect(component.suppliers.length).toBe(1);
    expect(component.products.length).toBe(1);
    expect(component.orders.length).toBe(1);
    expect(component.supplierName(2)).toBe('Acme');
    expect(component.itemSummary(component.orders[0])).toContain('Widget');
  });

  it('should reject invalid order creation', () => {
    const fixture = TestBed.createComponent(PurchaseOrdersComponent);
    const component = fixture.componentInstance;

    component.supplierId = null;
    component.productId = null;
    component.quantity = 0;
    component.create();

    expect(component.error).toBe('Select a supplier, product, and positive quantity.');
  });

  it('should create an order when valid data is supplied', () => {
    const fixture = TestBed.createComponent(PurchaseOrdersComponent);
    const component = fixture.componentInstance;

    component.supplierId = 2;
    component.productId = 1;
    component.quantity = 3;
    component.create();

    expect(apiSpy.createPurchaseOrder).toHaveBeenCalledWith(2, [{ productId: 1, quantity: 3 }]);
    expect(component.error).toBe('');
  });

  it('should receive a created order', () => {
    const fixture = TestBed.createComponent(PurchaseOrdersComponent);
    const component = fixture.componentInstance;

    component.receive(9);

    expect(apiSpy.receivePurchaseOrder).toHaveBeenCalledWith(9);
  });

  it('should surface backend errors from receive', () => {
    apiSpy.receivePurchaseOrder.and.returnValue(throwError(() => ({ error: { error: 'Receive failed' } })));

    const fixture = TestBed.createComponent(PurchaseOrdersComponent);
    const component = fixture.componentInstance;

    component.receive(99);

    expect(component.error).toBe('Receive failed');
  });
});
