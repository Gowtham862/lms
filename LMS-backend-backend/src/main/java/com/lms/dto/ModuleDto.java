package com.lms.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ModuleDto {
	
	     private String moduleId;
	    private String moduleName;
	    private String moduleDescription;
	    private String moduleDuration;
	    private List<SessionDto> sessions;

}
