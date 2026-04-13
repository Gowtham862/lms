package com.lms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.lms.config.ResponseStructure;
import com.lms.dto.PasswordDto;
import com.lms.entity.SendOtp;
import com.lms.entity.User;

import com.lms.service.ForgotPasswordService;


import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequestMapping(value = "/forgotpassword")
public class ForgotPasswordController {
	
	@Autowired
	ForgotPasswordService forgotpasswordservice;
	
	@PostMapping("/sendOtp/{mailId}")
	public ResponseEntity<ResponseStructure<List<SendOtp>>> sendOtp(@PathVariable String mailId) {
		log.info("SendOtp controller method called");
		System.err.println(mailId);
		return  forgotpasswordservice.sendOtp(mailId);

	}
	@PostMapping("/verifyCode")
	public ResponseEntity<ResponseStructure<List<SendOtp>>> verifyCode(@RequestBody SendOtp sendotp) {
		log.info("Verify code controller method called");
		return forgotpasswordservice.verifyCode(sendotp);
	}
	
	@PostMapping("/changepassword")
	public ResponseEntity<ResponseStructure<List<User>>> changePasword(@RequestBody PasswordDto user) {
		log.info("Change password controller method called");
		System.err.println(user);
//		System.out.println(user.getId());
//		System.out.println(user.getPassword());
		return forgotpasswordservice.changePassword(user);
	}

}
