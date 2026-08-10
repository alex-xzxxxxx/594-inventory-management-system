package com.iwms.controller;

import com.iwms.model.Product;
import com.iwms.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;

@RestController @RequestMapping("/api/products") @CrossOrigin(origins="http://localhost:4200")
public class ProductController {
    private final ProductService service; public ProductController(ProductService service){this.service=service;}
    @GetMapping public Object all(@RequestParam(required=false) String q){return service.search(q);}
    @GetMapping("/{id}") public ResponseEntity<Product> one(@PathVariable Long id){return service.findById(id).map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());}
    @PostMapping public ResponseEntity<Product> create(@Valid @RequestBody Product p){Product created=service.create(p);return ResponseEntity.created(URI.create("/api/products/"+created.getId())).body(created);}
    @PutMapping("/{id}") public ResponseEntity<Product> update(@PathVariable Long id,@Valid @RequestBody Product p){return service.update(id,p).map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());}
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){return service.delete(id)?ResponseEntity.noContent().build():ResponseEntity.notFound().build();}
}
