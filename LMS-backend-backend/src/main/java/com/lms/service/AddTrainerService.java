package com.lms.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.springframework.data.mongodb.core.MongoOperations;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.config.ResponseStructure;
import com.lms.dao.AddTrainerDao;
import com.lms.dto.AddTrainerDto;
import com.lms.dto.TrainerCountDto;
import com.lms.entity.AddTrainer;
import com.lms.entity.LoginUser;
import com.lms.entity.Role;
import com.lms.exceptions.CourseIdnotFoundException;
import com.lms.exceptions.FieldcannotbeEmpty;
import com.lms.exceptions.UserAlreadyExistsException;
import com.lms.repository.AddTrainerRepository;
import com.lms.repository.BatchRepository;
import com.lms.repository.CertificateRepository;
import com.lms.repository.LoginUserRepository;
import com.lms.repository.SessionReportRepository;
import com.lms.repository.SuperAdminRepository;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AddTrainerService {

	@Value("${task.file.path:uploads/}")
	private String taskFilePath;
	@Autowired
	AddTrainerDao addtrainerdao;
	@Autowired
	AddTrainerRepository trainerrepo;
	@Autowired
	private MongoOperations mongoOperations;

	
	
	@Autowired
	BatchRepository batchrepo;
    @Autowired
    SessionReportRepository sessionrepo;
	@Autowired
	CertificateRepository certirepo;
	@Autowired
	private JavaMailSender javamailsender;
	
	@Autowired
	private LoginUserRepository loginUserRepo;

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

	public ResponseEntity<?> uploadAndGetMetadata(MultipartFile[] files) {

		List<Map<String, Object>> metadataList = new ArrayList<>();

		if (files == null || files.length == 0) {
			return ResponseEntity.ok(metadataList);
		}

		try {
			// Ensure directory exists
			Files.createDirectories(Paths.get(taskFilePath));

			for (MultipartFile file : files) {

				String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
				Path filePath = Paths.get(taskFilePath, fileName);

				Files.write(filePath, file.getBytes());

				String mime = file.getContentType();
				Map<String, Object> map = new HashMap<>();

				map.put("fileName", fileName);
				map.put("filePath", filePath.toString());
				map.put("fileSizeKB", file.getSize() / 1024);
				map.put("mimeType", mime);

				File savedFile = filePath.toFile();

				if ("application/pdf".equals(mime)) {
					map.putAll(extractPdfMetadata(savedFile));
				} else if (mime.startsWith("image")) {
					map.putAll(extractImageMetadata(savedFile));
				}

				metadataList.add(map);
			}

			return ResponseEntity.ok(metadataList);

		} catch (Exception e) {
			log.error("Error extracting metadata", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error extracting metadata");
		}
	}

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

	public ResponseEntity<ResponseStructure<AddTrainerDto>> savetrainer(AddTrainer trainer, MultipartFile[] files) {

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

		if (trainer == null) {
			throw new FieldcannotbeEmpty("Trainer cannot be null");
		}
		ResponseEntity<?> metaResponse = uploadAndGetMetadata(files);

		if (metaResponse.getStatusCode().is2xxSuccessful()) {
			@SuppressWarnings("unchecked")
			List<Map<String, Object>> metadataList = (List<Map<String, Object>>) metaResponse.getBody();

			trainer.setMetadata(metadataList);
		}
//		boolean exists = trainerrepo.existsByTrainerid(trainer.getTrainerid());
		boolean emailexit = trainerrepo.existsByLoginemail(trainer.getLoginemail());
		 if (loginUserRepo.existsByEmail(trainer.getLoginemail())) {
				throw new UserAlreadyExistsException("user with this email already exists");
	        }
		if (emailexit)

		{
			throw new UserAlreadyExistsException("email already exists");
		} else {
			trainer = addtrainerdao.addnewtarineer(trainer);
			log.info("trainer" + trainer);
			AddTrainerDto dto = new AddTrainerDto();
			dto.setAbouttrainer(trainer.getAbouttrainer());
			dto.setAddress(trainer.getAddress());
			dto.setAdminid(trainer.getAdminid());
			dto.setAreoferperience(trainer.getAreoferperience());

			dto.setAssignedcourse(trainer.getAssignedcourse());
			dto.setAttachresume(trainer.getAttachresume());
			dto.setCity(trainer.getCity());
			dto.setContactnumber(trainer.getContactnumber());
			dto.setCourselevel(trainer.getCourselevel());
			dto.setDateofbirth(trainer.getDateofbirth());
			dto.setLanguageknown(trainer.getLanguageknown());
			dto.setYearofexperience(trainer.getYearofexperience());
			dto.setTrainerstatus(trainer.getTrainerstatus());
			dto.setTrainername(trainer.getTrainername());
			dto.setTrainerid(trainer.getTrainerid());
			dto.setTemporaraypassword(trainer.getTemporaraypassword());
			dto.setState(trainer.getState());
			dto.setAssignedcourseid(trainer.getAssignedcourseid());
			dto.setQualification(trainer.getQualification());
			dto.setLoginemail(trainer.getLoginemail());
			dto.setPersonalemailid(trainer.getPersonalemailid());
			dto.setMetadata(trainer.getMetadata());
			dto.setStatus(trainer.getStatus());
			 

				LoginUser loginUser = new LoginUser();
				loginUser.setEmail(trainer.getLoginemail());
				loginUser.setName(trainer.getTrainername());
				loginUser.setPassword(trainer.getTemporaraypassword()); // already encrypted
				loginUser.setRole(Role.INSTRUCTOR);
				loginUser.setRefId(trainer.getTrainerid());
				loginUser.setStatus(trainer.getStatus());
//				loginUser.setPhone(trainer.getp);
				// Active

				loginUserRepo.save(loginUser);
			

			try {
				MimeMessage mimeMessage = javamailsender.createMimeMessage();
				MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

				helper.setFrom("LMS <no-reply@accounts.google.com>");
				System.err.println(trainer.getPersonalemailid());
				helper.setTo(trainer.getPersonalemailid());
				helper.setSubject("Trainer Registration Mail");

				String body = String.format(
						"""
								  <!DOCTYPE html>
								<html>
								<body style="font-family:'Poppins', sans-serif; background-color:#f4f4f4; padding:20px;">
								  <div style="max-width:600px; background:#ffffff; padding:20px; margin:auto; border-radius:8px;">

								    <h2>
								      Welcome to LMS,
								      <span style="color:#007bff; font-weight:bold;">%s</span>!
								    </h2>

								    <p>Your account has been successfully created.</p>

								    <p><b>Email:</b> %s</p>

								    <p>
								      Click the button below to log in and start learning:
								    </p>

								    <p>
								      <a href="http://localhost:4200/login"
								         style="background:#007bff; color:white; border-radius:6px;
								                padding:10px 18px; text-decoration:none; display:inline-block;">
								        Login to LMS
								      </a>
								    </p>

								    <p style="margin-top:30px;">
								      If you did not create this account, please contact our support team immediately.
								    </p>

								    <p>
								      Regards,<br>
								      <b>LMS Team</b>
								    </p>

								    <hr style="border:none; border-top:1px solid #e0e0e0; margin-top:30px;">

								    <p style="font-size:12px; color:#888888; text-align:center;">
								      © 2026 LMS. All rights reserved.
								    </p>

								  </div>
								</body>
								</html>
								""",
						trainer.getTemporaraypassword(), trainer.getLoginemail()
//				            user.getPassword()
				);

				helper.setText(body, true); // TRUE = HTML

				javamailsender.send(mimeMessage);

			} catch (Exception e) {
				e.printStackTrace();
			}
			ResponseStructure<AddTrainerDto> responseStructure = new ResponseStructure<>();
			responseStructure.setMessage("trainer created successfully");
			responseStructure.setStatus(HttpStatus.CREATED.value());
			responseStructure.setData(dto);
			return new ResponseEntity<ResponseStructure<AddTrainerDto>>(responseStructure, HttpStatus.OK);
		}

	}

//	public ResponseEntity<ResponseStructure<String>> updateTrainer(long id, AddTrainerDto request) {
//		
//		
//		
//		System.err.println("trainer id = " + request.getTrainerstatus());
//
//		log.info("update tainer srvice called");
//		Map<String, Object> fields = new ObjectMapper().convertValue(request, Map.class);
//		fields.entrySet().removeIf(e -> e.getValue() == null);
//		fields.remove("trainerId");
//		fields.remove("trainerid");
//		System.out.println(fields);
//		fields.entrySet().removeIf(entry -> entry.getValue() == null);
//		if (fields.isEmpty()) {
//			throw new FieldcannotbeEmpty("fieldcannot be empty");
//		}
//		Update update = new Update();
//		fields.forEach(update::set);
//		Query query = new Query(Criteria.where("trainerid").is(id));
//		var result = mongoOperations.updateFirst(query, update, AddTrainer.class);
//
//		if (result.getModifiedCount() > 0) {
//			ResponseStructure<String> responseStructure = new ResponseStructure<>();
//			responseStructure.setMessage("trainer updated successfully");
//			responseStructure.setStatus(HttpStatus.CREATED.value());
//			responseStructure.setData(null);
//			return new ResponseEntity<ResponseStructure<String>>(responseStructure, HttpStatus.OK);
//		} else {
//			ResponseStructure<String> responseStructure = new ResponseStructure<>();
//			responseStructure.setMessage("Trainer not found or no changes applied");
//			responseStructure.setStatus(HttpStatus.NOT_FOUND.value());
//			responseStructure.setData(null);
//			return new ResponseEntity<ResponseStructure<String>>(responseStructure, HttpStatus.OK);
//		}
//	}
	
	public ResponseEntity<ResponseStructure<String>> updateTrainer(long id, AddTrainerDto request, MultipartFile[] files) {

	    System.err.println("trainer id = " + request.getTrainerstatus());
	    log.info("update trainer service called");

	    // Handle file upload and metadata extraction
	    if (files != null && files.length > 0) {
	        ResponseEntity<?> metaResponse = uploadAndGetMetadata(files);
	        if (metaResponse.getStatusCode().is2xxSuccessful()) {
	            @SuppressWarnings("unchecked")
	            List<Map<String, Object>> metadataList = (List<Map<String, Object>>) metaResponse.getBody();
	            request.setMetadata(metadataList); // make sure AddTrainerDto has setMetadata()
	        }
	    }

	    Map<String, Object> fields = new ObjectMapper().convertValue(request, Map.class);
	    fields.entrySet().removeIf(e -> e.getValue() == null);
	    fields.remove("trainerId");
	    fields.remove("trainerid");

	    if (fields.isEmpty()) {
	        throw new FieldcannotbeEmpty("field cannot be empty");
	    }

	    Update update = new Update();
	    fields.forEach(update::set);
	    Query query = new Query(Criteria.where("trainerid").is(id));
	    var result = mongoOperations.updateFirst(query, update, AddTrainer.class);

	    if (result.getModifiedCount() > 0) {
	        ResponseStructure<String> responseStructure = new ResponseStructure<>();
	        responseStructure.setMessage("trainer updated successfully");
	        responseStructure.setStatus(HttpStatus.OK.value());
	        responseStructure.setData(null);
	        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
	    } else {
	        ResponseStructure<String> responseStructure = new ResponseStructure<>();
	        responseStructure.setMessage("Trainer not found or no changes applied");
	        responseStructure.setStatus(HttpStatus.NOT_FOUND.value());
	        responseStructure.setData(null);
	        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
	    }
	}

	public ResponseEntity<ResponseStructure<List<AddTrainer>>> findallthetrainer() {
		List<AddTrainer> trainer = addtrainerdao.findalltrainer();
		List<AddTrainerDto> addtrainerdto = new ArrayList<>();
		if (trainer != null && !trainer.isEmpty()) {
			for (AddTrainer t : trainer) {
//				System.err.println(b.getCourseid());
				AddTrainerDto trainerdto = new AddTrainerDto();
				trainerdto.setAddress(t.getAddress());
				trainerdto.setAbouttrainer(t.getAbouttrainer());
				trainerdto.setAdminid(t.getAdminid());
				trainerdto.setAreoferperience(t.getAreoferperience());
				trainerdto.setAssignedcourse(t.getAssignedcourse());
				trainerdto.setAttachresume(t.getAttachresume());
				trainerdto.setCity(t.getCity());
				trainerdto.setContactnumber(t.getContactnumber());
				trainerdto.setCourselevel(t.getCourselevel());
				trainerdto.setDateofbirth(t.getDateofbirth());
				trainerdto.setMetadata(t.getMetadata());
				trainerdto.setTrainerstatus(t.getTrainerstatus());
				trainerdto.setAssignedcourseid(t.getAssignedcourseid());
				trainerdto.setYearofexperience(t.getYearofexperience());
				trainerdto.setState(t.getState());
				trainerdto.setLoginemail(t.getLoginemail());
				trainerdto.setTemporaraypassword(t.getTemporaraypassword());
				trainerdto.setTrainerid(t.getTrainerid());
				trainerdto.setTrainername(t.getTrainername());
				trainerdto.setPersonalemailid(t.getPersonalemailid());
				trainerdto.setQualification(t.getQualification());
				trainerdto.setLanguageknown(t.getLanguageknown());
				trainerdto.setStatus(t.getStatus());
				trainerdto.setOnboarddate(t.getOnboarddate());

				addtrainerdto.add(trainerdto);

			}

			ResponseStructure<List<AddTrainer>> structure = new ResponseStructure<>();
			structure.setData(addtrainerdto);
			structure.setMessage("trainer not founded");
			structure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<AddTrainer>>>(structure, HttpStatus.OK);
		} else {
			throw new CourseIdnotFoundException("Batch not found");
		}

	}

	public ResponseEntity<ResponseStructure<List<AddTrainer>>> deactivethetrainer(String trainerid) {

		Query query = new Query(Criteria.where("trainerid").is(trainerid));
		Update update = new Update().set("Status", "D");
		var result = mongoOperations.updateFirst(query, update, AddTrainer.class);
		if (result.getMatchedCount() == 0) {

			ResponseStructure<List<AddTrainer>> structure = new ResponseStructure<>();
			structure.setMessage("trainer not found");
			structure.setStatus(HttpStatus.NOT_FOUND.value());
//         structure.setData(dtoList);
			return new ResponseEntity<ResponseStructure<List<AddTrainer>>>(structure, HttpStatus.OK);
		}
		ResponseStructure<List<AddTrainer>> structure = new ResponseStructure<>();
		structure.setData(new ArrayList<>());
		structure.setMessage("Trainer deactivated successfully");
		structure.setStatus(HttpStatus.OK.value());
		return new ResponseEntity<ResponseStructure<List<AddTrainer>>>(structure, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<AddTrainer>> findbyid(long trainerid) {

		Query query = new Query(Criteria.where("trainerid").is(trainerid));
		AddTrainer trainer = mongoOperations.findOne(query, AddTrainer.class);

		if (trainer == null) {
			ResponseStructure<AddTrainer> structure = new ResponseStructure<>();
			structure.setMessage("Trainer not found");
			structure.setStatus(HttpStatus.NOT_FOUND.value());
			structure.setData(null);

			return new ResponseEntity<>(structure, HttpStatus.NOT_FOUND);
		}

		ResponseStructure<AddTrainer> structure = new ResponseStructure<>();
		structure.setMessage("Trainer data fetched successfully");
		structure.setStatus(HttpStatus.OK.value());
		structure.setData(trainer);
		return new ResponseEntity<>(structure, HttpStatus.OK);

	}

	public ResponseEntity<ResponseStructure<TrainerCountDto>> getTrainerCounts() {

	    long total = trainerrepo.count();
	    long active = trainerrepo.countByTrainerstatus("Active");
	    long course=batchrepo.countByPrimarytraineridNot(0L);
	    long session=sessionrepo.count();
	    
	  

	    TrainerCountDto dto = new TrainerCountDto();
	    dto.setTotalTrainers(total);
	    dto.setActiveTrainers(active);
	    dto.setCourseoccupied(course);
	    dto.setSessioncomplete(session);
	   

	    ResponseStructure<TrainerCountDto> structure = new ResponseStructure<>();
	    structure.setMessage("Trainer count fetched");
	    structure.setStatus(HttpStatus.OK.value());
	    structure.setData(dto);

	    return new ResponseEntity<>(structure, HttpStatus.OK);
	}

}
