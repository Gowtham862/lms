package com.lms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.config.ResponseStructure;
import com.lms.dto.InterestedStudentDto;
import com.lms.entity.Batch;
import com.lms.entity.InterestedStudent;
import com.lms.service.InterestedStudentService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/intersted")
public class InterestedStudentController {

	@Autowired
	InterestedStudentService service;

	@PostMapping("/save/student")
	public ResponseEntity<ResponseStructure<InterestedStudent>> saveinterstedstudent(
			@Valid @RequestBody InterestedStudent student) {
		System.err.println(student);
		return service.interstedstudent(student);
	}

	@GetMapping("/findall/{num}")
	public ResponseEntity<ResponseStructure<List<InterestedStudentDto>>> findAllInterested(@PathVariable int num) {
		return service.findallintersestes(num);
	}
	
	@GetMapping("/findbyid/{id}")
	public ResponseEntity<ResponseStructure<InterestedStudent>> findbyid(@PathVariable long id) {
	    return  service.findinterstedstudentid(id);
	}
	
	 @PutMapping("/update/status/{id}")
	  public ResponseEntity<ResponseStructure<String>> updatStatus(
	            @PathVariable long id) {

	        return service.updateOtpStatus(id);
	    }
	 
	 @PutMapping("/update/denied/{id}")
	  public ResponseEntity<ResponseStructure<String>> interstestudentstatus(
	            @PathVariable long id) {

	        return service.interstedstudentdenied(id);
	    }
	 
	 @GetMapping("/status/{userId}")
	    public ResponseEntity<ResponseStructure<?>> checkPaymentStatus(
	            @PathVariable long userId) {

	        return service.checkPaymentStatus(userId);
	    }

}
