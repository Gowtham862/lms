package com.lms.dto;

import java.time.LocalDate;


import lombok.Data;
@Data
public class ModuleDateDto {
	
	  private long sessionReportId;
	    private long courseId;
	    private String moduleId;
	    private String coursename;
       private String modulename;
       private String batchno;
       private long batchid;
	    private String moduleStartDate;
	    private boolean moduleCompleted;

	    private String moduleEndDate;
	    private long trainerId;
	    private String trainerName;

}
