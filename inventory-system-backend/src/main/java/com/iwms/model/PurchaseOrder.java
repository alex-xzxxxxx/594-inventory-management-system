package com.iwms.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class PurchaseOrder {
    public enum Status { CREATED, RECEIVED }
    private Long id;
    private Long supplierId;
    private LocalDate orderDate;
    private Status status;
    private List<PurchaseOrderItem> items = new ArrayList<>();

    public PurchaseOrder() {}
    public PurchaseOrder(Long id,Long supplierId,LocalDate orderDate,Status status,List<PurchaseOrderItem> items){this.id=id;this.supplierId=supplierId;this.orderDate=orderDate;this.status=status;this.items=items;}
    public Long getId(){return id;} public void setId(Long v){id=v;}
    public Long getSupplierId(){return supplierId;} public void setSupplierId(Long v){supplierId=v;}
    public LocalDate getOrderDate(){return orderDate;} public void setOrderDate(LocalDate v){orderDate=v;}
    public Status getStatus(){return status;} public void setStatus(Status v){status=v;}
    public List<PurchaseOrderItem> getItems(){return items;} public void setItems(List<PurchaseOrderItem> v){items=v;}
}
