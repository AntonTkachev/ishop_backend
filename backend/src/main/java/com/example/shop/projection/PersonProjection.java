package com.example.shop.projection;

import com.example.shop.domain.Person;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(
        name = "personProjection",
        types = {Person.class})
public interface PersonProjection {

    long getId();

    String getName();

    String getEmail();

    String getMobile();

    @Value("#{target.role.name}")
    String getRoleName();
}
