package com.example.shop.controller;

import com.example.shop.Customer;
import com.example.shop.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Customer> createCustomer(String name) {
        Customer newCustomer = new Customer(name);
        Customer savedCustomer = customerRepository.save(newCustomer);
        return ok().body(savedCustomer);
    }

    @GetMapping("/read")
    public ResponseEntity<Customer> readCustomer(Long id) {
        return ok().body(customerRepository.getById(id));
    }

    @GetMapping("/readAll")
    public ResponseEntity<List<Customer>> findAllCustomers() {
        return ok().body(customerRepository.findAll());
    }

    @PutMapping("/updateName")
    public ResponseEntity<Customer> updateCustomer(Long id, String newName) {
        Optional<Customer> oldCustomer = customerRepository.findById(id);
        if (oldCustomer.isEmpty()) return badRequest().build();
        oldCustomer.get().setName(newName);
        Customer newCustomer = customerRepository.save(oldCustomer.get());
        return ok().body(newCustomer);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Customer> deleteCustomer(Long customerId) {
        try {
            customerRepository.deleteById(customerId);
            return ok().build();
        } catch (Exception e) {
            return status(NOT_FOUND).build();
        }
    }
}
