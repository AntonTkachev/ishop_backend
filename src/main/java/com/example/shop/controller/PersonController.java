package com.example.shop.controller;

import com.example.shop.domain.Person;
import com.example.shop.projection.PersonProjection;
import com.example.shop.repository.PersonRepository;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class PersonController {

    @Autowired
    private final PersonRepository personRepository;
    private final ProjectionFactory pf = new SpelAwareProxyProjectionFactory();

    @Autowired
    public PersonController(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Person> createCustomer(@RequestBody Person newPerson) {
        Person savedPerson = personRepository.save(newPerson);
        return ok().body(savedPerson);
    }

    public ResponseEntity<Page<PersonProjection>> findAll(int pageNumber, int pageSize, String sortBy, String sortDir) {
        List<PersonProjection> rp = personRepository.findAll().stream()
                .map(el -> pf.createProjection(PersonProjection.class, el)).collect(Collectors.toList());
        Page<Person> page = personRepository.findAll(
                PageRequest.of(
                        pageNumber, pageSize,
                        sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending()
                ));

        Page<PersonProjection> page1 = new PageImpl<>(rp, page.getPageable(), page.getTotalElements());
        return new ResponseEntity<>(page1, HttpStatus.OK);
    }

    @GetMapping("/read")
    public ResponseEntity<Person> readCustomer(Long id) {
        return ok().body(personRepository.getById(id));
    }

    @GetMapping("/readAll")
    public ResponseEntity<List<PersonProjection>> findAllCustomers() {
        List<PersonProjection> rp = personRepository.findAll().stream()
                .map(el -> pf.createProjection(PersonProjection.class, el)).collect(Collectors.toList());
        return ok().body(rp);
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
    public ResponseEntity<String> deleteCustomer(Long customerId) {
        try {
            personRepository.deleteById(customerId);
            return ok().build();
        } catch (ExpiredJwtException ex) {
            return status(NOT_FOUND).build();
        } catch (Exception e) {
            return status(NOT_FOUND).build();
        }
    }
}
