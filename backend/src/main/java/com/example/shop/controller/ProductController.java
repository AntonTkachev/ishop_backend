package com.example.shop.controller;

import com.example.shop.domain.Order;
import com.example.shop.domain.Product;
import com.example.shop.projection.ProductProjection;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.http.ResponseEntity.status;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    //fixme удаление не работает!!!
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProjectionFactory pf = new SpelAwareProxyProjectionFactory();

    @Autowired
    public ProductController(ProductRepository productRepository,
                             OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createProduct(@RequestBody Product product) {
        try {
            Product savedProduct = productRepository.save(product);
            return new ResponseEntity<>(savedProduct.toString(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);

        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductProjection>> findAll(String searchText, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<ProductProjection> rp = productRepository.findAllProducts(pageable, searchText).stream()
                .map(el -> pf.createProjection(ProductProjection.class, el)).collect(Collectors.toList());
        Page<ProductProjection> page1 = new PageImpl<>(rp);
        return new ResponseEntity<>(page1, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<ProductProjection>> findAll(int pageNumber, int pageSize, String sortBy, String sortDir) {
        return new ResponseEntity<>(productRepository.findAllBy(
                PageRequest.of(
                        pageNumber, pageSize,
                        sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending()
                )
        ), HttpStatus.OK);
    }

    @GetMapping("/read")
    public ResponseEntity<ProductProjection> readProduct(Long id) {
        ProductProjection rp = pf.createProjection(ProductProjection.class, productRepository.findById(id).get());
        return ok().body(rp);
    }

    @PutMapping("/update")
    public ResponseEntity<ProductProjection> updateProduct(@RequestBody Product product) {
        ProductProjection rp = pf.createProjection(ProductProjection.class, productRepository.save(product));
        return ok().body(rp);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteProduct(Long productId) {
        try {
            Product product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found by id: " + productId));
            Set<Order> orders = orderRepository.findByProducts(product);
            if (orders.isEmpty()) {
                productRepository.delete(product);
                return ok().build();
            } else
                return status(NOT_FOUND).body("Can't delete Product with id: " + productId + " because it use in orders with ids: " + orders.stream().map(Order::getId).collect(Collectors.toList()));
        } catch (Exception e) {
            return status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
