import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SuppliersComponent } from './suppliers.component';
import { ApiService } from '../../core/services/api';

describe('SuppliersComponent', () => {
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['suppliers', 'createSupplier', 'deleteSupplier']);
    apiSpy.suppliers.and.returnValue(of([{ id: 1, name: 'Acme', contactName: 'Alice', email: 'alice@acme.com', phone: '123' }]));
    apiSpy.createSupplier.and.returnValue(of({ id: 2, name: 'Beta', contactName: 'Bob', email: 'bob@beta.com', phone: '333' }));
    apiSpy.deleteSupplier.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [SuppliersComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }],
    }).compileComponents();
  });

  it('should load suppliers on creation', () => {
    const fixture = TestBed.createComponent(SuppliersComponent);
    const component = fixture.componentInstance;

    expect(component.suppliers.length).toBe(1);
  });

  it('should create a supplier when fields are valid', () => {
    const fixture = TestBed.createComponent(SuppliersComponent);
    const component = fixture.componentInstance;
    const payload = { name: 'Gamma', contactName: 'Gina', email: 'gina@gamma.com', phone: '777' };

    component.form = payload;
    component.add();

    expect(apiSpy.createSupplier).toHaveBeenCalledWith(payload);
    expect(component.form).toEqual({ name: '', contactName: '', email: '', phone: '' });
  });

  it('should ignore invalid supplier creation', () => {
    const fixture = TestBed.createComponent(SuppliersComponent);
    const component = fixture.componentInstance;

    component.form = { name: '', contactName: '', email: '', phone: '' };
    component.add();

    expect(apiSpy.createSupplier).not.toHaveBeenCalled();
  });

  it('should delete a supplier', () => {
    const fixture = TestBed.createComponent(SuppliersComponent);
    const component = fixture.componentInstance;

    component.remove(1);

    expect(apiSpy.deleteSupplier).toHaveBeenCalledWith(1);
  });
});
