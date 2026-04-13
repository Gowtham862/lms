package com.lms.dto;

import lombok.Data;

@Data
public class BatchSessionDto {
	
	private int sessionNo;         
	 
     private String starttime;
     private String endtime;
    private String sessionstartdate;    
    private String sessionenddate;
    private boolean completed;

}
