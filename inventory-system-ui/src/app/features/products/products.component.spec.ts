import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductsComponent } from './products.component';
import { ApiService } from '../../core/services/api';

describe('ProductsComponent', () => {
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['suppliers', 'products', 'createProduct', 'deleteProduct']);
    apiSpy.suppliers.and.returnValue(of([{ id: 1, name: 'Acme', contactName: 'Alice', email: 'alice@acme.com', phone: '123' }]));
    apiSpy.products.and.returnValue(of([{ id: 7, sku: 'SKU-7', name: 'Latch', category: 'Hardware', unitPrice: 12, supplierId: 1 }]));
    apiSpy.createProduct.and.returnValue(of({ id: 8, sku: 'SKU-8', name: 'Bolt', category: 'Hardware', unitPrice: 20, supplierId: 1 }));
    apiSpy.deleteProduct.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }],
    }).compileComponents();
  });

  it('should load suppliers and products on creation', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;

    expect(component.suppliers.length).toBe(1);
    expect(component.products.length).toBe(1);
    expect(component.supplierName(1)).toBe('Acme');
    expect(component.supplierName(99)).toBe('—');
  });

  it('should add a product when the required fields are filled', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;
    const payload = { sku: 'SKU-9', name: 'Nail', category: 'Hardware', unitPrice: 22, supplierId: 1 };

    component.form = payload;
    component.add();

    expect(apiSpy.createProduct).toHaveBeenCalledWith(payload);
    expect(apiSpy.products).toHaveBeenCalled();
    expect(component.form).toEqual({ sku: '', name: '', category: '', unitPrice: 0, supplierId: null });
  });

  it('should ignore invalid product creation', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;

    component.form = { sku: '', name: '', category: '', unitPrice: 0, supplierId: null };
    component.add();

    expect(apiSpy.createProduct).not.toHaveBeenCalled();
  });

  it('should delete a product', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;

    component.remove(7);

    expect(apiSpy.deleteProduct).toHaveBeenCalledWith(7);
  });
});
