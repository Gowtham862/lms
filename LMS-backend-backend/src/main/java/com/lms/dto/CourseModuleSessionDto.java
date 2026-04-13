package com.lms.dto;

import java.util.List;

import lombok.Data;

@Data
public class CourseModuleSessionDto {
	
	 private Long courseId;
	    private String courseName;
	    private int totalModules;
	    private int totalSessions;
	    private List<ModuleDetailDto> modules;

}
