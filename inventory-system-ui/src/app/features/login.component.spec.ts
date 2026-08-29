import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../core/services/auth.service';

describe('LoginComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should navigate to home when login succeeds', () => {
    authServiceSpy.login.and.returnValue(
      of({ authenticated: true, username: 'admin', message: 'OK' }),
    );

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.username = 'admin';
    component.password = 'admin123';
    component.submit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('admin', 'admin123');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should show an error message when login fails', () => {
    authServiceSpy.login.and.returnValue(
      of({ authenticated: false, username: null, message: 'Bad credentials' }),
    );

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.submit();

    expect(component.error).toBe('Bad credentials');
  });

  it('should show backend unavailable when the http call fails', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('offline')));

    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.submit();

    expect(component.error).toBe('Backend is unavailable.');
  });
});
