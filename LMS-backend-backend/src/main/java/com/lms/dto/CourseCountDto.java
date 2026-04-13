package com.lms.dto;

import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
public class CourseCountDto {
	
	 private long totalCourses;
	    private long publishedCourses;
	    private long sessioncount;
	    private long totalcertificate;
	    private long Archived;

}
