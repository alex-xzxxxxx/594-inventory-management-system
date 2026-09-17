import { Routes } from "@angular/router";
import { LoginComponent } from "./features/login.component";
import { HomeComponent } from "./features/home.component";
import { ProductsComponent } from "./features/products/products.component";
import { SuppliersComponent } from "./features/suppliers/suppliers.component";
import { InventoryComponent } from "./features/inventory/inventory.component";
import { PurchaseOrdersComponent } from "./features/purchase-orders/purchase-orders.component";
import { LayoutComponent } from "./shared/components/layout.component";
import { authGuard } from "./core/services/auth.guard";
import { AnalyticsComponent } from "./features/analytics/analytics.component";
import { AuditComponent } from "./features/audit/audit.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "", component: HomeComponent },
      { path: "analytics", component: AnalyticsComponent },
      { path: "audit", component: AuditComponent },
      { path: "products", component: ProductsComponent },
      { path: "suppliers", component: SuppliersComponent },
      { path: "inventory", component: InventoryComponent },
      { path: "purchase-orders", component: PurchaseOrdersComponent },
    ],
  },
  { path: "**", redirectTo: "" },
];
