package com.lms.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.lms.config.ResponseStructure;
import com.lms.dto.TrainerBatchCountDto;
import com.lms.dto.TrainerBatchDetailsDTO;
import com.lms.dto.TrainerSummaryDto;
import com.lms.entity.AddCourse;
import com.lms.entity.Batch;
import com.lms.service.BatchService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
@RestController
@RequestMapping("/batch")
@Slf4j
public class BatchController {
	
	@Autowired
	BatchService batchservice;
	
	@PostMapping("/add")
	public ResponseEntity<ResponseStructure<List<Batch>>> saveqbatch(@Valid @RequestBody Batch batch)
	{
		return batchservice.savebatch(batch);
	}
	@GetMapping("/getallbatch")
	public ResponseEntity<ResponseStructure<List<Batch>>> getllallcourses() {
		return batchservice.findallthebatch();

	}
	@GetMapping("/findbyid/{id}")
	public ResponseEntity<ResponseStructure<Batch>> findbyid(@PathVariable long id) {
	    return  batchservice.findcoursebyid(id);
	}
	@GetMapping("/findbybatchid/{id}")
	public ResponseEntity<ResponseStructure<Batch>> findbybatchid(@PathVariable long id) {
	    return  batchservice.findbybatchid(id);
	}
	@PatchMapping("/update/{batchId}")
	public ResponseEntity<ResponseStructure<String>> updateBatch(
	        @PathVariable long batchId,
	        @RequestBody com.lms.dto.UpdateBatchDto dto) {

	    return batchservice.updateBatchByBatchId(batchId, dto);
	}
	
	@GetMapping("/trainer/{trainerId}")
	public ResponseEntity<?> getTrainerBatches(@PathVariable long trainerId) {
	    return batchservice.getTrainerBatchesWithCourse(trainerId);
	}
//	@GetMapping("/trainer/{trainerId}")
//	public List<Map<String, Object>> getTrainerBatches(@PathVariable long trainerId) {
//	    return batchservice.getTrainerPendingSessions(trainerId);
//	}
	

	 @GetMapping("/batchcounts/{trainerId}")
	    public ResponseEntity<TrainerBatchCountDto> getBatchCounts(
	            @PathVariable Long trainerId) {

	        TrainerBatchCountDto response =
	                batchservice.getTrainerBatchCounts(trainerId);

	        return ResponseEntity.ok(response);
	    }


	 @GetMapping("/incompletedcours/{trainerId}")
	 public ResponseEntity<List<AddCourse>> getinCompletedUsersByTrainer(
	         @PathVariable long trainerId) {

	     List<AddCourse> data = batchservice.getIncompleteCoursesByTrainer(trainerId);
	     return ResponseEntity.ok(data);
	 }
	 
	 @GetMapping("/completedcours/{trainerId}")
	 public ResponseEntity<List<AddCourse>> getCompletedUsersByTrainer(
	         @PathVariable long trainerId) {

	     List<AddCourse> data = batchservice.getcompleteCoursesByTrainer(trainerId);
	     return ResponseEntity.ok(data);
	 }
	 
	 @GetMapping("/summary")
	    public ResponseEntity<List<TrainerSummaryDto>> getTrainerSummary() {
	        return ResponseEntity.ok(batchservice.getTrainerSummary());
	    }
	 @GetMapping("/total/count")
	 public ResponseEntity<ResponseStructure<Map<String, Long>>> getBatchCounts() {
	     return ResponseEntity.ok(batchservice.getBatchCountss());
	 }
	 
	 
	 @GetMapping("/trainerprogress/{trainerId}")
	    public ResponseEntity<?> getTrainerBatchProgress(@PathVariable long trainerId) {
	        return batchservice.getTrainerBatchProgress(trainerId);
	    }
	 
	  @GetMapping("/details/{primaryTrainerId}")
	    public ResponseEntity<ResponseStructure<List<TrainerBatchDetailsDTO>>> getCompleteBatchDetails(
	            @PathVariable long primaryTrainerId) {
//	        return batchservice.getCompleteBatchDetailsForPrimaryTrainer(primaryTrainerId);
		  
		  return batchservice.getCompleteBatchDetailsForPrimaryTrainer(primaryTrainerId);
	    }
	  
	  @GetMapping("/trainer/course/{courseId}")
	    public ResponseEntity<?> getTrainer(@PathVariable long courseId) {
	        return ResponseEntity.ok(
	        		batchservice.getTrainerByCourseId(courseId)
	        );
	    }

	
}
