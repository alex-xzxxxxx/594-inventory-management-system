package com.iwms.service;

import com.iwms.model.Supplier;
import com.iwms.repository.InMemoryStore;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SupplierService {
    private final InMemoryStore store;
    public SupplierService(InMemoryStore store){this.store=store;}
    public List<Supplier> findAll(){return new ArrayList<>(store.suppliers.values());}
    public Optional<Supplier> findById(Long id){return Optional.ofNullable(store.suppliers.get(id));}
    public Supplier create(Supplier s){s.setId(store.nextSupplierId());store.suppliers.put(s.getId(),s);return s;}
    public Optional<Supplier> update(Long id,Supplier s){if(!store.suppliers.containsKey(id))return Optional.empty();s.setId(id);store.suppliers.put(id,s);return Optional.of(s);}
    public boolean delete(Long id){return store.suppliers.remove(id)!=null;}
}
