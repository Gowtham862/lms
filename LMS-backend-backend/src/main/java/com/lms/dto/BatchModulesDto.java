package com.lms.dto;

import java.util.List;

import lombok.Data;

@Data
public class BatchModulesDto {
	
	private String moduleNo;
    private String moduleName;
    private String sessionDuration;
    private String totalsession;

    private List<BatchSessionDto> sessions;

}
