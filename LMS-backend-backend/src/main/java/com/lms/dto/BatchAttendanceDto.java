package com.lms.dto;

import java.util.List;

import lombok.Data;

@Data
public class BatchAttendanceDto {
	
	 private long courseId;
	    private long batchId;
	    private String batchNo;  
	    private String coursename;
	    private String trainername;
	    private boolean courseCompleted;
	    private boolean status;
	    private int totalSessions;
	    private long trainerid;
	    private List<StudentAttendanceDto> students;
}
