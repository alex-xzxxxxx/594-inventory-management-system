import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product,Supplier,InventoryItem,PurchaseOrder,LoginResponse } from '../models/models';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'}) export class ApiService {
 private http=inject(HttpClient); private base='http://localhost:8080/api';
 products(q=''):Observable<Product[]>{return this.http.get<Product[]>(`${this.base}/products`,{params:q?{q}: {}})}
 createProduct(p:Partial<Product>){return this.http.post<Product>(`${this.base}/products`,p)}
 deleteProduct(id:number){return this.http.delete<void>(`${this.base}/products/${id}`)}
 suppliers(){return this.http.get<Supplier[]>(`${this.base}/suppliers`)}
 createSupplier(s:Partial<Supplier>){return this.http.post<Supplier>(`${this.base}/suppliers`,s)}
 deleteSupplier(id:number){return this.http.delete<void>(`${this.base}/suppliers/${id}`)}
 inventory(){return this.http.get<InventoryItem[]>(`${this.base}/inventory`)}
 stockIn(productId:number,quantity:number){return this.http.post<InventoryItem>(`${this.base}/inventory/stock-in`,{productId,quantity})}
 stockOut(productId:number,quantity:number){return this.http.post<InventoryItem>(`${this.base}/inventory/stock-out`,{productId,quantity})}
 purchaseOrders(){return this.http.get<PurchaseOrder[]>(`${this.base}/purchase-orders`)}
 createPurchaseOrder(supplierId:number,items:{productId:number;quantity:number}[]){return this.http.post<PurchaseOrder>(`${this.base}/purchase-orders`,{supplierId,items})}
 receivePurchaseOrder(id:number){return this.http.post<PurchaseOrder>(`${this.base}/purchase-orders/${id}/receive`,{})}
 login(username:string,password:string){return this.http.post<LoginResponse>(`${this.base}/auth/login`,{username,password})}
}
