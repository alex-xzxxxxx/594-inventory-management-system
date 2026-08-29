import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { InventoryComponent } from './inventory.component';
import { ApiService } from '../../core/services/api';

describe('InventoryComponent', () => {
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['inventory', 'products', 'stockIn', 'stockOut']);
    apiSpy.inventory.and.returnValue(of([{ productId: 1, quantity: 8, reorderLevel: 5 }]));
    apiSpy.products.and.returnValue(of([{ id: 1, sku: 'A1', name: 'Widget', category: 'Tools', unitPrice: 15, supplierId: 1 }]));
    apiSpy.stockIn.and.returnValue(of({ productId: 1, quantity: 10, reorderLevel: 5 }));
    apiSpy.stockOut.and.returnValue(of({ productId: 1, quantity: 7, reorderLevel: 5 }));

    await TestBed.configureTestingModule({
      imports: [InventoryComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }],
    }).compileComponents();
  });

  it('should load inventory and products on creation', () => {
    const fixture = TestBed.createComponent(InventoryComponent);
    const component = fixture.componentInstance;

    expect(component.inventory.length).toBe(1);
    expect(component.products.length).toBe(1);
    expect(component.productName(1)).toBe('Widget');
    expect(component.productSku(1)).toBe('A1');
  });

  it('should reject invalid stock movements', () => {
    const fixture = TestBed.createComponent(InventoryComponent);
    const component = fixture.componentInstance;

    component.productId = null;
    component.quantity = 0;
    component.stockIn();

    expect(component.error).toBe('Select a product and enter a positive quantity.');
  });

  it('should stock in inventory', () => {
    const fixture = TestBed.createComponent(InventoryComponent);
    const component = fixture.componentInstance;

    component.productId = 1;
    component.quantity = 2;
    component.stockIn();

    expect(apiSpy.stockIn).toHaveBeenCalledWith(1, 2);
    expect(component.error).toBe('');
  });

  it('should stock out inventory and show backend error when request fails', () => {
    apiSpy.stockOut.and.returnValue(throwError(() => ({ error: { error: 'Insufficient stock' } })));

    const fixture = TestBed.createComponent(InventoryComponent);
    const component = fixture.componentInstance;

    component.productId = 1;
    component.quantity = 1;
    component.stockOut();

    expect(component.error).toBe('Insufficient stock');
  });
});
