import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../core/services/auth.service";
@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule],
  template: ` <div class="login-page">
    <form class="card login" (ngSubmit)="submit()">
      <h1>IWMS</h1>
      <p>Administrator login</p>
      <label
        >Username<input
          name="username"
          [(ngModel)]="username"
          required /></label
      ><label
        >Password<input
          type="password"
          name="password"
          [(ngModel)]="password"
          required /></label
      ><button type="submit">Sign in</button>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
      <small>Demo: admin / admin123</small>
    </form>
  </div>`,
})
export class LoginComponent {
  username = "admin";
  password = "admin123";
  error = "";
  auth = inject(AuthService);
  router = inject(Router);
  submit() {
    this.auth
      .login(this.username, this.password)
      .subscribe({
        next: (r) =>
          r.authenticated
            ? this.router.navigateByUrl("/")
            : (this.error = r.message),
        error: () => (this.error = "Backend is unavailable."),
      });
  }
}
