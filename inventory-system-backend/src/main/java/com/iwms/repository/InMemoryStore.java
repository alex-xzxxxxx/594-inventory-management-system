package com.iwms.repository;

import com.iwms.model.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Component
public class InMemoryStore {
    public final Map<Long, Product> products = new LinkedHashMap<>();
    public final Map<Long, Supplier> suppliers = new LinkedHashMap<>();
    public final Map<Long, InventoryItem> inventory = new LinkedHashMap<>();
    public final Map<Long, PurchaseOrder> purchaseOrders = new LinkedHashMap<>();
    private final AtomicLong productIds = new AtomicLong(4);
    private final AtomicLong supplierIds = new AtomicLong(3);
    private final AtomicLong purchaseOrderIds = new AtomicLong(2);

    public InMemoryStore() {
        suppliers.put(1L,new Supplier(1L,"ABC Electronics","Jane Smith","jane@abcelectronics.com","555-0101"));
        suppliers.put(2L,new Supplier(2L,"Tech Supply Co.","John Lee","john@techsupply.com","555-0102"));
        products.put(1L,new Product(1L,"P-1001","Laptop","Electronics",899.99,1L));
        products.put(2L,new Product(2L,"P-1002","Keyboard","Accessories",49.99,1L));
        products.put(3L,new Product(3L,"P-1003","Monitor","Electronics",249.99,2L));
        inventory.put(1L,new InventoryItem(1L,25,10));
        inventory.put(2L,new InventoryItem(2L,50,15));
        inventory.put(3L,new InventoryItem(3L,8,10));
        purchaseOrders.put(1L,new PurchaseOrder(1L,1L, LocalDate.now().minusDays(3),PurchaseOrder.Status.RECEIVED,
                List.of(new PurchaseOrderItem(1L,20))));
    }
    public long nextProductId(){return productIds.incrementAndGet();}
    public long nextSupplierId(){return supplierIds.incrementAndGet();}
    public long nextPurchaseOrderId(){return purchaseOrderIds.incrementAndGet();}
    public void resetForTests(){
        products.clear(); suppliers.clear(); inventory.clear(); purchaseOrders.clear();
        productIds.set(0); supplierIds.set(0); purchaseOrderIds.set(0);
    }
}
