package com.lms.dto;

import java.time.Instant;

import org.springframework.stereotype.Component;



import lombok.Data;

@Component
@Data
public class PurchasedCourseDto {
 
	
	private long  purchaseid;
	private long courseid;
	private long userid;
	private long batchid;
	private String username;
    private String useremail;
    private String status;
    private String coursename;
    private String batchstartdate;
    private String batchno;
    private String usercontact;
    private Instant EnrollDate;
	
}
