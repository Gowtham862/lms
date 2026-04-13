package com.lms.dto;

import org.springframework.stereotype.Component;

import com.lms.entity.Role;

import lombok.Data;

@Component
@Data
public class UserDto {

	private String Id;
	private String username;
	private String Password;
	private String usermail;
	private Role role;

}
