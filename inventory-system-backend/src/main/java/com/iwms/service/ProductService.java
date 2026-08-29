package com.iwms.service;

import com.iwms.model.Product;
import com.iwms.repository.InMemoryStore;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ProductService {
    private final InMemoryStore store;
    public ProductService(InMemoryStore store){this.store=store;}
    public List<Product> findAll(){return new ArrayList<>(store.products.values());}
    public Optional<Product> findById(Long id){return Optional.ofNullable(store.products.get(id));}
    public List<Product> search(String q){
        if(q==null||q.isBlank()) return findAll();
        String s=q.toLowerCase();
        return store.products.values().stream().filter(p -> p.getName().toLowerCase().contains(s)||p.getSku().toLowerCase().contains(s)||p.getCategory().toLowerCase().contains(s)).toList();
    }
    public Product create(Product p){p.setId(store.nextProductId()); store.products.put(p.getId(),p); store.inventory.put(p.getId(),new com.iwms.model.InventoryItem(p.getId(),0,5)); store.recordAudit("product-created", "Created product " + p.getName() + " (SKU: " + p.getSku() + ")."); return p;}
    public Optional<Product> update(Long id,Product p){if(!store.products.containsKey(id))return Optional.empty();p.setId(id);store.products.put(id,p);return Optional.of(p);}
    public boolean delete(Long id){if(!store.products.containsKey(id))return false;store.products.remove(id);store.inventory.remove(id); store.recordAudit("product-deleted", "Deleted product " + id + "."); return true;}
}
