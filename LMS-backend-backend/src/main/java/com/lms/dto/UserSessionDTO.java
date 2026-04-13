package com.lms.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.lms.entity.StudentAttendance;

import lombok.Data;
@Component
@Data
public class UserSessionDTO {
	  private String trainername;
	  private String courseid;
	    private Instant createdDate;
        private String coursename;
		private List<StudentAttendance> attendance;
	   private List<Map<String, Object>> metadata;
	   

}
