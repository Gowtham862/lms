package com.lms.dto;

import org.springframework.stereotype.Component;

import com.lms.entity.Role;

import lombok.Data;

@Component
@Data
public class UsersDto {
	
	private String Id;
	private String firstname;
	private Role role;
	private String lastname;
	private String password;
	private String email;
	private String companyId;
	private String status;


}
