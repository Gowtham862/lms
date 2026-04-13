package com.lms.repository;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.lms.entity.LoginUser;


public interface LoginUserRepository extends MongoRepository<LoginUser, String> {
	
	boolean existsByEmail(String email);
	
	 public LoginUser email(String email);
	 Optional<LoginUser> findByEmail(String email);


}
