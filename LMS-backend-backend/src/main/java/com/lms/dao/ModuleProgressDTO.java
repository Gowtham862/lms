package com.lms.dao;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

import com.lms.dto.BatchModulesDto;

@Data
@EqualsAndHashCode(callSuper = true)
public class ModuleProgressDTO extends BatchModulesDto {
    
    private int completedSessions;
    private double moduleProgress;
    
    // Constructor to convert from BatchModulesDto
    public ModuleProgressDTO(BatchModulesDto batchModule, int completedSessions, double moduleProgress) {
        this.setModuleNo(batchModule.getModuleNo());
        this.setModuleName(batchModule.getModuleName());
        this.setSessionDuration(batchModule.getSessionDuration());
        this.setTotalsession(batchModule.getTotalsession());
        this.setSessions(batchModule.getSessions());
        this.completedSessions = completedSessions;
        this.moduleProgress = moduleProgress;
    }
}
