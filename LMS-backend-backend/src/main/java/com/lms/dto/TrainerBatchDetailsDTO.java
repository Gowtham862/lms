package com.lms.dto;

import java.util.List;

import lombok.Data;

@Data
public class TrainerBatchDetailsDTO {
	


    private long courseId;
    private String courseName;
    private long batchId;
    private int batchNo;
    private String trainingMode;
    private String studentCapacity;
    private String startDate;
    private String moduleid;
    private String endDate;
    private String batchStatus;
    private long primaryTrainerId;
    private long backupTrainerId;
    private String assignedDate;
    private int totalSessions;  // Original total sessions in batch
    private int totalRemainingSessions;  // Sessions not yet completed
    private int totalCompletedSessions;  // Sessions already completed
//    private List<BatchModulesDto> modules;
    private List<ModuleDto> modules;

}
