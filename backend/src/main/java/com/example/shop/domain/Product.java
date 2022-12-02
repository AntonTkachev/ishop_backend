package com.example.shop.domain;

import javax.persistence.*;
import java.nio.charset.StandardCharsets;
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

    @Column(name = "original_price")
    private Long originalPrice;

    @Column(name = "count")
    protected Integer count;

    @Column(name = "current_count")
    private Integer currentCount;

    @ManyToMany(mappedBy = "products")
    protected Set<Order> orders = new HashSet<>();

    @Transient
    protected String coverPhotoURL;

    @Column(name = "cover_photo_url")
    protected byte[] byteCoverPhotoURL;

    @Column(name = "is_archive")
    protected boolean isArchive = false;

    public Product() {
    }

    public Product(Long id, String name, String owner, String isbnNumber, Long price, Integer count, String coverPhotoURL) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.isbnNumber = isbnNumber;
        this.price = price;
        this.count = count;
        this.coverPhotoURL = coverPhotoURL;
        this.byteCoverPhotoURL = coverPhotoURL.getBytes();
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

    public void setCoverPhotoURL(String coverPhotoURL) {
        this.byteCoverPhotoURL = coverPhotoURL.getBytes();
    }

    public String getCoverPhotoURL() {
        return new String(byteCoverPhotoURL, StandardCharsets.UTF_8).replaceAll("\u0000", "");
    }

    public byte[] getByteCoverPhotoURL() {
        return byteCoverPhotoURL;
    }

    public Long getOriginalPrice() {
        return originalPrice;
    }

    public Integer getCurrentCount() {
        return currentCount;
    }

    public boolean isArchive() {
        return isArchive;
    }

    public void setOriginalPrice(Long originalPrice) {
        this.originalPrice = originalPrice;
    }

    public void setCurrentCount(Integer currentCount) {
        this.currentCount = currentCount;
    }

    public void setByteCoverPhotoURL(byte[] byteCoverPhotoURL) {
        this.byteCoverPhotoURL = byteCoverPhotoURL;
    }

    public void setArchive(boolean archive) {
        isArchive = archive;
    }
}
