package com.lms.dto;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class InterestedStudentDto {
	
	private long interstedid;
	
	private long courseid;
	
	private long userid;
	
	private long batchid;
	
	private String status;
	
	private String username;
	
	private String useremail;
	
	private String coursename;
	
	private String batchstartdate;
	
	private int batchno;
	
	private boolean complete;
	
	private String currentstatus;
	
	private String nextstatus;

	private String usercontact;
	
	private Instant enrollDate;

}
