package com.lms.entity;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "User_Purchasedcourse")
@Data
public class UserPurchasedCourse {
	
	private long purchaseid;
	private long courseid;
	private long userid;
	private long batchid;
    private String status;
    private String username;
    private String useremail;
    private String coursename;
    private String batchstartdate;
    private String batchno;
    private boolean complete;
    private String usercontact;
    @CreatedDate
	private Instant EnrollDate;
   
    
}
