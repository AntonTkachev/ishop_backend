package com.example.shop;

import javax.persistence.*;

@Entity
@Table(name = "shop_customer")
public class Customer {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    @Column(name = "name", nullable = false, unique = true)
    protected String name;


    public Customer(String name) {
        this.name = name;
    }

    public Customer() {
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
