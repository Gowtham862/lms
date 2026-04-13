package com.lms.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class SessionReportsDto {
	
	


	    private Long sessionReportId;   // session report ID
	    private Long courseId;          // course ID
	    private Long batchId;           // batch ID
	    private String courseName;      // course name
	    private String moduleName;      // module name
	    private String moduleno;        // module ID
	    private String batchNo;         // batch number
	   

	    private LocalDate moduleStartDate; // first session start date
	    private LocalDate moduleEndDate;

}
