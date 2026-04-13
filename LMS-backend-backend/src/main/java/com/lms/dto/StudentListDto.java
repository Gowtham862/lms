package com.lms.dto;

import java.time.Instant;

import lombok.Data;
@Data
public class StudentListDto {
	
	 private String studentName;
	    private Instant enrollmentDate;
	    private Instant assignedDate;
	    private String courseName;
	    private int batchNo;

}
