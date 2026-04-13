package com.lms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ModulesDto {
	
	@NotBlank(message = "Module no is required")
	private int moduleNo;
	@NotBlank(message = "Module name is required")
    private String moduleName;
    private String sessionDuration;
    private String totalsession;

}
