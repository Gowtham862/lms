package com.lms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.lms.dto.EmailDto;
import com.lms.service.Mailservice;

@RestController
@RequestMapping("/email")
public class MailController {

	
	@Autowired
	Mailservice mailservice;
	@PostMapping("/text")
	public String sendmail( String to,  String fullname, String email,String password)
	{
		mailservice.sendRegistrationEmail("gowthamk712812@gmail.com", "gowtham", "<no-reply@accounts.google.com>", "koko");
		return "Mail sendted successfully";
	}
	@PostMapping("/dynamic")
	public String emailcheck(@RequestBody EmailDto dto)
	{
//		return "Registerded successfully";
		return mailservice.trailemail(dto);
	}

}
