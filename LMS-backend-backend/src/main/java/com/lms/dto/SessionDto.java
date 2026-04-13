package com.lms.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;

@Data
public class SessionDto {
	 private int sessionNo;
	    private String startDate;
	  
	    private String startTime;
	    private String endDate;
	   
	    private String endTime;

}
