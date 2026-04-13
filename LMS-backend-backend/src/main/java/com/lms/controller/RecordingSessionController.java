package com.lms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.lms.entity.Courses;
import com.lms.entity.RecordingSessions;
import com.lms.service.RecordingSessionService;

import io.jsonwebtoken.io.IOException;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/Recordingsessions")
@Slf4j
public class RecordingSessionController {

	@Autowired
	RecordingSessionService service;

	@PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> saveCourses(@RequestPart("session") String courseJson,
			@RequestParam("file") MultipartFile[] files)
			throws IOException, JsonMappingException, JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		RecordingSessions courses = mapper.readValue(courseJson, RecordingSessions.class);
		return service.savecourse(courses, files);
	}

	@GetMapping("/session/{sessionId}")
	public ResponseEntity<ResponseStructure<RecordingSessions>> findBySessionId(@PathVariable long sessionId) {

		return service.findbysessionid(sessionId);
	}

	@GetMapping("/recordings/user/{userId}")
	public ResponseEntity<ResponseStructure<List<RecordingSessions>>> getUserRecordings(@PathVariable Long userId) {

		return service.getUserRecordingSessions(userId);
	}

}
