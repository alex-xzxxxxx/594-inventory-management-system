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
      <label>
        Username
        <input name="username" [(ngModel)]="username" required />
      </label>
      <label>
        Password
        <input type="password" name="password" [(ngModel)]="password" required />
      </label>
      <button type="submit" [disabled]="isSubmitting">
        {{ isSubmitting ? "Signing in..." : "Sign in" }}
      </button>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
      <small>Demo access: admin / admin123</small>
    </form>
  </div>`,
})
export class LoginComponent {
  username = "admin";
  password = "admin123";
  error = "";
  isSubmitting = false;
  auth = inject(AuthService);
  router = inject(Router);
  submit() {
    const trimmedUsername = this.username.trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      this.error = "Please enter both your username and password.";
      return;
    }

    this.isSubmitting = true;
    this.error = "";

    this.auth
      .login(trimmedUsername, trimmedPassword)
      .subscribe({
        next: (r) => {
          this.isSubmitting = false;
          if (r.authenticated) {
            this.router.navigateByUrl("/");
            return;
          }
          this.error = r.message || "Invalid username or password.";
        },
        error: () => {
          this.isSubmitting = false;
          this.error = "Backend is unavailable.";
        },
      });
  }
}
