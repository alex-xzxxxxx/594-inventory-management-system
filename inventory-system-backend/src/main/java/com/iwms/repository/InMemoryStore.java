package com.iwms.repository;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.iwms.model.*;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class InMemoryStore {
    private static final boolean PERSISTENCE_ENABLED = Boolean.parseBoolean(System.getProperty("iwms.persistence", "false"));
    private static final Path DATA_FILE = Path.of(System.getProperty("user.dir"), "data", "iwms-data.json");
    private static final ObjectMapper MAPPER = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);

    public record AuditEntry(String action, String message, LocalDateTime timestamp) {}
    public record Snapshot(Map<Long, Product> products, Map<Long, Supplier> suppliers,
                          Map<Long, InventoryItem> inventory, Map<Long, PurchaseOrder> purchaseOrders,
                          List<AuditEntry> auditTrail) {}

    public final Map<Long, Product> products = new LinkedHashMap<>();
    public final Map<Long, Supplier> suppliers = new LinkedHashMap<>();
    public final Map<Long, InventoryItem> inventory = new LinkedHashMap<>();
    public final Map<Long, PurchaseOrder> purchaseOrders = new LinkedHashMap<>();
    public final List<AuditEntry> auditTrail = new ArrayList<>();
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
        if (PERSISTENCE_ENABLED && Files.exists(DATA_FILE)) {
            loadFromDisk();
            return;
        }
        recordAudit("bootstrap", "Seed data initialized for IWMS demo.");
        if (PERSISTENCE_ENABLED) persist();
    }

    public long nextProductId(){return productIds.incrementAndGet();}
    public long nextSupplierId(){return supplierIds.incrementAndGet();}
    public long nextPurchaseOrderId(){return purchaseOrderIds.incrementAndGet();}

    public void recordAudit(String action, String message){
        auditTrail.add(new AuditEntry(action, message, LocalDateTime.now()));
        if (PERSISTENCE_ENABLED) persist();
    }

    public List<AuditEntry> getAuditTrail(){
        return List.copyOf(auditTrail);
    }

    public void persist(){
        if (!PERSISTENCE_ENABLED) return;
        try {
            Files.createDirectories(DATA_FILE.getParent());
            MAPPER.writeValue(DATA_FILE.toFile(), new Snapshot(products, suppliers, inventory, purchaseOrders, auditTrail));
        } catch (IOException e) {
            throw new IllegalStateException("Unable to persist IWMS data.", e);
        }
    }

    private void loadFromDisk(){
        try {
            Snapshot snapshot = MAPPER.readValue(DATA_FILE.toFile(), Snapshot.class);
            if (snapshot == null) return;
            if (snapshot.products() != null) products.clear(); products.putAll(snapshot.products());
            if (snapshot.suppliers() != null) suppliers.clear(); suppliers.putAll(snapshot.suppliers());
            if (snapshot.inventory() != null) inventory.clear(); inventory.putAll(snapshot.inventory());
            if (snapshot.purchaseOrders() != null) purchaseOrders.clear(); purchaseOrders.putAll(snapshot.purchaseOrders());
            if (snapshot.auditTrail() != null) auditTrail.clear(); auditTrail.addAll(snapshot.auditTrail());
            productIds.set(products.keySet().stream().mapToLong(Long::longValue).max().orElse(0L) + 1);
            supplierIds.set(suppliers.keySet().stream().mapToLong(Long::longValue).max().orElse(0L) + 1);
            purchaseOrderIds.set(purchaseOrders.keySet().stream().mapToLong(Long::longValue).max().orElse(0L) + 1);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to restore IWMS data.", e);
        }
    }

    public void resetForTests(){
        products.clear(); suppliers.clear(); inventory.clear(); purchaseOrders.clear(); auditTrail.clear();
        productIds.set(0); supplierIds.set(0); purchaseOrderIds.set(0);
    }
}
