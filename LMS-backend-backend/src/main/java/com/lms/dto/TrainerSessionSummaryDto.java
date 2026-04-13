package com.lms.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class TrainerSessionSummaryDto {
	
	
	 private Instant createdDate;
	 private List<Map<String, Object>> metadata;   
	    private String batchno;
	    private String coursename;

}
