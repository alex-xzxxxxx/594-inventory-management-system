package com.iwms.service;

import com.iwms.model.InventoryItem;
import com.iwms.repository.InMemoryStore;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class InventoryService {
    private final InMemoryStore store;
    public InventoryService(InMemoryStore store){this.store=store;}
    public List<InventoryItem> findAll(){return new ArrayList<>(store.inventory.values());}
    public Optional<InventoryItem> findByProductId(Long id){return Optional.ofNullable(store.inventory.get(id));}
    public List<InventoryItem> lowStockAlerts(){
        return store.inventory.values().stream()
                .filter(item -> item.getQuantity() <= item.getReorderLevel())
                .sorted(Comparator.comparingInt(InventoryItem::getQuantity))
                .toList();
    }
    public List<InMemoryStore.AuditEntry> auditTrail(){return store.getAuditTrail();}
    public Map<String,Object> inventorySummary(){
        int totalUnits = store.inventory.values().stream().mapToInt(InventoryItem::getQuantity).sum();
        int lowStockCount = lowStockAlerts().size();
        double inventoryValue = store.products.values().stream()
                .mapToDouble(product -> store.inventory.getOrDefault(product.getId(), new InventoryItem(product.getId(),0,0)).getQuantity() * product.getUnitPrice())
                .sum();

        Map<String,Object> summary = new HashMap<>();
        summary.put("totalProducts", store.products.size());
        summary.put("totalSuppliers", store.suppliers.size());
        summary.put("totalInventoryItems", store.inventory.size());
        summary.put("totalUnits", totalUnits);
        summary.put("lowStockCount", lowStockCount);
        summary.put("inventoryValue", inventoryValue);
        summary.put("purchaseOrderCount", store.purchaseOrders.size());
        return summary;
    }
    public InventoryItem stockIn(Long productId,int quantity){
        validateQuantity(quantity); InventoryItem item=require(productId); item.setQuantity(item.getQuantity()+quantity);
        store.recordAudit("stock-in", "Added " + quantity + " units to product " + productId + ".");
        return item;
    }
    public InventoryItem stockOut(Long productId,int quantity){
        validateQuantity(quantity); InventoryItem item=require(productId);
        if(item.getQuantity()<quantity) throw new IllegalArgumentException("Insufficient inventory for product " + productId);
        item.setQuantity(item.getQuantity()-quantity);
        store.recordAudit("stock-out", "Removed " + quantity + " units from product " + productId + ".");
        return item;
    }
    private InventoryItem require(Long id){InventoryItem i=store.inventory.get(id);if(i==null)throw new NoSuchElementException("Product inventory not found: "+id);return i;}
    private void validateQuantity(int q){if(q<=0)throw new IllegalArgumentException("Quantity must be greater than zero");}
}
