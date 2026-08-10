package com.iwms.model;

import jakarta.validation.constraints.Positive;

public class PurchaseOrderItem {
    private Long productId;
    @Positive private int quantity;
    public PurchaseOrderItem() {}
    public PurchaseOrderItem(Long productId,int quantity){this.productId=productId;this.quantity=quantity;}
    public Long getProductId(){return productId;} public void setProductId(Long v){productId=v;}
    public int getQuantity(){return quantity;} public void setQuantity(int v){quantity=v;}
}
