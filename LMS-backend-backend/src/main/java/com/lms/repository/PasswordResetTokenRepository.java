package com.lms.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.lms.entity.PasswordResetToken;
import com.lms.entity.User;


@Repository
public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
//	@Query("{ 'email': ?0, 'used': false }")
//	public PasswordResetToken email(String email);
	
	List<PasswordResetToken> findByEmailAndUsedFalse(String email);
	
	 public PasswordResetToken email(String email);

    PasswordResetToken findByTokenAndUsedFalse(String token);
}
