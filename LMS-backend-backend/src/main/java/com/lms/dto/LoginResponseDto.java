package com.lms.dto;

import com.lms.entity.Role;

import lombok.Data;

@Data
public class LoginResponseDto {
	private String token;
	
	private Role role;
	private String email;

	private String firstname;
	private long userid;
	private long phone;

	
	

	

	

	
}