import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    jasmine.clock().install();
    sessionStorage.clear();
    apiSpy = jasmine.createSpyObj('ApiService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should report logged in state based on session storage', () => {
    sessionStorage.setItem('iwms-auth', 'admin');

    expect(service.isLoggedIn()).toBeTrue();

    sessionStorage.clear();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should login and store session when backend authenticates', () => {
    apiSpy.login.and.returnValue(
      of({ authenticated: true, username: 'admin', message: 'Login successful.' }),
    );

    service.login('admin', 'admin123').subscribe();

    expect(apiSpy.login).toHaveBeenCalledWith('admin', 'admin123');
    expect(sessionStorage.getItem('iwms-auth')).toBe('admin');
  });

  it('should not set session if the backend says not authenticated', () => {
    apiSpy.login.and.returnValue(
      of({ authenticated: false, username: null, message: 'Bad credentials' }),
    );

    service.login('admin', 'wrong').subscribe();

    expect(sessionStorage.getItem('iwms-auth')).toBeNull();
  });

  it('should clear the session and route to login on logout', () => {
    sessionStorage.setItem('iwms-auth', 'admin');

    service.logout();

    expect(sessionStorage.getItem('iwms-auth')).toBeNull();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should log out after ten minutes of inactivity', () => {
    apiSpy.login.and.returnValue(
      of({ authenticated: true, username: 'admin', message: 'Login successful.' }),
    );

    service.login('admin', 'admin123').subscribe();
    jasmine.clock().tick(10 * 60 * 1000);

    expect(sessionStorage.getItem('iwms-auth')).toBeNull();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
