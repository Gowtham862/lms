package com.lms.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.nio.file.Path;
import java.nio.file.Paths;

import com.itextpdf.io.font.constants.StandardFonts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.net.MalformedURLException;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.lms.config.ResponseStructure;
import com.lms.entity.Certificate;
import com.lms.exceptions.UserAlreadyExistsException;
import com.lms.repository.CertificateRepository;
import com.lms.service.CertificateService;

import io.jsonwebtoken.io.IOException;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/certificate")
@Slf4j
public class CertificateController {

	@Autowired
	CertificateService certiservice;

	@Autowired
	CertificateRepository repo;

	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> saveCourses(@RequestParam("certificate") String courseJson,
			@RequestParam("file") MultipartFile[] files)
			throws IOException, JsonMappingException, JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		Certificate courses = mapper.readValue(courseJson, Certificate.class);
		return certiservice.savecourse(courses, files);
	}

	@GetMapping("/getcertificate/{id}")
	public ResponseEntity<ResponseStructure<List<Certificate>>> getcertificatebyid(@PathVariable long id) {
		return certiservice.findallceriticate(id);

	}

	@PostMapping("/test-generate")
	public ResponseEntity<?> testGenerate(@RequestParam String username, @RequestParam String coursename,
			@RequestParam long userid, @RequestParam long courseid) {
		System.err.println(username);
		System.err.println(userid);
		System.err.println(coursename);
		System.err.println(courseid);

		try {
			Certificate cert = certiservice.generateAndStoreCertificate(username, coursename, userid, courseid);
			return ResponseEntity.ok(cert);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body(e.getMessage());
		}
	}

//	@GetMapping("/download/user/{userId}")
//	public ResponseEntity<Resource> downloadByUserId(@PathVariable long userId) {
//
//	    // 1️⃣ Fetch certificate by userId
//	    Certificate cert = repo.findByUserid(userId);
//
//	    if (cert == null) {
//	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
//	                .body(null);
//	    }
//
//	    try {
//	        // 2️⃣ Load file
//	        Path path = Paths.get(cert.getFilepath()).toAbsolutePath();
//	        Resource resource = new UrlResource(path.toUri());
//
//	        if (!resource.exists()) {
//	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//	        }
//
//	        // 3️⃣ Return file
//	        return ResponseEntity.ok()
//	                .header(HttpHeaders.CONTENT_DISPOSITION,
//	                        "attachment; filename=\"" + path.getFileName().toString() + "\"")
//	                .contentType(MediaType.APPLICATION_PDF)
//	                .body(resource);
//
//	    } catch (Exception e) {
//	        e.printStackTrace();
//	        return ResponseEntity.internalServerError().build();
//	    }
//	}

	@GetMapping("/download/user/{userId}/course/{courseId}")
	public ResponseEntity<Resource> downloadByUserAndCourse(@PathVariable long userId, @PathVariable long courseId) {

		Certificate cert = repo.findByUseridAndCourseid(userId, courseId).orElse(null);
		

	
			  if (cert == null) {
			        return ResponseEntity.status(HttpStatus.CONFLICT)
			                .header("X-Message", "No certificate found. Please wait for admin approval.")
			                .build();
			    }
		

		try {

			Path path = Paths.get(cert.getFilepath()).normalize().toAbsolutePath();

			Resource resource = new UrlResource(path.toUri());

			if (!resource.exists() || !resource.isReadable()) {
				return ResponseEntity.notFound().build();
			}

			return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + path.getFileName() + "\"")
					.body(resource);

		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}
	}

	@GetMapping("/download/{fileName:.+}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws MalformedURLException {

		if (fileName.contains("..")) {
			return ResponseEntity.badRequest().build();
		}
		

		Path filePath = Paths.get("uploads").resolve(fileName).normalize();
		Resource resource = new UrlResource(filePath.toUri());

		if (!resource.exists() || !resource.isReadable()) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}

	@PostMapping("/reject-certificate")
	public ResponseEntity<?> rejectCertificate(@RequestParam String username, @RequestParam String coursename,
			@RequestParam long userid, @RequestParam long courseid) {

		System.err.println("username: " + username);
		System.err.println("userid: " + userid);
		System.err.println("coursename: " + coursename);
		System.err.println("courseid: " + courseid);

		try {
			Certificate cert = certiservice.rejectCertificat(username, coursename, userid, courseid);
			return ResponseEntity.ok(Map.of("message", "Certificate rejected successfully", "certificateId",
					cert.getCertificateid(), "status", cert.isStatus()));
		} catch (UserAlreadyExistsException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
		}
	}

}