package com.example.shop.controller;

import com.example.shop.Product;
import com.example.shop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(String name, Integer count) {
        Product newProduct = new Product(name, count);
        Product savedProduct = productRepository.save(newProduct);
        return ok().body(savedProduct);
    }

    @GetMapping("/read")
    public ResponseEntity<Product> readProduct(Long id) {
        return ok().body(productRepository.getById(id));
    }

    @PutMapping("/update")
    public ResponseEntity<Product> updateProduct(Long id, String newName, Integer count) {
        Optional<Product> oldProduct = productRepository.findById(id);
        if (oldProduct.isEmpty()) return badRequest().build();
        Product product = oldProduct.get();
        product.setName(newName);
        product.setCount(count);
        Product newProduct = productRepository.save(oldProduct.get());
        return ok().body(newProduct);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Product> deleteProduct(Long productId) {
        try {
            productRepository.deleteById(productId);
            return ok().build();
        } catch (Exception e) {
            return status(NOT_FOUND).build();
        }
    }
}
