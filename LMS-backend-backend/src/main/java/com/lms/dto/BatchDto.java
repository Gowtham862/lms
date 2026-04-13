package com.lms.dto;

import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class BatchDto {
	
	
	private long courseid;
	private long Batchid;
	private int batchno;
	private String trainingmode;
	private String studentcapacity;
	private String startdate;
	private String Enddate;
    private String coursename;
    private String primarytrainer;
    private long primarytrainerid;
    private String backuptrainer;
    private long backuptrainerid;
    private com.lms.entity.status status;
  

}
