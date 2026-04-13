package com.lms.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.lms.config.ResponseStructure;
import com.lms.entity.User;
import com.lms.repository.UserRepository;
import com.lms.service.UserService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
@RestController
@RequestMapping("/users")
@Slf4j

public class UsersController {

	@Autowired
	UserService userservice;

	@Autowired
	UserRepository userrepo;
   
	
	@PostMapping("/userdetails")
	public ResponseEntity<ResponseStructure<User>> saveusers(@Valid @RequestBody User user) {

        log.info("register is hitting");

		return userservice.saveuser(user);

	}

	@PostMapping("/login")
	public ResponseEntity<ResponseStructure<?>> loginuser(@RequestBody User u) {

		log.info("login is hitting");

		String name = u.getEmail();
		String password=u.getPassword();
		return userservice.loginuser(name, password);
		
	}

	@GetMapping("/findalltheusers")
	public ResponseEntity<ResponseStructure<List<User>>> findtheuser(@RequestParam int num) {
		System.out.println(num +"success");
		return userservice.findallusers(num);

	}

}