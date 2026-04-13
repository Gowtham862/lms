package com.lms.dto;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class AllcoursesDto {
	
	private String userid;
	private String courseid;
	private String description;
	private String status;
	private String tittle;
	private String category;

}
