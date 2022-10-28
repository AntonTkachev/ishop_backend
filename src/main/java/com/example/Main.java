package com.example;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

public class Main {

    public static void main(String[] args) {
        DriverManagerDataSource dataSourceBuilder = new DriverManagerDataSource();
        dataSourceBuilder.setDriverClassName("org.postgresql.Driver");
        dataSourceBuilder.setUrl("jdbc:postgresql://localhost:5432/shop");
        dataSourceBuilder.setUsername("postgres");
        dataSourceBuilder.setPassword("123");
        System.out.println(dataSourceBuilder);
    }
}
