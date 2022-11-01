package com.example.shop.controller;

import com.example.shop.domain.Person;
import com.example.shop.repository.PersonRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Objects;

@SpringBootTest
public class PersonControllerTest {

    PersonRepository localMockRepository = Mockito.mock(PersonRepository.class);
    PersonController personController;
    Person person = new Person("Ivan");

    @Before
    public void init() {
        personController = new PersonController(localMockRepository);
        Mockito.when(localMockRepository.save(person)).thenReturn(person);
    }

    @Test
    public void createUser() {
        ResponseEntity<Person> entity = personController.createCustomer(person);
        Assert.assertEquals(Objects.requireNonNull(entity.getBody()).getName(), "Ivan");
    }

    @Test
    public void findAll() {
        ResponseEntity<List<Person>> entity = personController.findAllCustomers();
        Assert.assertEquals(entity.getStatusCode(), HttpStatus.OK);
    }
}
