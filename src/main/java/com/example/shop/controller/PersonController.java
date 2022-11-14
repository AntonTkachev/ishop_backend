package com.example.shop.controller;

import com.example.shop.domain.Person;
import com.example.shop.projection.PersonProjection;
import com.example.shop.projection.ProductProjection;
import com.example.shop.repository.PersonRepository;
import com.example.shop.utils.JwtTokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    @GetMapping("/readAll")
    public ResponseEntity<Page<PersonProjection>> findAll(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        List<PersonProjection> personList = personRepository.findAll(pageable).stream().map(el-> pf.createProjection(PersonProjection.class,el)).collect(Collectors.toList());
        Page<PersonProjection> page = new PageImpl<>(personList);
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping("/read")
    public ResponseEntity<PersonProjection> readCustomer(Long id) {
        Person person = personRepository.findById(id).get();
        return ok().body(pf.createProjection(PersonProjection.class, person));
    }

//    @GetMapping("/readAll")
//    public ResponseEntity<Iterable<Person>> findAllCustomers() {
//        return ok().body(personRepository.findAll());
//    }

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
