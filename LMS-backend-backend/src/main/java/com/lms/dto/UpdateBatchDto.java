package com.lms.dto;

import java.time.Instant;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class UpdateBatchDto {

	private int batch_no;
	private String training_ngmode;

	@JsonProperty("Student_capacity")
	private String studentCapacity;
	private String start_data;
	private String end_date;
	private String coursename;
	private String status;
	private String primarytrainer;
	private long primarytrainerid;
	private String backuptrainer;
	private long backuptrainerid;
	private Instant AssignedDate;
	private int totalsessions;
	private List<BatchModulesDto> modules;

}
