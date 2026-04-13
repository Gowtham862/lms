package com.lms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.config.ResponseStructure;
import com.lms.dto.AddTrainerDto;
import com.lms.dto.TrainerCountDto;
import com.lms.dto.UpdateCourseDto;
import com.lms.entity.AddTrainer;
import com.lms.service.AddTrainerService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/addtrainer")
@Slf4j
public class AddTrainerController {
	
	@Autowired
	private AddTrainerService addtrainerservice;
	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseStructure<AddTrainerDto>>saveqbatch(@Valid @RequestPart("trainer") String courseJson,
			@RequestParam("file") MultipartFile[] files) throws JsonMappingException, JsonProcessingException
	{
		ObjectMapper mapper = new ObjectMapper();
		AddTrainer trainer = mapper.readValue(courseJson, AddTrainer.class);
		return addtrainerservice.savetrainer(trainer,files);
	}
	
//	@PatchMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<ResponseStructure<String>> updatetrainer(@PathVariable long id,
//            @RequestBody AddTrainerDto request,
//            @RequestPart(value = "files", required = false) MultipartFile[] files) {
//
//		return addtrainerservice.updateTrainer(id, request);
//
//        
//    }

	
	@PatchMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseStructure<String>> updatetrainer(
	        @PathVariable long id,
	        @RequestPart("trainer") String trainerJson,
	        @RequestPart(value = "files", required = false) MultipartFile[] files) 
	        throws JsonMappingException, JsonProcessingException {
	    
	    ObjectMapper mapper = new ObjectMapper();
	    AddTrainerDto request = mapper.readValue(trainerJson, AddTrainerDto.class);
	    return addtrainerservice.updateTrainer(id, request, files);
	}
	@GetMapping("/getalltrainer")
	public ResponseEntity<ResponseStructure<List<AddTrainer>>> getllalltrainer() {
		return addtrainerservice.findallthetrainer();

	}
	
	@PutMapping("/deactivate/{id}")
	public ResponseEntity<ResponseStructure<List<AddTrainer>>> activatecourses(@PathVariable String id) {
		return addtrainerservice.deactivethetrainer(id);
	}
	
	@GetMapping("/findbyid/{id}")
	public ResponseEntity<ResponseStructure<AddTrainer>> findbyid(@PathVariable long id) {
		log.info("hitting");
		return addtrainerservice.findbyid(id);
	}
	 @GetMapping("/stats")
	    public ResponseEntity<ResponseStructure<TrainerCountDto>> getTrainerStats() {
	        return addtrainerservice.getTrainerCounts();
	    }

}
