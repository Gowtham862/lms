package com.lms.dto;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class TrainerBatchCountDto {
	
	 private Long trainerId;
	    private int activeBatches;
	    private int totalBatches;
	    private int completed;

}
