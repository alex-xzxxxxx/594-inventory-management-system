package com.iwms.controller;

import com.iwms.model.PurchaseOrder; import com.iwms.service.PurchaseOrderService; import jakarta.validation.Valid; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import java.net.URI;
@RestController @RequestMapping("/api/purchase-orders") @CrossOrigin(origins="http://localhost:4200")
public class PurchaseOrderController {
 private final PurchaseOrderService service; public PurchaseOrderController(PurchaseOrderService service){this.service=service;}
 @GetMapping public Object all(){return service.findAll();}
 @GetMapping("/{id}") public ResponseEntity<PurchaseOrder> one(@PathVariable Long id){return service.findById(id).map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());}
 @PostMapping public ResponseEntity<PurchaseOrder> create(@Valid @RequestBody PurchaseOrder po){PurchaseOrder c=service.create(po);return ResponseEntity.created(URI.create("/api/purchase-orders/"+c.getId())).body(c);}
 @PostMapping("/{id}/receive") public PurchaseOrder receive(@PathVariable Long id){return service.receive(id);}
}
