package com.lms.entity;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "Recording_Sessions")
@Data
public class RecordingSessions {
	
	
	    private Long recordingsessionid;
	   private Long sessionreportid;
	    private Long courseid;
	    private Long batchid;
	    private String coursename;
	    private String modulename;
	    private String moduleid;
	    private String batchno;
	    private String sessionno;
	    @CreatedDate
		private Instant EnrollDate;
	    private List<Map<String, Object>> metadata;
	    private Long trainerid;
	    private boolean status;
	
	

}
