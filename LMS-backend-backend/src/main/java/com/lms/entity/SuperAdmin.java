package com.lms.entity;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;



@Data
@Document(collection = "superAdmin") 
public class SuperAdmin {
@Id
   
	
	private Long adminid;
	private String adminname;
	private String personalemailid;
	private String contactnumber;
	private String dateofbirth;
	private String address;
	private String state;
	private String  city;
	private String loginemail;
	private String temporaraypassword;
	@CreatedDate
	private Instant createdDate;
	private String Date;
    private Role adminrole;
	private AdminStatus adminstatus;
	private List<Map<String, Object>> metadata;
}
