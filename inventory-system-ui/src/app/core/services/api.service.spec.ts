import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api';
import { Product, Supplier, InventoryItem, PurchaseOrder, LoginResponse } from '../models/models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch products for a search query', () => {
    const mockProducts: Product[] = [{ id: 1, sku: 'SKU-1', name: 'Widget', category: 'Tools', unitPrice: 25, supplierId: 10 }];

    let result: Product[] | undefined;
    service.products('widget').subscribe((products) => (result = products));

    const request = httpMock.expectOne((req) => req.method === 'GET' && req.url === 'http://localhost:8080/api/products');
    expect(request.request.params.get('q')).toBe('widget');
    request.flush(mockProducts);

    expect(result).toEqual(mockProducts);
  });

  it('should create a product', () => {
    const payload = { sku: 'SKU-2', name: 'Gadget', category: 'Hardware', unitPrice: 40, supplierId: 11 };
    const created: Product = { id: 2, ...payload };

    let result: Product | undefined;
    service.createProduct(payload).subscribe((product) => (result = product));

    const request = httpMock.expectOne('http://localhost:8080/api/products');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush(created);

    expect(result).toEqual(created);
  });

  it('should delete a product', () => {
    service.deleteProduct(2).subscribe();

    const request = httpMock.expectOne('http://localhost:8080/api/products/2');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('should fetch suppliers', () => {
    const mockSuppliers: Supplier[] = [{ id: 1, name: 'Acme', contactName: 'Alice', email: 'alice@acme.com', phone: '123' }];

    let result: Supplier[] | undefined;
    service.suppliers().subscribe((suppliers) => (result = suppliers));

    const request = httpMock.expectOne('http://localhost:8080/api/suppliers');
    request.flush(mockSuppliers);

    expect(result).toEqual(mockSuppliers);
  });

  it('should create a supplier', () => {
    const payload = { name: 'Beta', contactName: 'Ben', email: 'ben@beta.com', phone: '456' };
    const created: Supplier = { id: 2, ...payload };

    let result: Supplier | undefined;
    service.createSupplier(payload).subscribe((supplier) => (result = supplier));

    const request = httpMock.expectOne('http://localhost:8080/api/suppliers');
    expect(request.request.method).toBe('POST');
    request.flush(created);

    expect(result).toEqual(created);
  });

  it('should delete a supplier', () => {
    service.deleteSupplier(3).subscribe();

    const request = httpMock.expectOne('http://localhost:8080/api/suppliers/3');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('should fetch inventory', () => {
    const mockInventory: InventoryItem[] = [{ productId: 1, quantity: 10, reorderLevel: 5 }];

    let result: InventoryItem[] | undefined;
    service.inventory().subscribe((items) => (result = items));

    const request = httpMock.expectOne('http://localhost:8080/api/inventory');
    request.flush(mockInventory);

    expect(result).toEqual(mockInventory);
  });

  it('should stock in inventory and stock out inventory', () => {
    const stockedItem: InventoryItem = { productId: 1, quantity: 12, reorderLevel: 5 };

    service.stockIn(1, 2).subscribe();
    let stockInRequest = httpMock.expectOne('http://localhost:8080/api/inventory/stock-in');
    expect(stockInRequest.request.method).toBe('POST');
    expect(stockInRequest.request.body).toEqual({ productId: 1, quantity: 2 });
    stockInRequest.flush(stockedItem);

    service.stockOut(1, 1).subscribe();
    const stockOutRequest = httpMock.expectOne('http://localhost:8080/api/inventory/stock-out');
    expect(stockOutRequest.request.method).toBe('POST');
    expect(stockOutRequest.request.body).toEqual({ productId: 1, quantity: 1 });
    stockOutRequest.flush(stockedItem);
  });

  it('should fetch purchase orders', () => {
    const mockOrders: PurchaseOrder[] = [{ id: 7, supplierId: 10, orderDate: '2026-08-28', status: 'CREATED', items: [{ productId: 1, quantity: 3 }] }];

    let result: PurchaseOrder[] | undefined;
    service.purchaseOrders().subscribe((orders) => (result = orders));

    const request = httpMock.expectOne('http://localhost:8080/api/purchase-orders');
    request.flush(mockOrders);

    expect(result).toEqual(mockOrders);
  });

  it('should create and receive purchase orders', () => {
    const createdOrder: PurchaseOrder = { id: 9, supplierId: 10, orderDate: '2026-08-28', status: 'CREATED', items: [{ productId: 1, quantity: 4 }] };

    service.createPurchaseOrder(10, [{ productId: 1, quantity: 4 }]).subscribe();
    const createRequest = httpMock.expectOne('http://localhost:8080/api/purchase-orders');
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toEqual({ supplierId: 10, items: [{ productId: 1, quantity: 4 }] });
    createRequest.flush(createdOrder);

    service.receivePurchaseOrder(9).subscribe();
    const receiveRequest = httpMock.expectOne('http://localhost:8080/api/purchase-orders/9/receive');
    expect(receiveRequest.request.method).toBe('POST');
    expect(receiveRequest.request.body).toEqual({});
    receiveRequest.flush(createdOrder);
  });

  it('should login the user', () => {
    const response: LoginResponse = { authenticated: true, username: 'admin', message: 'OK' };

    let result: LoginResponse | undefined;
    service.login('admin', 'admin123').subscribe((auth) => (result = auth));

    const request = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'admin', password: 'admin123' });
    request.flush(response);

    expect(result).toEqual(response);
  });
});
