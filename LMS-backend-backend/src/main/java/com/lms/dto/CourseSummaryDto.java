package com.lms.dto;

import java.util.List;

import lombok.Data;

@Data
public class CourseSummaryDto {
	
	private long courseId;
    private long batchId;

    private String courseName;
    private String batchNo;
    private String trainerName; 
    private int totalModules;
    private int modulesCompleted;
    private int modulesInProgress;
    private int modulesPending;
    private int courseCompletionPercentage;

    private List<ModuleSummaryDto> modules;

}
