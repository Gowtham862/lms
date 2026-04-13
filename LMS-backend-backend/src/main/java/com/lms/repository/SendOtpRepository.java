package com.lms.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.lms.entity.SendOtp;

public interface SendOtpRepository extends MongoRepository<SendOtp, String>{
	
	
	@Query("{ 'user_id': ?0, 'otp': ?1, 'OTP_STATUS': 'A' }")
	SendOtp findValidOtp(String userId, String otp);


}
