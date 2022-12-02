package com.example.shop.domain;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ordering")
public class Order {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "name")
    protected String name;

    @Column(name = "surname")
    protected String surname;

    @Column(name = "address")
    protected String address;

    @JsonFormat(pattern = "HH:mm")
    @Column(name = "time")
    protected LocalTime time;

    @Column(name = "date")
    protected Timestamp date;

    @Column(name = "email")
    protected String email;

    @Column(name = "status")
    protected String status;

    @ManyToOne
    @JoinColumn(name = "person_id")
    protected Person person;

    @ManyToMany
    @JoinTable(name = "order_product",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    protected Set<Product> products = new HashSet<>();

    @Column(name = "total_sum")
    protected Long totalSum;

    public Order() {
    }

    public Order(String status, Person person, Product product) {
        this.status = status;
        this.person = person;
        this.products.add(product);
    }

    public Order(String status, Person person) {
        this.status = status;
        this.person = person;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setProduct(Product product) {
        this.products.add(product);
    }

    public void deleteProduct(Product product) {
        this.products.remove(product);
    }

    public Set<Product> getProducts() {
        return products;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getAddress() {
        return address;
    }

    public LocalTime getTime() {
        return time;
    }

    public Timestamp getDate() {
        return date;
    }

    public String getEmail() {
        return email;
    }

    public String getStatus() {
        return status;
    }

    public Person getPerson() {
        return person;
    }

    public Long getTotalSum() {
        return totalSum;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    public void setTotalSum(Long totalSum) {
        this.totalSum = totalSum;
    }
}
