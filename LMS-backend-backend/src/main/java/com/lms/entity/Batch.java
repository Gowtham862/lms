package com.lms.entity;
import java.time.Instant;
import java.util.List;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.lms.dto.BatchModulesDto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Document(collection = "Batch")
@Data
public class Batch {
	
	@Field("course_id")
	private long courseid;
	@Field("Batch_id")
	private long Batchid;
    @Field("batch_no")
    @Indexed(unique = true)
    @Min(value = 1, message = "Batch number must be greater than 0")
	private int batchno;
    
    private String coursedesc;
    @Field("training_ngmode")
    @NotBlank(message = "trainingmode is required")
	private String trainingmode;
    @Field("Student_capacity")
    @NotBlank(message = "studentcapacity is required")
	private String studentcapacity;
    @Field("start_data")
    @NotBlank(message = "startdate is required")
	private String startdate;
    @Field("end_date")
	private String Enddate;
    @Field("coursename")
    @NotBlank(message = "coursename is required")
    private String coursename;
    @Field("status")
    private status status;
    @Field("primarytrainer")
    @NotBlank(message = "primarytrainer is required")
    private String primarytrainer;
    @Min(value = 1, message = "primarytrainerid is required")
    private long primarytrainerid;
    
    private String backuptrainer;
    private long backuptrainerid;
    private int totalsessions;
    @Field("modules")
    private List<BatchModulesDto> modules;
  
    
}
