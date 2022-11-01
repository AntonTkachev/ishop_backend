package com.example.shop.controller;

import com.example.shop.domain.Person;
import com.example.shop.domain.Order;
import com.example.shop.domain.Product;
import com.example.shop.repository.PersonRepository;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;

import static com.example.shop.utils.Status.NEW;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderRepository orderRepository;
    private final PersonRepository personRepository;
    private final ProductRepository productRepository;

    @Autowired
    public OrderController(OrderRepository orderRepository, PersonRepository personRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.personRepository = personRepository;
        this.productRepository = productRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(Long customerId, Long productId, Integer productCount) {
        Person person = personRepository.findById(customerId).orElseThrow(() -> new EntityNotFoundException("Customer not found for ID: " + customerId));
        Product product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found for ID: " + customerId));
//        product.setCount(productCount);
        Order order = new Order(NEW.name(), person);
        product.getOrders().add(order);
        order.setProduct(product);
        Order savedOrder = orderRepository.save(order);
        return ok().body(savedOrder);
    }

    @GetMapping("/read")
    public ResponseEntity<Order> readOrder(Long id) {
        return ok().body(orderRepository.getById(id));
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<Order> updateStatus(Long id, String newStatus) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Customer not found for ID: " + id));
        order.setStatus(newStatus);
        Order newOrder = orderRepository.save(order);
        return ok().body(newOrder);
    }

    @PutMapping("/addProduct")
    public ResponseEntity<Order> addProduct(Long orderId, Long productId, Integer productCount) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new EntityNotFoundException("Customer not found for ID: " + orderId));
        Product product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found for ID: " + productId));
        product.setCount(productCount);
        order.setProduct(product);
        orderRepository.save(order);
        return ok().body(order);
    }

    @PutMapping("/deleteProduct")
    public ResponseEntity<Order> deleteProduct(Long orderId, Long productId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new EntityNotFoundException("Customer not found for ID: " + orderId));
        Product product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found for ID: " + productId));
        order.deleteProduct(product);
        orderRepository.save(order);
        return ok().body(order);
    }
}
