package com.lms.dto;

import java.util.List;

import lombok.Data;
@Data
public class AllAttendanceResponseDto {
	
	 private List<BatchAttendanceDto> batches;

}
