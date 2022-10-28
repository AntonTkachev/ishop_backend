package com.example.shop;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "shop_order")
public class Order {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    public void setStatus(String status) {
        this.status = status;
    }

    @Column(name = "status")
    protected String status;

    @OneToOne
    @JoinColumn(name = "customer_id")
    protected Customer customer;

    @ManyToMany
    @JoinTable(name = "order_product",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    protected Set<Product> products = new HashSet<>();

    public Order() {
    }

    public Order(String status, Customer customer, Product product) {
        this.status = status;
        this.customer = customer;
        this.products.add(product);
    }

    public Order(String status, Customer customer) {
        this.status = status;
        this.customer = customer;
    }

    public void setProduct(Product product) {
        this.products.add(product);
    }

    public void deleteProduct(Product product){
        this.products.remove(product);
    }
}
