package com.lms.dto;

import java.util.List;

import lombok.Data;

@Data
public class ModuleDetailDto {
	private String moduleNo;
    private String moduleName;
    private int totalSessions;
    private int completedSessions;
    private List<SessionDetailDto> sessions;

}
