package com.example.shop.controller;

import com.example.shop.projection.UpdatePassProjection;
import com.example.shop.domain.Person;
import com.example.shop.repository.PersonRepository;
import com.example.shop.repository.RoleRepository;
import com.example.shop.utils.JwtTokenProvider;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
//fixme WTF???
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    private static Logger log = LoggerFactory.getLogger(LoginController.class);

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    private final JwtTokenProvider tokenProvider;
    private final RoleRepository roleRepository;
    private final PersonRepository personRepository;

    @Autowired
    public LoginController(JwtTokenProvider tokenProvider,
                           PersonRepository personRepository,
                           RoleRepository roleRepository) {
        this.tokenProvider = tokenProvider;
        this.personRepository = personRepository;
        this.roleRepository = roleRepository;
    }

    @PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> register(@RequestBody Person person) {
        log.info("LoginController : register");
        JSONObject jsonObject = new JSONObject();
        try {
            if (personRepository.findByEmail(person.getEmail()) != null) {
                jsonObject.put("exception", "User with email: " + person.getEmail() + " already registered!");
                return new ResponseEntity<>(jsonObject.toString(), HttpStatus.NOT_FOUND);
            }
            person.setPassword(encoder.encode(person.getPassword()));
            person.setRole(roleRepository.findByName(person.getRole().getName()));
            Person savedPerson = personRepository.save(person);
            jsonObject.put("message", savedPerson.getName() + " saved successfully");
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        } catch (JSONException | DataIntegrityViolationException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException ex) {
                ex.printStackTrace();
            }
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping(value = "/authenticate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> authenticate(@RequestBody Person person) {
        log.info("LoginController : authenticate");
        JSONObject jsonObject = new JSONObject();
        try {
            Person findPerson = personRepository.findByEmail(person.getEmail());
            if (findPerson == null) {
                jsonObject.put("exception", "User with mail: '" + person.getEmail() + "' doesn't exist!");
                return new ResponseEntity<>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
            }
            String email = findPerson.getEmail();
            if (!encoder.matches(person.getPassword(), findPerson.getPassword())) {
                jsonObject.put("exception", "Wrong password for user with mail: '" + person.getEmail() + "'");
                return new ResponseEntity<>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
            }
            jsonObject.put("name", findPerson.getName());
            jsonObject.put("role", findPerson.getRole().getName());
            jsonObject.put("token", tokenProvider
                    .createToken(email, findPerson.getName(), personRepository.findByEmail(email).getRole()));
            jsonObject.put("message", findPerson.getName() + " login successfully");
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException ex) {
                ex.printStackTrace();
            }
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping(value = "/updatePassword", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updatePassword(@RequestBody UpdatePassProjection projection) {
        JSONObject jsonObject = new JSONObject();
        try {
            Person findPerson = personRepository.findByEmail(projection.getEmail());
            if (!encoder.matches(projection.getPassword(), findPerson.getPassword())) {
                jsonObject.put("exception", "Password for user is wrong!");
                return new ResponseEntity<>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
            }
            findPerson.setPassword(encoder.encode(projection.getPassword()));
            personRepository.save(findPerson);
            jsonObject.put("name", findPerson.getName());
            jsonObject.put("role", findPerson.getRole().getName());
            jsonObject.put("token", tokenProvider
                    .createToken(projection.getEmail(), findPerson.getName(), personRepository.findByEmail(projection.getEmail()).getRole()));
            jsonObject.put("message", findPerson.getName() + " password change successfully");
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException ex) {
                ex.printStackTrace();
            }
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
        }
    }
}
