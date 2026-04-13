package com.lms.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class TrainerProgressDto {
	
        
	   private long batchid;
	    private long courseId;
	    private String courseName;
	    private int batchNo;
	    private String batchStartDate;
	    private String batchEndDate;
	    private int totalSessions;
	    private int completedSessions;
	    private int trainerCompletedSessions;
	    private boolean completed;
	    private String status;
	    private String trainerRole;
	    private String trainingMode;
	    private String studentCapacity;
	    private String primaryTrainerName;
	    private String coursedesc;
	    private List<BatchModulesDto> modules;
	    private List<Map<String, Object>> metadata;
	    
	    public double getProgressPercentage() {
	        if (totalSessions == 0) return 0.0;
	        return (completedSessions * 100.0) / totalSessions;
	    }
	    
	    public double getTrainerContributionPercentage() {
	        if (totalSessions == 0) return 0.0;
	        return (trainerCompletedSessions * 100.0) / totalSessions;
	    }
}
