package com.lms.dto;

import java.time.LocalDate;
import java.util.Date;

import lombok.Data;

@Data
public class SessionDateDto {
	   private long sessionReportId;
	    private long courseId;
	    private String moduleno;
	    private LocalDate moduleStartDate;
	    private LocalDate moduleEndDate;
}
