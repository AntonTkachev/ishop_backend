package com.example.shop.repository;

import com.example.shop.domain.Product;
import com.example.shop.projection.ProductProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends PagingAndSortingRepository<Product, Long> {

    @Query("FROM Product p WHERE p.name LIKE %:searchText% OR p.owner LIKE %:searchText% OR CAST(p.price AS string) LIKE %:searchText% OR CAST(p.count AS string) LIKE %:searchText% ORDER BY p.price ASC")
    Page<Product> findAllProducts(Pageable pageable, @Param("searchText") String searchText);

    Page<ProductProjection> findAllBy(Pageable pageable);
}
