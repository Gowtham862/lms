package com.lms.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.lms.entity.AdminRole;
import com.lms.entity.AdminStatus;

import lombok.Data;
@Component
@Data
public class SuperAdminDto {

	
	private long adminid;
	private String adminname;
	private String personalemailid;
	private String contactnumber;
	private String dateofbirth;
	private String address;
	private String state;
	private String  city;
	private String loginemail;
	private String temporaraypassword;
	private Instant CreatedDate;
	    private AdminRole adminrole;
 
	   
	    private AdminStatus adminstatus;
 
	
	    private List<Map<String, Object>> metadata;
}
