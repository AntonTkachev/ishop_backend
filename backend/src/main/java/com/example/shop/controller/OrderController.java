package com.example.shop.controller;

import com.example.shop.domain.Order;
import com.example.shop.domain.Person;
import com.example.shop.domain.Product;
import com.example.shop.projection.OrderProjection;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.PersonRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.utils.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.example.shop.utils.Status.NEW;
import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderRepository orderRepository;
    private final PersonRepository personRepository;
    private final ProductRepository productRepository;

    private final ProjectionFactory pf = new SpelAwareProxyProjectionFactory();

    @Autowired
    public OrderController(OrderRepository orderRepository, PersonRepository personRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.personRepository = personRepository;
        this.productRepository = productRepository;
    }

    //fixme еще раз подумать над этим методом
    @PostMapping("/create")
    public ResponseEntity<OrderProjection> createOrder(String mail, Long productId) {
        Person person = Optional.of(personRepository.findByEmail(mail)).orElseThrow(() -> new EntityNotFoundException("Customer not found for mail: " + mail));
        Product product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + productId));
//        product.setCount(productCount);
        Set<Order> orders = orderRepository.findByPersonId(person.getId());
        Order order = orders.stream().filter(o -> Objects.equals(o.getStatus(), NEW.name())).findFirst().orElse(new Order(NEW.name(), person));
        Optional<Product> pp = order.getProducts().stream().filter(p -> Objects.equals(p.getId(), productId)).findAny();
        if (pp.isEmpty()) {
            product.getOrders().add(order);
            order.setProduct(product);
        }
        Order savedOrder = orderRepository.save(order);
        OrderProjection projection = pf.createProjection(OrderProjection.class, savedOrder);
        return ok().body(projection);
    }

    @GetMapping("/read")
    public ResponseEntity<Order> readOrder(Long id) {
        return ok().body(orderRepository.getById(id));
    }

    @GetMapping("/getByMail")
    public ResponseEntity<Set<OrderProjection>> readOrder(String mail) {
        Person person = Optional.of(personRepository.findByEmail(mail)).orElseThrow(() -> new EntityNotFoundException("Customer not found for ID: " + mail));
        Set<Order> orders = orderRepository.findByPersonId(person.getId());
        if (orders.isEmpty()) return badRequest().body(null);
        else {
            Set<OrderProjection> projections = orders.stream().map(order -> pf.createProjection(OrderProjection.class, order)).collect(Collectors.toSet());
            return ok().body(projections);
        }
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

    @PutMapping("/endOrder")
    public ResponseEntity<String> endOrder(@RequestBody Order order) {
        if (Objects.equals(order.getStatus(), NEW.name()))
            order.setStatus(Status.DELIVERED.name());
        orderRepository.save(order);
        return ok().body("");
    }

    @PutMapping("/deleteProduct")
    public ResponseEntity<String> deleteProduct(String mail, Long productId) {
        try {
            Person person = Optional.of(personRepository.findByEmail(mail)).orElseThrow(() -> new EntityNotFoundException("Customer not found for mail: " + mail));
            Product product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found for ID: " + productId));
            Set<Order> orders = orderRepository.findByPersonId(person.getId());
            Order order = orders.stream().filter(o -> Objects.equals(o.getStatus(), NEW.name())).findFirst().orElse(new Order(NEW.name(), person));
            order.deleteProduct(product);
            orderRepository.save(order);
            return ok().body(order.toString());
        } catch (Exception e) {
            return badRequest().body(e.getMessage());
        }
    }
}
