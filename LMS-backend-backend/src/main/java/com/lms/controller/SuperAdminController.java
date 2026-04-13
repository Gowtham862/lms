package com.lms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
import com.lms.dto.SuperAdminCount;
import com.lms.dto.SuperAdminDto;
import com.lms.dto.UpdatedAdminDto;
import com.lms.entity.SuperAdmin;
import com.lms.repository.SuperAdminRepository;
import com.lms.service.SuperAdminService;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@RestController
@RequestMapping("/superadmin")
public class SuperAdminController {
	@Autowired
	SuperAdminService superadminservice;

	@Autowired
	SuperAdminRepository superadminrepo;

	@Autowired
	private ObjectMapper objectMapper;

	@PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseStructure<SuperAdminDto>> saveSuperAdmin(
			@RequestPart("superadmin") String superadminJson,
			@RequestParam(value = "file", required = false) MultipartFile[] files)
			throws JsonMappingException, JsonProcessingException {

		ObjectMapper mapper = new ObjectMapper();

		// Convert JSON string → Entity
		SuperAdmin superadmin = mapper.readValue(superadminJson, SuperAdmin.class);

		System.err.println(superadmin + " superadmin");

		return superadminservice.saveSuperAdmin(superadmin, files);
	}

	@GetMapping("/getalladmin")
	public ResponseEntity<ResponseStructure<List<SuperAdmin>>> getAllSuperAdmins() {
		return superadminservice.getAllSuperAdmins();
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<SuperAdmin>> getSuperAdminById(@PathVariable("id") Long adminid) {
		return superadminservice.getSuperAdminById(adminid);
	}

	@PatchMapping(value = "/update/{adminId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseStructure<String>> updateSuperAdmin(@PathVariable Long adminId,
			@RequestPart("superadmin") String superadminJson,
			@RequestPart(value = "files", required = false) MultipartFile[] files)
			throws JsonMappingException, JsonProcessingException {

		log.info("PATCH received. adminId={}", adminId);
		log.info("DTO={}", superadminJson);
		log.info("Files count={}", files == null ? 0 : files.length);

		ObjectMapper mapper = new ObjectMapper();
		UpdatedAdminDto dto = mapper.readValue(superadminJson, UpdatedAdminDto.class);

		return superadminservice.updateSuperAdmin(adminId, dto, files);
	}
	
	 @GetMapping("/stats")
	    public ResponseEntity<ResponseStructure<SuperAdminCount>> getTrainerStats() {
	        return superadminservice.getTrainerCounts();
	    }

}
