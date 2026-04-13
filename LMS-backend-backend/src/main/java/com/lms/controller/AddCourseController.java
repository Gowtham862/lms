package com.lms.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.config.ResponseStructure;
import com.lms.dto.CourseCountDto;
import com.lms.dto.CourseDashboardDto;
import com.lms.dto.UpdateCourseDto;
import com.lms.dto.UserRecommendedCourseDto;
import com.lms.entity.AddCourse;
import com.lms.repository.AddCourseRepository;
import com.lms.service.AddCourseService;

import io.jsonwebtoken.io.IOException;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/addnewcourses")
@Slf4j
public class AddCourseController {

	@Autowired
	AddCourseService addcourservice;
	@Autowired
	AddCourseRepository courserepository;
	
	@PostMapping(value = "/uploa", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> saveCourses(@RequestPart("course") String courseJson,
			@RequestParam("file") MultipartFile[] files)
			throws IOException, JsonMappingException, JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		AddCourse courses = mapper.readValue(courseJson, AddCourse.class);
		System.err.println(courses + "hlo");
		return addcourservice.savecourse(courses, files);
	}

	@GetMapping("/getallcourses")
	public ResponseEntity<ResponseStructure<List<AddCourse>>> getllallcourses() {
		return addcourservice.findallthecourses();

	}

	@GetMapping("/getpublishedcourse")
	public ResponseEntity<ResponseStructure<List<AddCourse>>> getpublishedcourses() {
		return addcourservice.getpublishedCourses();

	}

	@DeleteMapping("/courses/{courseId}/modules/{moduleId}")
	public ResponseEntity<ResponseStructure<String>> deleteModule(@PathVariable String courseId,
			@PathVariable String moduleId) {
		log.info("hi", courseId, moduleId);
		System.err.println(courseId);
		System.err.println(moduleId);
		return addcourservice.deleteModule(courseId, moduleId);
	}

	@GetMapping("/findbyid/{id}")
	public ResponseEntity<ResponseStructure<AddCourse>> findbyid(@PathVariable long id) {
		return addcourservice.findByCourseId(id);
	}

	@PatchMapping(value = "/updatecourse/{courseId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseStructure<String>> updateCourse(@PathVariable long courseId,
			@RequestPart("course") String courseJson,
			@RequestPart(value = "files", required = false) MultipartFile[] files)
			throws JsonMappingException, JsonProcessingException {
		log.info("PATCH received. courseId={}", courseId);
		log.info("DTO={}", courseJson);
		log.info("Files count={}", files == null ? 0 : files.length);
		ObjectMapper mapper = new ObjectMapper();
		UpdateCourseDto dto = mapper.readValue(courseJson, UpdateCourseDto.class);
		return addcourservice.updateCourse(courseId, dto, files);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<ResponseStructure<AddCourse>> deleteCart(@PathVariable long id) {
		return addcourservice.deleteCourse(id);
	}

	@GetMapping("/count")
	public ResponseEntity<ResponseStructure<CourseCountDto>> getCourseCounts() {
		return addcourservice.getCourseCounts();
	}

	@GetMapping("/overview/trainee")
	public ResponseStructure<List<CourseDashboardDto>> getCourseDashboard() {

		return addcourservice.getCourseDashboard();
	}
	
	@GetMapping("/recommended")
	public ResponseEntity<ResponseStructure<List<AddCourse>>> getAllRecommendedCourses() {

	    // Get all courses first
	    List<AddCourse> allCourses = courserepository.findAll();

	    // Extract all recommended IDs from every course
	    List<Long> recommendedIds = allCourses.stream()
	            .filter(c -> c.getRecommendedCourseIds() != null)
	            .flatMap(c -> c.getRecommendedCourseIds().stream())
	            .map(Long::valueOf)
	            .distinct()
	            .toList();

	    if (recommendedIds.isEmpty()) {
	        ResponseStructure<List<AddCourse>> response = new ResponseStructure<>();
	        response.setMessage("No recommended courses found");
	        response.setStatus(404);
	        response.setData(List.of());
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	    }

	    // Fetch recommended courses
	    List<AddCourse> recommendedCourses =
	            courserepository.findByCourseidIn(recommendedIds);

	    ResponseStructure<List<AddCourse>> structure = new ResponseStructure<>();
	    structure.setMessage("Recommended courses fetched successfully");
	    structure.setStatus(200);
	    structure.setData(recommendedCourses);

	    return ResponseEntity.ok(structure);
	}

	@GetMapping("/recommended/{courseId}")
    public ResponseEntity<ResponseStructure<List<AddCourse>>> 
    getRecommendedCourses(@PathVariable long courseId) {

        return addcourservice.getRecommendedCourse(courseId);
    }
	@GetMapping("/recommended/user/{userId}")
    public ResponseEntity<ResponseStructure<UserRecommendedCourseDto>> getRecommendedCoursesByUser(
            @PathVariable long userId) {
        return addcourservice.getRecommendedCoursesByUserId(userId);
    }

}
