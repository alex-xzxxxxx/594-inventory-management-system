import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "./api";
import { tap } from "rxjs";
@Injectable({ providedIn: "root" })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private key = "iwms-auth";
  private readonly inactivityTimeoutMs = 10 * 60 * 1000;
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.bindActivityListeners();
  }

  private bindActivityListeners() {
    if (typeof window === "undefined") return;

    const reset = () => this.resetInactivityTimer();
    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"];

    for (const event of events) {
      window.addEventListener(event, reset, { passive: true });
    }
  }

  private clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  private resetInactivityTimer() {
    if (!this.isLoggedIn()) return;

    this.clearInactivityTimer();
    this.inactivityTimer = setTimeout(() => {
      this.logout();
    }, this.inactivityTimeoutMs);
  }

  isLoggedIn() {
    return sessionStorage.getItem(this.key) === "admin";
  }
  login(username: string, password: string) {
    return this.api.login(username, password).pipe(
      tap((r) => {
        if (r.authenticated) {
          sessionStorage.setItem(this.key, "admin");
          this.resetInactivityTimer();
        }
      }),
    );
  }
  logout() {
    this.clearInactivityTimer();
    sessionStorage.removeItem(this.key);
    this.router.navigateByUrl("/login");
  }
}
