package com.iwms.controller;

import com.iwms.model.InventoryItem; import com.iwms.service.InventoryService; import jakarta.validation.constraints.Positive; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/inventory") @CrossOrigin(origins="http://localhost:4200")
public class InventoryController {
 private final InventoryService service; public InventoryController(InventoryService service){this.service=service;}
 @GetMapping public Object all(){return service.findAll();}
 @GetMapping("/{productId}") public ResponseEntity<InventoryItem> one(@PathVariable Long productId){return service.findByProductId(productId).map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());}
 public record QuantityRequest(Long productId,@Positive int quantity){}
 @PostMapping("/stock-in") public InventoryItem stockIn(@RequestBody QuantityRequest r){return service.stockIn(r.productId(),r.quantity());}
 @PostMapping("/stock-out") public InventoryItem stockOut(@RequestBody QuantityRequest r){return service.stockOut(r.productId(),r.quantity());}
}
