package com.iwms.controller;

import com.iwms.model.InventoryItem;
import com.iwms.service.InventoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(InventoryController.class)
class InventoryControllerRegressionTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InventoryService inventoryService;

    @Test
    void stockInRejectsNonPositiveQuantityBeforeCallingService() throws Exception {
        mockMvc.perform(post("/api/inventory/stock-in")
                        .contentType("application/json")
                        .content("{\"productId\":1,\"quantity\":0}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(inventoryService);
    }
}