package com.example.shop.projection;

import com.example.shop.domain.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.util.Set;

@Projection(
        name = "orderProjection",
        types = {Order.class})
public interface OrderProjection {

    long getId();

    String getStatus();

    PersonProjection getPerson();

    @Value("#{target.products}")
    Set<ProductProjection> getProduct();
}
