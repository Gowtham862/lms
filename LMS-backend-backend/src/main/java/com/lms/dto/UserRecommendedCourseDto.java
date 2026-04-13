package com.lms.dto;

import java.util.List;
import java.util.Map;

import com.lms.entity.AddCourse;
import com.lms.entity.status;

import lombok.Data;

@Data
public class UserRecommendedCourseDto {
	 private long userId;
	  private List<AddCourse> recommendedCourses;
	
	  private String primarytrainer;
	    private long primarytrainerid;
	
}
