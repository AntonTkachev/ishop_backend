package com.example;

import com.example.shop.domain.Product;
import com.example.shop.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.example.shop"})
@EnableJpaRepositories(basePackages = "com.example.shop.repository")
public class ShopApplication implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ShopApplication(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public static void main(String[] args) {
        SpringApplication.run(ShopApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        if (!productRepository.findAll().iterator().hasNext()) {
            productRepository.save(new Product(1L, "iPhone", "A", "1", 500L, 1000, "https://icity.ge/wp-content/uploads/2020/10/iphone-12-purple.png"));
            productRepository.save(new Product(2L, "iPad", "A", "2", 500L, 500, "https://img.zoommer.ge/zoommer-images/thumbs/0146312_apple-ipad-pro-11-2021-3rd-gen-128gb-wi-fi-space-grey_550.jpeg"));
            productRepository.save(new Product(3L, "iWatch", "A", "3", 300L, 2000, "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-49-titanium-ultra_VW_34FR_WF_CO+watch-face-49-alpine-ultra_VW_34FR_WF_CO?wid=750&hei=712&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1660713659063%2C1660927566964%2C1660927563656"));
            productRepository.save(new Product(4L, "macbook", "A", "4", 1000L, 500, "https://img.zoommer.ge/zoommer-images/thumbs/0170510_apple-macbook-pro-13-m2-chip-2022-8gb256gb-lla-space-grey.jpeg"));
            productRepository.save(new Product(5L, "iMac", "A", "5", 1500L, 300, "https://m.media-amazon.com/images/I/717q8QReNaL.jpg"));
        }
    }
}
