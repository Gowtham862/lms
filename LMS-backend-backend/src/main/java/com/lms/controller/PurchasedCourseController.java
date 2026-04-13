package com.lms.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.config.ResponseStructure;
import com.lms.dto.BatchWithCourseDTO;
import com.lms.dto.CourseProgresDTO;
import com.lms.dto.PurchasedCourseDto;
import com.lms.dto.StudentListDto;
import com.lms.entity.AddCourse;
import com.lms.entity.UserPurchasedCourse;
import com.lms.service.PurchasedCourseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/purchase")
public class PurchasedCourseController {
	
	
	@Autowired
	PurchasedCourseService purchaseservice;
	
	@PostMapping("/add")
	public ResponseEntity<ResponseStructure<UserPurchasedCourse>> saveqbatch( @Valid @RequestBody UserPurchasedCourse purchasecourse)
	{
		return purchaseservice.savepurchasedcourse(purchasecourse);
	}
	
	 @GetMapping("/{userId}/getpurchasedcourses")
	    public ResponseEntity<ResponseStructure<List<AddCourse>>> getUserCourses(@PathVariable long userId) {
	        return  purchaseservice.getCoursesByUserI(userId);
	        
	    }

	 @GetMapping("/getbatchwithcourse")
	    public ResponseEntity<ResponseStructure<List<BatchWithCourseDTO>>> getBatches() {
//	        List<BatchWithCourseDTO> batches = purchaseservice.getAllBatchesWithCourse();
//	        return ResponseEntity.ok(batches);
		 return purchaseservice.getAllBatchesWithCourse();
	    }
	 
	 @GetMapping("/user/{userid}")
	 public ResponseEntity<ResponseStructure<UserPurchasedCourse>> checkUserPurchase(@PathVariable long userid) {
		return purchaseservice.enrolledcourse(userid);
		 
	 }
	 @GetMapping("/getall")
		public ResponseEntity<ResponseStructure<List<PurchasedCourseDto>>> getAllUser(){
			return purchaseservice.findAllUsers();
		}
	 
	 @GetMapping("/findstudents/{id}")
		public ResponseEntity<ResponseStructure<List<UserPurchasedCourse>>> findbyid(@PathVariable long id) {
		    return purchaseservice.findByBatchid(id);
		}
	 @GetMapping("/incompletecourses/{userId}")
	 public ResponseEntity<ResponseStructure<List<AddCourse>>> getIncompleteCourses(@PathVariable long userId) {
	     return purchaseservice.getIncompleteCoursesByUser(userId);
	 }
	 @GetMapping("/completedcourses/{userId}")
	 public ResponseEntity<ResponseStructure<List<AddCourse>>> getcompletepCourses(@PathVariable long userId) {
	     return purchaseservice.getIncompletedCoursesByUser(userId);
	 }
	 
	 @GetMapping("/course/{userId}")
	 public ResponseEntity<ResponseStructure<List<AddCourse>>> getcompletepCourse(@PathVariable long userId) {
	     return purchaseservice.courseidfalse(userId);
	 }
	 @GetMapping("/traineepurchases")
	 public ResponseEntity<ResponseStructure<Map<String, Long>>> getTraineePurchaseStats() {
	     ResponseStructure<Map<String, Long>> stats = purchaseservice.getTraineePurchaseStats();
	     return ResponseEntity.status(stats.getStatus()).body(stats);
	 }
	 
	 @GetMapping("/batch/{batchId}")
	 public ResponseStructure<List<StudentListDto>> getStudentsByBatch(
	         @PathVariable long batchId) {
	     return purchaseservice.fetchStudentsList(batchId);
	 }
	 
	 @GetMapping("/progress/{userid}")
	    public ResponseEntity<Map<String, Object>> getCourseProgress(@PathVariable long userid) {
	        Map<String, List<CourseProgresDTO>> progress = 
	        		purchaseservice.getUserCourseProgress(userid);
	        
	        Map<String, Object> response = new HashMap<>();
	        response.put("completed", progress.getOrDefault("completed", new ArrayList<>()));
	        response.put("incomplete", progress.getOrDefault("incomplete", new ArrayList<>()));
	        response.put("totalCourses", 
	            progress.values().stream().mapToInt(List::size).sum());
	        
	        return ResponseEntity.ok(response);
	    }



}
