package com.iwms.service;

import com.iwms.model.PurchaseOrder;
import com.iwms.model.PurchaseOrderItem;
import com.iwms.repository.InMemoryStore;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class PurchaseOrderService {
    private final InMemoryStore store; private final InventoryService inventoryService;
    public PurchaseOrderService(InMemoryStore store,InventoryService inventoryService){this.store=store;this.inventoryService=inventoryService;}
    public List<PurchaseOrder> findAll(){return new ArrayList<>(store.purchaseOrders.values());}
    public Optional<PurchaseOrder> findById(Long id){return Optional.ofNullable(store.purchaseOrders.get(id));}
    public PurchaseOrder create(PurchaseOrder po){
        if(!store.suppliers.containsKey(po.getSupplierId())) throw new NoSuchElementException("Supplier not found");
        if(po.getItems()==null||po.getItems().isEmpty()) throw new IllegalArgumentException("Purchase order must contain at least one item");
        for(PurchaseOrderItem item:po.getItems()){
            if(!store.products.containsKey(item.getProductId())) throw new NoSuchElementException("Product not found: "+item.getProductId());
            if(item.getQuantity()<=0) throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        po.setId(store.nextPurchaseOrderId()); po.setOrderDate(LocalDate.now()); po.setStatus(PurchaseOrder.Status.CREATED); store.purchaseOrders.put(po.getId(),po); store.recordAudit("purchase-order-created", "Created purchase order PO-" + po.getId() + "."); return po;
    }
    public PurchaseOrder receive(Long id){
        PurchaseOrder po=store.purchaseOrders.get(id); if(po==null)throw new NoSuchElementException("Purchase order not found");
        if(po.getStatus()==PurchaseOrder.Status.RECEIVED) throw new IllegalStateException("Purchase order has already been received");
        for(PurchaseOrderItem item:po.getItems()) inventoryService.stockIn(item.getProductId(),item.getQuantity());
        po.setStatus(PurchaseOrder.Status.RECEIVED); store.recordAudit("purchase-order-received", "Received purchase order PO-" + id + "."); return po;
    }
}
