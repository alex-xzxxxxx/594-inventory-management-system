import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuditComponent } from './audit.component';
import { ApiService } from '../../core/services/api';

describe('AuditComponent', () => {
  let fixture: ComponentFixture<AuditComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['auditTrail']);
    apiSpy.auditTrail.and.returnValue(
      of([
        { action: 'stock-in', message: 'Added 15 units to product 1', timestamp: '2026-08-29T10:00:00' },
        { action: 'supplier-created', message: 'Created supplier ABC Electronics', timestamp: '2026-08-29T09:00:00' },
      ]),
    );

    await TestBed.configureTestingModule({
      imports: [AuditComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditComponent);
    fixture.detectChanges();
  });

  it('should create and render audit history', () => {
    expect(fixture.componentInstance).toBeTruthy();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Audit Log');
    expect(text).toContain('stock-in');
    expect(text).toContain('supplier-created');
  });
});
