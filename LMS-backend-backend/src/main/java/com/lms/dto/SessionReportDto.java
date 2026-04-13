package com.lms.dto;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.lms.entity.StudentAttendance;

import lombok.Data;

@Component
@Data
public class SessionReportDto {
	
	private long sessionreportid;
	private long courseid;
	private long batchid;
	private String coursename;
    private String modulename;
    private String moduleno;
    private String batchno;
	private String sessionno;
	private List<StudentAttendance> attendance;
   private List<Map<String, Object>> metadata;
	

}
