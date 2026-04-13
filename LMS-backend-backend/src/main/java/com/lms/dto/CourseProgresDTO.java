package com.lms.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class CourseProgresDTO {
	
	  private long purchaseId;
	    private long courseId;
	    private String courseName;
	    private long batchId;
	    private String batchNo;
	    private String batchStartDate;
	    private String batchEndDate;
	    private int totalSessions;
	    private long trainerId;

	    private int completedSessions;
	    private String  coursedesc;
	    private String trainername;
	    private boolean completed;
	    private String status;
	    private Instant enrollDate;
	    private List<BatchModulesDto> modules;
	    
	    private List<Map<String, Object>> metadata;
	   
	    
	    // Calculated field
	    public double getProgressPercentage() {
	        if (totalSessions == 0) return 0.0;
	        return (completedSessions * 100.0) / totalSessions;
	    }

}
