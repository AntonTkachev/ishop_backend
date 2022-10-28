package com.example.shop;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "shop_product")
public class Product{

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "name")
    protected String name;

    @Column(name = "count")
    protected Integer count;

    @ManyToMany(mappedBy = "products")
    protected Set<Order> orders = new HashSet<>();

    public Product(String name, Integer count) {
        this.name = name;
        this.count = count;
    }

    public Product() {
    }

    public Set<Order> getOrders() {
        return orders;
    }

    public String getName() {
        return name;
    }

    public Integer getCount() {
        return count;
    }

    public void setOrders(Set<Order> orders) {
        this.orders = orders;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
