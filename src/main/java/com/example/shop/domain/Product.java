package com.example.shop.domain;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "name")
    protected String name;

    @Column(name = "owner")
    protected String owner;

    @Column(name = "isbn_number")
    protected String isbnNumber;

    @Column(name = "price")
    protected Long price;

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

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getOwner() {
        return owner;
    }

    public String getIsbnNumber() {
        return isbnNumber;
    }

    public Long getPrice() {
        return price;
    }

    public Integer getCount() {
        return count;
    }

    public Set<Order> getOrders() {
        return orders;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public void setIsbnNumber(String isbnNumber) {
        this.isbnNumber = isbnNumber;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public void setOrders(Set<Order> orders) {
        this.orders = orders;
    }
}
