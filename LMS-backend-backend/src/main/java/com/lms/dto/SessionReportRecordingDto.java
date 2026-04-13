package com.lms.dto;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class SessionReportRecordingDto {
	
	   private Long sessionreportid;
	    private Long courseid;
	    private Long batchid;
	    private String coursename;
	    private String modulename;
	    private String moduleno;
	    private String batchno;
	    private String sessionno;
//	    private String trainername;
//	    private Long trainerid;
	    private boolean status;
	    private boolean recorded;
	    private List<Map<String, Object>> metadata;

}
