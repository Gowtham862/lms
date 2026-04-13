package com.lms.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.channels.ReadableByteChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jcodec.api.FrameGrab;
import org.jcodec.common.io.NIOUtils;
import org.jcodec.common.model.Picture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.lms.config.ResponseStructure;
import com.lms.dao.RecordingSessionDao;
import com.lms.dto.CourseDto;
import com.lms.entity.RecordingSessions;
import com.lms.entity.UserPurchasedCourse;
import com.lms.exceptions.FieldcannotbeEmpty;
import com.lms.repository.PurchasedCourseRepository;
import com.lms.repository.RecordingSessionRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RecordingSessionService {
	
	
	@Autowired
	RecordingSessionDao sessiondao;
	
	@Autowired
	PurchasedCourseRepository purchaserepo;
	
	@Autowired
	RecordingSessionRepository recordrepo;
	
	@Value("${task.file.path:uploads/}")
	private String taskFilePath;
	
	public ResponseEntity<?> uploadAndGetMetadata(MultipartFile[] files) {

		
		List<Map<String, Object>> metadataList = new ArrayList<>();

		try {
			Files.createDirectories(Paths.get(taskFilePath));
			for (MultipartFile file : files) {

				String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
				Path filePath = Paths.get(
				taskFilePath + fileName);

				Files.createDirectories(filePath.getParent());
				Files.write(filePath, file.getBytes());

				String mime = file.getContentType();
				Map<String, Object> map = new HashMap<>();

				map.put("fileName", fileName);
				map.put("fileSizeKB", file.getSize() / 1024);
				map.put("mimeType", mime);

				File savedFile = filePath.toFile();

				 if (mime.startsWith("video")) {
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

	public ResponseEntity<ResponseStructure<?>> savecourse(RecordingSessions course, MultipartFile[] files) {

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

		
		course = sessiondao.saveRecordingsessions(course);
		ResponseStructure<CourseDto> structure = new ResponseStructure<>();
		structure.setMessage("Recording session created successfully");
		structure.setStatus(HttpStatus.CREATED.value());
//		structure.setData(coursedto);

		return new ResponseEntity<>(structure, HttpStatus.CREATED);
	}
	
    
    public ResponseEntity<ResponseStructure<RecordingSessions>> findbysessionid(long id) {

		ResponseStructure<RecordingSessions> responseStructure = new ResponseStructure<>();
		RecordingSessions sessions=sessiondao.getBySessionId(id);
		if ( sessions != null) {
			responseStructure.setData(sessions);
			responseStructure.setMessage("video found for this session");
			responseStructure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<RecordingSessions>>(responseStructure, HttpStatus.OK);
		} else {
			responseStructure.setMessage("video  not found");
			responseStructure.setStatus(HttpStatus.NOT_FOUND.value());
			return new ResponseEntity<ResponseStructure<RecordingSessions>>(responseStructure, HttpStatus.NOT_FOUND);
		}
	}
    
    
    public ResponseEntity<ResponseStructure<List<RecordingSessions>>> 
    getUserRecordingSessions(Long userId) {

        // 1️⃣ Fetch purchased courses
        List<UserPurchasedCourse> purchases =
        		purchaserepo.findByUserid(userId);

        ResponseStructure<List<RecordingSessions>> structure =
                new ResponseStructure<>();

        if (purchases.isEmpty()) {
            structure.setStatus(HttpStatus.OK.value());
            structure.setMessage("No purchased courses found");
            structure.setData(new ArrayList<>());
            return ResponseEntity.ok(structure);
        }

        // 2️⃣ Extract courseIds & batchIds
        List<Long> courseIds = purchases.stream()
                .map(UserPurchasedCourse::getCourseid)
                .toList();

        List<Long> batchIds = purchases.stream()
                .map(UserPurchasedCourse::getBatchid)
                .toList();

        // 3️⃣ Fetch recording sessions
        List<RecordingSessions> recordings =
        		recordrepo.findByCourseidInAndBatchidIn(courseIds, batchIds);

        structure.setStatus(HttpStatus.OK.value());
        structure.setMessage("Recording sessions found");
        structure.setData(recordings);

        return ResponseEntity.ok(structure);
    }



}
