package com.lms.dto;

import java.util.List;

import lombok.Data;

@Data
public class CourseProgressDto {
	
	 private long courseId;
	    private long batchId;
	    private String courseName;
	    private String batchNo;
	    private List<ModuleStatusDto> modules;

}
