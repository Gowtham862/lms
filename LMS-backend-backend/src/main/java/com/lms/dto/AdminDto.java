package com.lms.dto;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class AdminDto {

	
	private String Id;
	private String adminname;
	private String adminEmail;
//	private String adminPassword;
	private String adminpassword;
}
