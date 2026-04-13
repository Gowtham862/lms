package com.lms.dto;

import lombok.Data;

@Data
public class ModuleSummaryDto {
	 private String moduleId;
	    private String moduleName;

	    private int totalSessions;
	    private int completedSessions;

	    private String moduleStatus;

}
