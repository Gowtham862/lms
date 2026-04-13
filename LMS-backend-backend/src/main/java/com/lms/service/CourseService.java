package com.lms.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.channels.ReadableByteChannel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.jcodec.api.FrameGrab;
import org.jcodec.common.io.NIOUtils;
import org.jcodec.common.model.Picture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.lms.config.ResponseStructure;
import com.lms.dao.CoursesDao;
import com.lms.dto.AllcoursesDto;
import com.lms.dto.CourseDto;
import com.lms.entity.Courses;
import com.lms.exceptions.CourseIdnotFoundException;
import com.lms.exceptions.FieldcannotbeEmpty;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CourseService {

	@Autowired
	CourseDto coursedto;
	@Autowired
	CoursesDao coursedao;

	public ResponseEntity<?> uploadAndGetMetadata(MultipartFile[] files) {

		String UPLOAD_DIR = "uploads/";
		List<Map<String, Object>> metadataList = new ArrayList<>();

		try {
			for (MultipartFile file : files) {

				String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
				Path filePath = Paths.get(UPLOAD_DIR + fileName);

				Files.createDirectories(filePath.getParent());
				Files.write(filePath, file.getBytes());

				String mime = file.getContentType();
				Map<String, Object> map = new HashMap<>();

				map.put("fileName", fileName);
				map.put("fileSizeKB", file.getSize() / 1024);
				map.put("mimeType", mime);

				File savedFile = filePath.toFile();

				if (mime.startsWith("image")) {
					map.putAll(extractImageMetadata(savedFile));
				} else if (mime.equals("application/pdf")) {
					map.putAll(extractPdfMetadata(savedFile));
				} else if (mime.startsWith("video")) {
					map.putAll(extractVideoMetadata(savedFile));
				}

				metadataList.add(map);
			}

			return ResponseEntity.ok(metadataList);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error extracting metadata");
		}
	}

	// image metadata
	private Map<String, Object> extractImageMetadata(File file) throws Exception {

		Map<String, Object> map = new HashMap<>();

		Metadata metadata = ImageMetadataReader.readMetadata(file);

		for (Directory dir : metadata.getDirectories()) {
			for (com.drew.metadata.Tag tag : dir.getTags()) {
				map.put(tag.getTagName(), tag.getDescription());
			}
		}

		BufferedImage img = ImageIO.read(file);
		if (img != null) {
			map.put("width", img.getWidth());
			map.put("height", img.getHeight());
		}

		return map;
	}

	// extract pdf metadata
	private Map<String, Object> extractPdfMetadata(File file) throws Exception {

		Map<String, Object> map = new HashMap<>();

		PDDocument document = PDDocument.load(file);
		PDDocumentInformation info = document.getDocumentInformation();

		map.put("author", info.getAuthor());
		map.put("title", info.getTitle());
		map.put("pages", document.getNumberOfPages());

		if (info.getCreationDate() != null) {
			map.put("createdISO", info.getCreationDate().getTime().toInstant().toString());
		}

		document.close();
		return map;
	}

	// extract video
	private Map<String, Object> extractVideoMetadata(File file) {

		Map<String, Object> map = new HashMap<>();
		ReadableByteChannel channel = null;

		try {
			channel = NIOUtils.readableChannel(file);
			FrameGrab grab = FrameGrab.createFrameGrab(NIOUtils.readableChannel(file));

			Picture picture = grab.getNativeFrame();
			if (picture != null) {
				map.put("width", picture.getWidth());
				map.put("height", picture.getHeight());
			}

			if (grab.getVideoTrack() != null && grab.getVideoTrack().getMeta() != null) {
				double duration = grab.getVideoTrack().getMeta().getTotalDuration();
				int minutes = (int) Math.floor(duration / 60);
				map.put("durationMinutes", minutes);
				System.out.println(minutes);

			}

		} catch (Exception e) {
			map.put("videoMetadataError", "Could not extract video metadata");
		} finally {
			try {
				if (channel != null)
					channel.close();
			} catch (Exception ignored) {
			}
		}

		return map;
	}

	public ResponseEntity<ResponseStructure<?>> savecourse(Courses course, MultipartFile[] files) {

//	        log.info("Entered savecourse()");
		File folder = new File("uploads");
		String[] fil = folder.list();

		if (files != null && files.length > 0) {
			log.info("Files present in uploads folder:");
			for (String f : fil) {
				System.out.println(f);
			}
		} else {
			log.info("No files found in uploads folder");
		}
		if (folder.exists() && folder.isDirectory()) {
			log.info("Folder exists");
		} else {
			log.info("Folder does NOT exist");
		}

		if (course == null) {
			throw new FieldcannotbeEmpty("Course field cannot be empty");
		}
		ResponseEntity<?> metaResponse = uploadAndGetMetadata(files);

		if (metaResponse.getStatusCode().is2xxSuccessful()) {
			@SuppressWarnings("unchecked")
			List<Map<String, Object>> metadataList = (List<Map<String, Object>>) metaResponse.getBody();

			course.setMetadata(metadataList);
		}

		course = coursedao.savecoursedetails(course);
		coursedto.setApprovedAt(course.getApprovedAt());
		coursedto.setSkills(course.getSkills());
		coursedto.setTags(course.getTags());
		coursedto.setCourseId(course.getCourseId());
		coursedto.setCategory(course.getCategory());
		coursedto.setOwnerId(course.getOwnerId());
		coursedto.setTitle(course.getTitle());
		coursedto.setId(course.getId());
		coursedto.setDescription(course.getDescription());
		coursedto.setLevel(course.getLevel());
		coursedto.setLanguage(course.getLanguage());
		coursedto.setApprovedBy(course.getApprovedBy());
		coursedto.setCreatedAt(course.getCreatedAt());
		coursedto.setCreatedBy(course.getCreatedBy());
		coursedto.setStatus(course.getStatus());
		coursedto.setDurationMinutes(course.getDurationMinutes());
		coursedto.setUpdatedBy(course.getUpdatedBy());
		coursedto.setUpdatedAt(course.getUpdatedAt());
		coursedto.setDurationISO8601(course.getDurationISO8601());
		coursedto.setMetadata(course.getMetadata());

		ResponseStructure<CourseDto> structure = new ResponseStructure<>();
		structure.setMessage("course detail created successfully");
		structure.setStatus(HttpStatus.CREATED.value());
		structure.setData(coursedto);

		return new ResponseEntity<>(structure, HttpStatus.CREATED);
	}

//
//	public ResponseEntity<ResponseStructure<Courses>> savecourse(Courses course) {
//
//		if (course != null) {
//			course = coursedao.savecoursedetails(course);
//			coursedto.setApprovedAt(course.getApprovedAt());
//			coursedto.setSkills(course.getSkills());
//			coursedto.setTags(course.getTags());
//			coursedto.setCourseId(course.getCourseId());
//			coursedto.setCategory(course.getCategory());
//			coursedto.setOwnerId(course.getOwnerId());
//			coursedto.setTitle(course.getTitle());
//			coursedto.setId(course.getId());
//			coursedto.setDescription(course.getDescription());
//			coursedto.setLevel(course.getLevel());
//			coursedto.setLanguage(course.getLanguage());
//			coursedto.setApprovedBy(course.getApprovedBy());
//			coursedto.setCreatedAt(course.getCreatedAt());
//			coursedto.setCreatedBy(course.getCreatedBy());
//			coursedto.setStatus(course.getStatus());
//			coursedto.setDurationMinutes(course.getDurationMinutes());
//			coursedto.setUpdatedBy(course.getUpdatedBy());
//			coursedto.setUpdatedAt(course.getUpdatedAt());
//			coursedto.setDurationISO8601(course.getDurationISO8601());
//			ResponseStructure<Courses> responseStructure = new ResponseStructure<Courses>();
//			responseStructure.setMessage("course detail created successfully");
//			responseStructure.setStatus(HttpStatus.CREATED.value());
//			responseStructure.setData(coursedto);
//			return new ResponseEntity<ResponseStructure<Courses>>(responseStructure, HttpStatus.CREATED);
//		} else {
//			throw new FieldcannotbeEmpty("Course Field cannot be Empty");
//		}
//
//	}

	public ResponseEntity<ResponseStructure<List<Courses>>> findallthecourses() {
		List<Courses> courses = coursedao.findallcourses();
		List<CourseDto> coursedto = new ArrayList<>();
		if (courses != null && !courses.isEmpty()) {
			for (Courses c : courses) {
				CourseDto cdto = new CourseDto();
				cdto.setCourseId(c.getCourseId());
				cdto.setCategory(c.getCategory());
				cdto.setId(c.getId());
				cdto.setOwnerId(c.getOwnerId());
				cdto.setTitle(c.getTitle());
				cdto.setDescription(c.getDescription());
				cdto.setSkills(c.getSkills());
				cdto.setCategory(c.getCategory());
				cdto.setLevel(c.getLevel());
				cdto.setLanguage(c.getLanguage());
				cdto.setDurationMinutes(c.getDurationMinutes());
				cdto.setDurationISO8601(c.getDurationISO8601());
				cdto.setTags(c.getTags());
				cdto.setStatus(c.getStatus());
				cdto.setApprovedBy(c.getApprovedBy());
				cdto.setApprovedBy(c.getApprovedBy());
				cdto.setApprovedAt(c.getApprovedAt());
				cdto.setUpdatedAt(c.getUpdatedAt());
				cdto.setCreatedBy(c.getCreatedBy());
				cdto.setCreatedAt(c.getCreatedAt());
				cdto.setUpdatedBy(c.getUpdatedBy());
				coursedto.add(cdto);
			}
			ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
			structure.setData(coursedto);
			structure.setMessage("course founded");
			structure.setStatus(HttpStatus.FOUND.value());
			return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.FOUND);
		} else {
			throw new CourseIdnotFoundException("course not found");
		}

	}

	public ResponseEntity<ResponseStructure<List<Courses>>> findCoursesByUserId(String userId) {
		List<Courses> courses = coursedao.findthecoursesbyuserid(userId);
		List<CourseDto> coursedto = new ArrayList<>();

		if (courses != null && !courses.isEmpty()) {
			for (Courses c : courses) {
				CourseDto cdto = new CourseDto();
				cdto.setCourseId(c.getCourseId());
				cdto.setCategory(c.getCategory());
				cdto.setId(c.getId());
				cdto.setOwnerId(c.getOwnerId());
				cdto.setTitle(c.getTitle());
				cdto.setDescription(c.getDescription());
				cdto.setSkills(c.getSkills());
				cdto.setCategory(c.getCategory());
				cdto.setLevel(c.getLevel());
				cdto.setLanguage(c.getLanguage());
				cdto.setDurationMinutes(c.getDurationMinutes());
				cdto.setDurationISO8601(c.getDurationISO8601());
				cdto.setTags(c.getTags());
				cdto.setStatus(c.getStatus());
				cdto.setApprovedBy(c.getApprovedBy());
				cdto.setApprovedAt(c.getApprovedAt());
				cdto.setUpdatedAt(c.getUpdatedAt());
				cdto.setCreatedBy(c.getCreatedBy());
				cdto.setCreatedAt(c.getCreatedAt());
				cdto.setUpdatedBy(c.getUpdatedBy());
				cdto.setMetadata(c.getMetadata());
				coursedto.add(cdto);
			}
			ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
			structure.setData(coursedto);
			structure.setMessage("Courses found for user");
			structure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
		} else {
			// Return empty list instead of throwing exception
			ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
			structure.setData(new ArrayList<>());
			structure.setMessage("No courses found for this user");
			structure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
		}
	}
   
	public ResponseEntity<ResponseStructure<List<Courses>>> findallactivatecourses() {

		List<Courses> courses = coursedao.findallactivecourses();

		if (courses != null && !courses.isEmpty()) {

			List<CourseDto> dtoList = new ArrayList<>();

			for (Courses c : courses) {

				CourseDto cdto = new CourseDto();

				cdto.setCourseId(c.getCourseId());
				cdto.setCategory(c.getCategory());
				cdto.setId(c.getId());
				cdto.setOwnerId(c.getOwnerId());
				cdto.setTitle(c.getTitle());
				cdto.setDescription(c.getDescription());
				cdto.setSkills(c.getSkills());
				cdto.setLevel(c.getLevel());
				cdto.setLanguage(c.getLanguage());
				cdto.setDurationMinutes(c.getDurationMinutes());
				cdto.setDurationISO8601(c.getDurationISO8601());
				cdto.setTags(c.getTags());
				cdto.setStatus(c.getStatus());
				cdto.setApprovedBy(c.getApprovedBy());
				cdto.setApprovedAt(c.getApprovedAt());
				cdto.setUpdatedAt(c.getUpdatedAt());
				cdto.setCreatedBy(c.getCreatedBy());
				cdto.setCreatedAt(c.getCreatedAt());
				cdto.setUpdatedBy(c.getUpdatedBy());
				cdto.setMetadata(c.getMetadata());
				dtoList.add(cdto);
			}

			ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
			structure.setMessage("course found");
			structure.setStatus(HttpStatus.OK.value());
			structure.setData(dtoList);
			return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
		} else {
			ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
			structure.setData(new ArrayList<>());
			structure.setMessage("No activatecourses found ");
			structure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
		}
	}

	public ResponseEntity<ResponseStructure<List<Courses>>> findallinactivatecourses() {

		List<Courses> courses = coursedao.findallinactivecourses();

		List<CourseDto> dtoList = new ArrayList<>();
		if (courses != null && !courses.isEmpty()) {
			for (Courses c : courses) {

				CourseDto cdto = new CourseDto();

				cdto.setCourseId(c.getCourseId());
				cdto.setCategory(c.getCategory());
				cdto.setId(c.getId());
				cdto.setOwnerId(c.getOwnerId());
				cdto.setTitle(c.getTitle());
				cdto.setDescription(c.getDescription());
				cdto.setSkills(c.getSkills());
				cdto.setLevel(c.getLevel());
				cdto.setLanguage(c.getLanguage());
				cdto.setDurationMinutes(c.getDurationMinutes());
				cdto.setDurationISO8601(c.getDurationISO8601());
				cdto.setTags(c.getTags());
				cdto.setStatus(c.getStatus());
				cdto.setApprovedBy(c.getApprovedBy());
				cdto.setApprovedAt(c.getApprovedAt());
				cdto.setUpdatedAt(c.getUpdatedAt());
				cdto.setCreatedBy(c.getCreatedBy());
				cdto.setCreatedAt(c.getCreatedAt());
				cdto.setUpdatedBy(c.getUpdatedBy());
				cdto.setMetadata(c.getMetadata());
				dtoList.add(cdto);
			}

			ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
			structure.setMessage("course found");
			structure.setStatus(HttpStatus.OK.value());
			structure.setData(dtoList);
			return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
		} else {
			ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
			structure.setData(new ArrayList<>());
			structure.setMessage("No inactivatecourses found for this user to activate");
			structure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
		}
	}

	public ResponseEntity<ResponseStructure<List<Courses>>> activatethecoursesbyadmin(String id) {

		Courses courses = coursedao.activatecourse(id);

		if (courses != null) {

			ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
			structure.setMessage("course found");
			structure.setStatus(HttpStatus.OK.value());
//         structure.setData(dtoList);
			return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
		}
		ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
		structure.setData(new ArrayList<>());
		structure.setMessage("No courses found for this user to activate");
		structure.setStatus(HttpStatus.OK.value());
		return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<Courses>>> allcoursesforuser(String id) {

		List<Courses> courses = coursedao.findallthecoursesforuser(id);
		List<AllcoursesDto> dtoList = new ArrayList<>();

		if (courses != null && !courses.isEmpty()) {

			for (Courses c : courses) {
				AllcoursesDto course = new AllcoursesDto();
				course.setCategory(c.getCategory());
				course.setUserid(c.getOwnerId());
				course.setStatus(c.getStatus());
				course.setDescription(c.getDescription());
				course.setTittle(c.getTitle());
				dtoList.add(course);

			}

			ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
			structure.setMessage("course found");
			structure.setStatus(HttpStatus.OK.value());
			structure.setData(dtoList);
			return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
		}
		ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
		structure.setData(new ArrayList<>());
		structure.setMessage("No courses found for this user");
		structure.setStatus(HttpStatus.OK.value());
		return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<Courses>>> rejectthecourse(String id) {

		Courses courses = coursedao.rejectcourse(id);

		if (courses != null) {

			ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
			structure.setMessage("course found");
			structure.setStatus(HttpStatus.OK.value());
//         structure.setData(dtoList);
			return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
		}
		ResponseStructure<List<Courses>> structure = new ResponseStructure<>();
		structure.setData(new ArrayList<>());
		structure.setMessage("No courses found for this user to activate");
		structure.setStatus(HttpStatus.OK.value());
		return new ResponseEntity<ResponseStructure<List<Courses>>>(structure, HttpStatus.OK);
	}

}
