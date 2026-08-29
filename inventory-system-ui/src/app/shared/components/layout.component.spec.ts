import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutComponent } from './layout.component';
import { AuthService } from '../../core/services/auth.service';

describe('LayoutComponent', () => {
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authSpy }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LayoutComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call logout when the button is clicked', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const button = fixture.nativeElement.querySelector('button');

    button.click();

    expect(authSpy.logout).toHaveBeenCalled();
  });
});
