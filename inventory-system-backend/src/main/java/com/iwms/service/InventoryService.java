package com.iwms.service;

import com.iwms.model.InventoryItem;
import com.iwms.repository.InMemoryStore;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class InventoryService {
    private final InMemoryStore store;
    public InventoryService(InMemoryStore store){this.store=store;}
    public List<InventoryItem> findAll(){return new ArrayList<>(store.inventory.values());}
    public Optional<InventoryItem> findByProductId(Long id){return Optional.ofNullable(store.inventory.get(id));}
    public InventoryItem stockIn(Long productId,int quantity){
        validateQuantity(quantity); InventoryItem item=require(productId); item.setQuantity(item.getQuantity()+quantity); return item;
    }
    public InventoryItem stockOut(Long productId,int quantity){
        validateQuantity(quantity); InventoryItem item=require(productId);
        if(item.getQuantity()<quantity) throw new IllegalArgumentException("Insufficient inventory for product " + productId);
        item.setQuantity(item.getQuantity()-quantity); return item;
    }
    private InventoryItem require(Long id){InventoryItem i=store.inventory.get(id);if(i==null)throw new NoSuchElementException("Product inventory not found: "+id);return i;}
    private void validateQuantity(int q){if(q<=0)throw new IllegalArgumentException("Quantity must be greater than zero");}
}
