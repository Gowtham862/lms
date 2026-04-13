package com.lms.dto;

import lombok.Data;

@Data
public class BatchWithCourseDTO {
	
	  private long batchId;
	    private int batchno;
	    private AddCourseDto course;
	    private String batchstartdate;
	    private String batchendate;
	    private String maxstudentcapacity;
	    private com.lms.entity.status status;
	    

}
