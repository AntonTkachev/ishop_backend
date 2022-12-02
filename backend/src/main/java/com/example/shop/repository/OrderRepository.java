package com.example.shop.repository;

import com.example.shop.domain.Order;
import com.example.shop.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Set<Order> findByPersonId(Long personId);

    Set<Order> findByProducts(@Param("product") Product product);
}
