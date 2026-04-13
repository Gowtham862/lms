package com.lms.dto;

import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
public class SuperAdminCount {
	
	private long totaladmins;
	private long totalactiveadmins;

}
