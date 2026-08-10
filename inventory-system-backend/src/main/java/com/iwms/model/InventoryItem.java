package com.iwms.model;

public class InventoryItem {
    private Long productId;
    private int quantity;
    private int reorderLevel;

    public InventoryItem() {}
    public InventoryItem(Long productId,int quantity,int reorderLevel){this.productId=productId;this.quantity=quantity;this.reorderLevel=reorderLevel;}
    public Long getProductId(){return productId;} public void setProductId(Long v){productId=v;}
    public int getQuantity(){return quantity;} public void setQuantity(int v){quantity=v;}
    public int getReorderLevel(){return reorderLevel;} public void setReorderLevel(int v){reorderLevel=v;}
}
