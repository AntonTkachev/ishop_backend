package com.example.shop.repository;

import com.example.shop.domain.Person;
import com.example.shop.projection.PersonProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {

    Person findByEmail(String email);

    Page<PersonProjection> findAllBy(Pageable pageable);
}
