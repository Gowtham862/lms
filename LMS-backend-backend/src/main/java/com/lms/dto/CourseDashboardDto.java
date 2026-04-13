package com.lms.dto;

import lombok.Data;

@Data
public class CourseDashboardDto {
	
	private long courseId;
    private String courseName;
    private long totalTrainers;
    private long totalBatches;
    private long totalSessions;
    private long totalTrainees;
 

}
