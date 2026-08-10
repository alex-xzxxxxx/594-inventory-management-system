package com.iwms.controller;

import com.iwms.model.Supplier; import com.iwms.service.SupplierService; import jakarta.validation.Valid; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import java.net.URI;
@RestController @RequestMapping("/api/suppliers") @CrossOrigin(origins="http://localhost:4200")
public class SupplierController {
 private final SupplierService service; public SupplierController(SupplierService service){this.service=service;}
 @GetMapping public Object all(){return service.findAll();}
 @GetMapping("/{id}") public ResponseEntity<Supplier> one(@PathVariable Long id){return service.findById(id).map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());}
 @PostMapping public ResponseEntity<Supplier> create(@Valid @RequestBody Supplier s){Supplier c=service.create(s);return ResponseEntity.created(URI.create("/api/suppliers/"+c.getId())).body(c);}
 @PutMapping("/{id}") public ResponseEntity<Supplier> update(@PathVariable Long id,@Valid @RequestBody Supplier s){return service.update(id,s).map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){return service.delete(id)?ResponseEntity.noContent().build():ResponseEntity.notFound().build();}
}
