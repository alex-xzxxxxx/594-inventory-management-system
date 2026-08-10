package com.iwms.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class Product {
    private Long id;
    @NotBlank private String sku;
    @NotBlank private String name;
    @NotBlank private String category;
    @PositiveOrZero private double unitPrice;
    private Long supplierId;

    public Product() {}
    public Product(Long id, String sku, String name, String category, double unitPrice, Long supplierId) {
        this.id=id; this.sku=sku; this.name=name; this.category=category; this.unitPrice=unitPrice; this.supplierId=supplierId;
    }
    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getSku(){return sku;} public void setSku(String v){sku=v;}
    public String getName(){return name;} public void setName(String v){name=v;}
    public String getCategory(){return category;} public void setCategory(String v){category=v;}
    public double getUnitPrice(){return unitPrice;} public void setUnitPrice(double v){unitPrice=v;}
    public Long getSupplierId(){return supplierId;} public void setSupplierId(Long v){supplierId=v;}
}
