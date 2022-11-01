package com.example.shop.controller;

import com.example.shop.domain.Person;
import com.example.shop.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/api/customer")
public class PersonController {

    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    public PersonController(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Person> createCustomer(@RequestBody Person newPerson) {
        Person savedPerson = personRepository.save(newPerson);
        return ok().body(savedPerson);
    }

    @GetMapping("/read")
    public ResponseEntity<Person> readCustomer(Long id) {
        return ok().body(personRepository.getById(id));
    }

    @GetMapping("/readAll")
    public ResponseEntity<List<Person>> findAllCustomers() {
        return ok().body(personRepository.findAll());
    }

    @PutMapping("/updateName")
    public ResponseEntity<Person> updateCustomer(Long id, String newName) {
        Optional<Person> oldCustomer = personRepository.findById(id);
        if (oldCustomer.isEmpty()) return badRequest().build();
        oldCustomer.get().setName(newName);
        Person newPerson = personRepository.save(oldCustomer.get());
        return ok().body(newPerson);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Person> deleteCustomer(Long customerId) {
        try {
            personRepository.deleteById(customerId);
            return ok().build();
        } catch (Exception e) {
            return status(NOT_FOUND).build();
        }
    }
}
