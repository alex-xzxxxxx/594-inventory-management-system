import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "./api";
import { tap } from "rxjs";
@Injectable({ providedIn: "root" })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private key = "iwms-auth";
  isLoggedIn() {
    return sessionStorage.getItem(this.key) === "admin";
  }
  login(username: string, password: string) {
    return this.api.login(username, password).pipe(
      tap((r) => {
        if (r.authenticated) sessionStorage.setItem(this.key, "admin");
      }),
    );
  }
  logout() {
    sessionStorage.removeItem(this.key);
    this.router.navigateByUrl("/login");
  }
}
