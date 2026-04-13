package com.lms.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.lms.entity.User;

import com.lms.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class UserDao {

	@Autowired
	UserRepository users;

	  @Autowired
	 private  PasswordEncoder passwordEncoder;
	public User saveuser(User user) {
		  String encryptedPassword = passwordEncoder.encode(user.getPassword());
		  user.setPassword(encryptedPassword);

			user.setUserid(System.currentTimeMillis());

		return users.save(user);

	}

	// find the user by name
//	public User findUserByName(String name) {
//		User userdetail = users.findByUsername(name);
//
//		if (userdetail != null) {
//			return userdetail;
//		} else {
//			return null;
//		}
//
//	}
//
	public User finduserbyemail(String email) {
		User useremail = users.email(email);
        log.info(email, useremail);;
		if (useremail != null) {
			return useremail;
		}
		return null;

	}

	// find the user details
	public List<User> findalluser(int number) {
		Pageable page = PageRequest.of(number, 5);
//		Pageable page = PageRequest.of(Math.max(number - 1, 0), 5);
		
		return users.findAllUser(page);

	}

}
