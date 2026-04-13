package com.lms.entity;

import java.util.List;
import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "certificate")
@Data
public class Certificate {
	
	 
	    private long certificateid;
	    private String username;
	    private String coursename;
	    private long userid;
	    private String filepath;
	    private long courseid;
	    private boolean status;
	    private String certificateStatus;
	    
	   
	    private List<Map<String, Object>> metadata;
}
