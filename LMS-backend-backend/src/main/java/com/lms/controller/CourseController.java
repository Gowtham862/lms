package com.lms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.config.ResponseStructure;

import com.lms.entity.Courses;
import com.lms.service.CourseService;
import org.springframework.http.MediaType;
import io.jsonwebtoken.io.IOException;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/courses")
@Slf4j
public class CourseController {

	@Autowired
	CourseService courservice;
	@PostMapping(value = "/uploa", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> saveCourses(@RequestPart
			("course") String courseJson,
			@RequestParam("file") MultipartFile[] files)
			throws IOException, JsonMappingException, JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		Courses courses = mapper.readValue(courseJson, Courses.class);
		return courservice.savecourse(courses, files);
	}

	@GetMapping("/getallcourses")
	public ResponseEntity<ResponseStructure<List<Courses>>> getllallcourses() {
		return courservice.findallthecourses();

	}

	@GetMapping("/coursesbyuserid/{userId}")
	public ResponseEntity<ResponseStructure<List<Courses>>> getCoursesByUserId(@PathVariable String userId) {
		return courservice.findCoursesByUserId(userId);
	}

	@GetMapping("/getactivecourses")
	public ResponseEntity<ResponseStructure<List<Courses>>> activecourses() {

		return courservice.findallactivatecourses();

	}

	@GetMapping("/getinactivecourses")
	public ResponseEntity<ResponseStructure<List<Courses>>> inactivecourses() {

		return courservice.findallinactivatecourses();

	}

	@PutMapping("/activate/{id}")
	public ResponseEntity<ResponseStructure<List<Courses>>> activatecourses(@PathVariable String id) {
		return courservice.activatethecoursesbyadmin(id);
	}
    

	@GetMapping("/usercourses/{id}")
	public ResponseEntity<ResponseStructure<List<Courses>>> usercourses(@PathVariable String id) {
		return courservice.allcoursesforuser(id);
	}
	
	@PutMapping("/inactivate/{id}")
	public ResponseEntity<ResponseStructure<List<Courses>>> rejectcourses(@PathVariable String id) {
		log.info("hitting");
		return courservice.rejectthecourse(id);
	}

}
