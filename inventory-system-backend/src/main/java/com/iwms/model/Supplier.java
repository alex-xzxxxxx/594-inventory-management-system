package com.iwms.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class Supplier {
    private Long id;
    @NotBlank private String name;
    @NotBlank private String contactName;
    @Email @NotBlank private String email;
    private String phone;

    public Supplier() {}
    public Supplier(Long id,String name,String contactName,String email,String phone){this.id=id;this.name=name;this.contactName=contactName;this.email=email;this.phone=phone;}
    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getName(){return name;} public void setName(String v){name=v;}
    public String getContactName(){return contactName;} public void setContactName(String v){contactName=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getPhone(){return phone;} public void setPhone(String v){phone=v;}
}
