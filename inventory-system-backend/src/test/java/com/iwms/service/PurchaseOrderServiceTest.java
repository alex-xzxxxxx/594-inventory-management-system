package com.iwms.service;

import com.iwms.model.PurchaseOrder;
import com.iwms.model.PurchaseOrderItem;
import com.iwms.repository.InMemoryStore;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class PurchaseOrderServiceTest {
    @Test
    void receivingPurchaseOrderUpdatesInventory() {
        InMemoryStore store = new InMemoryStore();
        InventoryService inventory = new InventoryService(store);
        PurchaseOrderService service = new PurchaseOrderService(store, inventory);
        PurchaseOrder po = new PurchaseOrder();
        po.setSupplierId(1L);
        po.setItems(List.of(new PurchaseOrderItem(1L, 20)));
        PurchaseOrder created = service.create(po);
        assertEquals(25, store.inventory.get(1L).getQuantity());
        service.receive(created.getId());
        assertEquals(45, store.inventory.get(1L).getQuantity());
        assertEquals(PurchaseOrder.Status.RECEIVED, created.getStatus());
    }

    @Test
    void purchaseOrderCannotBeReceivedTwice() {
        InMemoryStore store = new InMemoryStore();
        InventoryService inventory = new InventoryService(store);
        PurchaseOrderService service = new PurchaseOrderService(store, inventory);
        PurchaseOrder po = new PurchaseOrder();
        po.setSupplierId(1L);
        po.setItems(List.of(new PurchaseOrderItem(1L, 5)));
        PurchaseOrder created = service.create(po);
        service.receive(created.getId());
        assertThrows(IllegalStateException.class, () -> service.receive(created.getId()));
    }
}
