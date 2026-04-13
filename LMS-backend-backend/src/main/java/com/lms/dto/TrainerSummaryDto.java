package com.lms.dto;

import lombok.Data;

@Data 
public class TrainerSummaryDto {
	

    private Long trainerId;
    private String trainerName;
    private int totalCourses;
    private int totalBatches;
    private int totalSessions;

}
