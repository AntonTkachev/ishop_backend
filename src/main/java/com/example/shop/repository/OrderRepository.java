package com.example.shop.repository;

import com.example.shop.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public class OrderRepository extends JpaRepository<Order, Long> {
}
