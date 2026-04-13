package com.lms.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import lombok.Data;
@Data
public class SessionRecordingVideoDto {
	
	private Long sessionReportId;
    private String sessionNo;
    private List<Map<String, Object>> documentsMetadata;  // From SessionReport
    private List<Map<String, Object>> recordingMetadata;
    private String uploadedby;
    private Instant uploadeddate;

}
