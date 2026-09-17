package com.iwms;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class InventorySystemTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void stockInFlowUpdatesInventoryAndAuditTrail() throws Exception {
        mockMvc.perform(get("/api/inventory/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(25));

        mockMvc.perform(post("/api/inventory/stock-in")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"productId\":1,\"quantity\":5}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productId").value(1))
                .andExpect(jsonPath("$.quantity").value(30));

        mockMvc.perform(get("/api/inventory/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(30));

        mockMvc.perform(get("/api/inventory/audit"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.action == 'stock-in')]").exists());
    }

    @Test
    void authenticationEndpointsAcceptValidCredentialsAndRejectInvalidCredentials() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"admin123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.username").value("admin"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"wrong\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(false))
                .andExpect(jsonPath("$.username").doesNotExist());
    }

    @Test
    void productEndpointsSupportSearchCreateUpdateAndDelete() throws Exception {
        mockMvc.perform(get("/api/products").param("q", "Laptop"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sku").value("P-1001"));

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sku\":\"P-TEST\",\"name\":\"Test Product\",\"category\":\"Testing\",\"unitPrice\":12.5,\"supplierId\":1}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(9))
                .andExpect(jsonPath("$.name").value("Test Product"));

        mockMvc.perform(put("/api/products/9")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sku\":\"P-TEST\",\"name\":\"Updated Product\",\"category\":\"Testing\",\"unitPrice\":15.0,\"supplierId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Product"));

        mockMvc.perform(delete("/api/products/9"))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/products/9"))
                .andExpect(status().isNotFound());
    }

    @Test
    void supplierEndpointsSupportCreateUpdateAndDelete() throws Exception {
        mockMvc.perform(get("/api/suppliers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("ABC Electronics"));

        mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test Supplier\",\"contactName\":\"Test Contact\",\"email\":\"test@example.com\",\"phone\":\"555-0199\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(6));

        mockMvc.perform(put("/api/suppliers/6")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Updated Supplier\",\"contactName\":\"Updated Contact\",\"email\":\"updated@example.com\",\"phone\":\"555-0188\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Supplier"));

        mockMvc.perform(delete("/api/suppliers/6"))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/suppliers/6"))
                .andExpect(status().isNotFound());
    }

    @Test
    void purchaseOrderEndpointsCreateAndReceiveOrder() throws Exception {
        mockMvc.perform(post("/api/purchase-orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"supplierId\":1,\"items\":[{\"productId\":2,\"quantity\":10}]}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.status").value("CREATED"));

        mockMvc.perform(get("/api/purchase-orders/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].quantity").value(10));

        mockMvc.perform(post("/api/purchase-orders/5/receive"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RECEIVED"));

        mockMvc.perform(get("/api/inventory/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(60));
    }
}