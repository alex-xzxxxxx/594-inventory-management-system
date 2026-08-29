package com.iwms.service;

import com.iwms.repository.InMemoryStore;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class InventoryServiceTest {
    @Test
    void stockInIncreasesQuantity() {
        InMemoryStore store = new InMemoryStore();
        InventoryService service = new InventoryService(store);
        assertEquals(25, service.findByProductId(1L).orElseThrow().getQuantity());
        assertEquals(35, service.stockIn(1L, 10).getQuantity());
    }

    @Test
    void stockOutCannotExceedAvailableQuantity() {
        InMemoryStore store = new InMemoryStore();
        InventoryService service = new InventoryService(store);
        assertThrows(IllegalArgumentException.class, () -> service.stockOut(1L, 100));
    }

    @Test
    void lowStockAlertsIncludesItemsAtOrBelowReorderLevel() {
        InMemoryStore store = new InMemoryStore();
        InventoryService service = new InventoryService(store);

        var alerts = service.lowStockAlerts();

        assertFalse(alerts.isEmpty());
        assertTrue(alerts.stream().anyMatch(item -> item.getProductId().equals(3L)));
    }
}
