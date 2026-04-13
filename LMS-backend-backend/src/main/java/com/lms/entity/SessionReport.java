package com.lms.entity;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "session_reports")
@Data
public class SessionReport {
	
	private long sessionreportid;
	private long courseid;
	private long batchid;
	private String coursename;
    private String modulename;
    private String moduleno;
    private String batchno;
	private String sessionno;
	private Date startdate;
	private Date enddate;
	private String trainername;
	private long trainerid;
	private boolean status;
	@CreatedDate
	private Instant CreatedDate;
	private List<StudentAttendance> attendance;
   private List<Map<String, Object>> metadata;
   private List<FileMetadata> metadat;

}
