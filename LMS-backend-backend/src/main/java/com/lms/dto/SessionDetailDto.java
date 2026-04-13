package com.lms.dto;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import lombok.Data;


@Data
public class SessionDetailDto {
	 private Long sessionReportId;
	    private String sessionNo;
	    private List<Map<String, Object>> metadata;

}
