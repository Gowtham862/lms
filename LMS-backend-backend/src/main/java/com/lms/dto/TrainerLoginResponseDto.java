package com.lms.dto;

import org.springframework.stereotype.Component;

import com.lms.entity.Role;

import lombok.Data;

@Component
@Data
public class TrainerLoginResponseDto {
	
	
	private long userid;
	private  Role role;
	private String firstname;
	private String email;
	private String token;
	private long phone;

}
