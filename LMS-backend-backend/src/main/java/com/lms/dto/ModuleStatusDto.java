package com.lms.dto;

import java.util.List;

import lombok.Data;

@Data
public class ModuleStatusDto {
	
	private String moduleId;
    private String moduleName;
    private int totalSessions;
    private int completedSessions;
    private int pendingSessions;
    private List<SessionStatusDto> sessions;


}
