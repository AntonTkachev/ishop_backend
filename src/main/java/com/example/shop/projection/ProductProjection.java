package com.example.shop.projection;

import com.example.shop.domain.Product;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(
        name = "productProjection",
        types = {Product.class})
public interface ProductProjection {

    long getId();

    String getName();

    String getOwner();

    String getIsbnNumber();

    Long getPrice();

    @Value("#{target.price}")
    Long getOriginalPrice();

    @Value("1")
    Long getCurrentCount();

    int getCount();
}
