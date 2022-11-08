package com.example.shop.repository;

import com.example.shop.domain.Person;
import org.springframework.data.rest.core.config.Projection;

@Projection(
        name = "personProjection",
        types = {Person.class})
public interface PersonProjection {

    long getId();

    String getName();

    String getEmail();

    String getMobile();

    String getRoleName();
}
