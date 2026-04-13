package com.lms.dto;

import lombok.Data;

@Data
public class StudentAttendanceDto {

	
	 private long studentId;
	    private String name;
     
	    // total sessions student attended (present = true)
	    private int attendedSessions;

	    // attendance percentage
	    private double attendancePercentage;

	    // certificate eligibility flag
	    private boolean certificateEligible;

	    // optional fields (future use)
	    private long courseId;
	    private long batchId;
	    private boolean alreadyCertified;
	    boolean alreadyRejected;;
}
