import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: ` <div class="shell">
    <header>
      <div>
        <strong>IWMS</strong><span>Inventory & Warehouse Management</span>
      </div>
      <button class="secondary" (click)="auth.logout()">Logout</button>
    </header>
    <nav>
      <a routerLink="/">Home</a><a routerLink="/products">Products</a
      ><a routerLink="/suppliers">Suppliers</a
      ><a routerLink="/inventory">Inventory</a
      ><a routerLink="/purchase-orders">Purchase Orders</a>
    </nav>
    <main><router-outlet /></main>
  </div>`,
})
export class LayoutComponent {
  auth = inject(AuthService);
}
