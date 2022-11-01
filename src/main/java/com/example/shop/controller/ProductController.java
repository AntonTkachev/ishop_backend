package com.example.shop.controller;

import com.example.shop.domain.Product;
import com.example.shop.repository.ProductProjection;
import com.example.shop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    private final ProductRepository productRepository;
    private final ProjectionFactory pf = new SpelAwareProxyProjectionFactory();

    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
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

//    @GetMapping("/search/{searchText}")
//    public ResponseEntity<Page<Product>> findAll(Pageable pageable, String searchText) {
//        return new ResponseEntity<>(productRepository.findAll(pageable, searchText), HttpStatus.OK);
//    }


    //fixme костыль, потому что я не смогу вернуть Product без ошибки в Order
    @GetMapping
    public ResponseEntity<Page<ProductProjection>> findAll(int pageNumber, int pageSize, String sortBy, String sortDir) {
        List<ProductProjection> rp = productRepository.findAll().stream()
                .map(el -> pf.createProjection(ProductProjection.class, el)).collect(Collectors.toList());
        Page<Product> page = productRepository.findAll(
                PageRequest.of(
                        pageNumber, pageSize,
                        sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending()
                ));

        Page<ProductProjection> page1 = new PageImpl<>(rp, page.getPageable(), page.getTotalElements());
        return new ResponseEntity<>(page1, HttpStatus.OK);
    }

    @GetMapping("/read")
    public ResponseEntity<ProductProjection> readProduct(Long id) {
        ProductProjection rp = pf.createProjection(ProductProjection.class, productRepository.findById(id).get());
        return ok().body(rp);
    }

    @PutMapping("/update")
    public ResponseEntity<Product> updateProduct(@RequestBody Product product) {
        return new ResponseEntity<>(productRepository.save(product), HttpStatus.OK);
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
