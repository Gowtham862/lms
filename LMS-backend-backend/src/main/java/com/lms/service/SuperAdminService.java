package com.lms.service;

import java.awt.image.BufferedImage;
import java.util.UUID;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.lms.config.ResponseStructure;
import com.lms.dto.SuperAdminCount;
import com.lms.dto.SuperAdminDto;

import com.lms.dto.UpdatedAdminDto;

import com.lms.entity.AdminStatus;
import com.lms.entity.LoginUser;
import com.lms.entity.Role;
import com.lms.entity.SuperAdmin;
import com.lms.exceptions.FieldcannotbeEmpty;
import com.lms.exceptions.IdAlreadyExistsException;
import com.lms.exceptions.UserAlreadyExistsException;
import com.lms.repository.LoginUserRepository;
import com.lms.repository.SuperAdminRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j

public class SuperAdminService {
	@Value("${task.file.path:uploads/}")
	private String taskFilePath;
	@Autowired
	SuperAdminRepository superadminrepo;

	@Autowired
	private Mailservice mailservice;

	@Autowired
	private MongoOperations mongoOperations;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private LoginUserRepository loginUserRepo;

	public ResponseEntity<?> uploadAndGetMetadata(MultipartFile[] files) {

		
		List<Map<String, Object>> metadataList = new ArrayList<>();

		try {
			for (MultipartFile file : files) {

				String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
				Path filePath = Paths.get(taskFilePath + fileName);

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

//	public ResponseEntity<ResponseStructure<SuperAdminDto>> saveSuperAdmin(SuperAdmin superadmin,
//			MultipartFile[] files) {
//
//		if (superadmin == null) {
//			throw new FieldcannotbeEmpty("Super admin cannot be null");
//		}
//		if (superadmin.getAdminid() == null) {
//			superadmin.setAdminid(System.currentTimeMillis()); // generate unique Long ID
//		}
//
//		File folder = new File("uploads");
//		if (!folder.exists()) {
//			folder.mkdirs();
//			log.info("Uploads folder created");
//		}
//
//		if (files != null && files.length > 0) {
//			ResponseEntity<?> metaResponse = uploadAndGetMetadata(files);
//
//			if (metaResponse.getStatusCode().is2xxSuccessful() && metaResponse.getBody() instanceof List) {
//
//				@SuppressWarnings("unchecked")
//				List<Map<String, Object>> metadataList = (List<Map<String, Object>>) metaResponse.getBody();
//
//				superadmin.setMetadata(metadataList);
//			}
//		}
//		if (loginUserRepo.existsByEmail(superadmin.getLoginemail())) {
//			throw new UserAlreadyExistsException("user with this email already exists");
//		}
//
//		if (superadminrepo.existsByAdminid(superadmin.getAdminid())) {
//			throw new IdAlreadyExistsException("Admin id already exists");
//		}
//
//		if (superadmin.getAdminstatus() == null) {
//			superadmin.setAdminstatus(AdminStatus.Active);
//		}
//
//		if (superadmin.getAdminrole() == null) {
//			superadmin.setAdminrole(Role.ADMIN);
//		}
//		String encryptedPassword = passwordEncoder.encode(superadmin.getTemporaraypassword());
//		superadmin.setTemporaraypassword(encryptedPassword);
//
//		SuperAdmin savedAdmin = superadminrepo.save(superadmin);
//		System.out.println("CREATED DATE = " + savedAdmin.getCreatedDate());
//
//		SuperAdminDto dto = new SuperAdminDto();
//		dto.setAdminid(savedAdmin.getAdminid());
//		dto.setAdminname(savedAdmin.getAdminname());
//		dto.setPersonalemailid(savedAdmin.getPersonalemailid());
//		dto.setContactnumber(savedAdmin.getContactnumber());
//		dto.setDateofbirth(savedAdmin.getDateofbirth());
//		dto.setAddress(savedAdmin.getAddress());
//		dto.setState(savedAdmin.getState());
//		dto.setCity(savedAdmin.getCity());
//		dto.setLoginemail(savedAdmin.getLoginemail());
////	        dto.setTemporaraypassword(savedAdmin.getTemporaraypassword());
////	        dto.setAdminrole(savedAdmin.getAdminrole());
//		dto.setAdminstatus(savedAdmin.getAdminstatus());
//		dto.setMetadata(savedAdmin.getMetadata());
//		dto.setCreatedDate(savedAdmin.getCreatedDate());
//
//		LoginUser loginUser = new LoginUser();
//		loginUser.setEmail(superadmin.getLoginemail());
//		loginUser.setName(superadmin.getAdminname());
//		loginUser.setPassword(superadmin.getTemporaraypassword()); // already encrypted
//		loginUser.setRole(superadmin.getAdminrole());
//		loginUser.setRefId(superadmin.getAdminid());
////			loginUser.setStatus(superadmin.getState()); // Active
//
//		loginUserRepo.save(loginUser);
//		ResponseStructure<SuperAdminDto> structure = new ResponseStructure<>();
//		structure.setMessage("Super admin created successfully");
//		structure.setStatus(HttpStatus.CREATED.value());
//		structure.setData(dto);
//
//		return new ResponseEntity<>(structure, HttpStatus.CREATED);
//	}
	public ResponseEntity<ResponseStructure<SuperAdminDto>> saveSuperAdmin(
	        SuperAdmin superadmin,
	        MultipartFile[] files) {

	    if (superadmin == null) {
	        throw new FieldcannotbeEmpty("Super admin cannot be null");
	    }

	    // Generate Admin ID if null
	    if (superadmin.getAdminid() == null) {
	        superadmin.setAdminid(System.currentTimeMillis());
	    }

	    // Create uploads folder if not exists
	    File folder = new File("uploads");
	    if (!folder.exists()) {
	        folder.mkdirs();
	    }

	    // Handle file upload metadata
	    if (files != null && files.length > 0) {
	        ResponseEntity<?> metaResponse = uploadAndGetMetadata(files);

	        if (metaResponse.getStatusCode().is2xxSuccessful()
	                && metaResponse.getBody() instanceof List) {

	            @SuppressWarnings("unchecked")
	            List<Map<String, Object>> metadataList =
	                    (List<Map<String, Object>>) metaResponse.getBody();

	            superadmin.setMetadata(metadataList);
	        }
	    }

	    // Check email already exists
	    if (loginUserRepo.existsByEmail(superadmin.getLoginemail())) {
	        throw new UserAlreadyExistsException("User with this email already exists");
	    }

	    // Check admin ID already exists
	    if (superadminrepo.existsByAdminid(superadmin.getAdminid())) {
	        throw new IdAlreadyExistsException("Admin id already exists");
	    }

	    // Default status & role
	    if (superadmin.getAdminstatus() == null) {
	        superadmin.setAdminstatus(AdminStatus.Active);
	    }

	    if (superadmin.getAdminrole() == null) {
	        superadmin.setAdminrole(Role.ADMIN);
	    }

	    // 🔐 Store original password for email
	    String originalPassword = superadmin.getTemporaraypassword();

	    // Encrypt password before saving
	    String encryptedPassword = passwordEncoder.encode(originalPassword);
	    superadmin.setTemporaraypassword(encryptedPassword);

	    // Save SuperAdmin
	    SuperAdmin savedAdmin = superadminrepo.save(superadmin);

	    // Create LoginUser
	    LoginUser loginUser = new LoginUser();
	    loginUser.setEmail(savedAdmin.getLoginemail());
	    loginUser.setName(savedAdmin.getAdminname());
	    loginUser.setPassword(encryptedPassword);
	    loginUser.setRole(savedAdmin.getAdminrole());
	    loginUser.setRefId(savedAdmin.getAdminid());

	    loginUserRepo.save(loginUser);

	    // 📧 SEND EMAIL WITH ADMIN ID + PASSWORD
	    mailservice.sendSuperAdminCredentials(
	            savedAdmin.getLoginemail(),
	            savedAdmin.getLoginemail(),
	            originalPassword
	    );

	    // Prepare DTO
	    SuperAdminDto dto = new SuperAdminDto();
	    dto.setAdminid(savedAdmin.getAdminid());
	    dto.setAdminname(savedAdmin.getAdminname());
	    dto.setPersonalemailid(savedAdmin.getPersonalemailid());
	    dto.setContactnumber(savedAdmin.getContactnumber());
	    dto.setDateofbirth(savedAdmin.getDateofbirth());
	    dto.setAddress(savedAdmin.getAddress());
	    dto.setState(savedAdmin.getState());
	    dto.setCity(savedAdmin.getCity());
	    dto.setLoginemail(savedAdmin.getLoginemail());
	    dto.setAdminstatus(savedAdmin.getAdminstatus());
	    dto.setMetadata(savedAdmin.getMetadata());
	    dto.setCreatedDate(savedAdmin.getCreatedDate());

	    ResponseStructure<SuperAdminDto> structure = new ResponseStructure<>();
	    structure.setMessage("Super admin created successfully");
	    structure.setStatus(HttpStatus.CREATED.value());
	    structure.setData(dto);

	    return new ResponseEntity<>(structure, HttpStatus.CREATED);
	}

	public ResponseEntity<ResponseStructure<List<SuperAdmin>>> getAllSuperAdmins() {
		List<SuperAdmin> admins = superadminrepo.findAll();

		ResponseStructure<List<SuperAdmin>> structure = new ResponseStructure<>();
		structure.setMessage("All super admins retrieved");
		structure.setStatus(HttpStatus.OK.value());
		structure.setData(admins);

		return new ResponseEntity<>(structure, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<SuperAdmin>> getSuperAdminById(Long adminid) {
		SuperAdmin sa = superadminrepo.findByAdminid(adminid)
				.orElseThrow(() -> new RuntimeException("Super admin not found"));

		ResponseStructure<SuperAdmin> structure = new ResponseStructure<>();
		structure.setMessage("Super admin retrieved successfully");
		structure.setStatus(HttpStatus.OK.value());
		structure.setData(sa);

		return new ResponseEntity<>(structure, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<String>> updateSuperAdmin(Long adminId, UpdatedAdminDto request,
			MultipartFile[] files) {

		Query query = new Query(Criteria.where("adminid").is(adminId));
		SuperAdmin existing = mongoOperations.findOne(query, SuperAdmin.class);

		if (existing == null) {
			ResponseStructure<String> response = new ResponseStructure<>();
			response.setMessage("Admin not found");
			response.setStatus(HttpStatus.NOT_FOUND.value());
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}

		Update update = new Update();

		if (request.getAdminname() != null)
			update.set("adminname", request.getAdminname());

		if (request.getPersonalemailid() != null)
			update.set("personalemailid", request.getPersonalemailid());

		if (request.getContactnumber() != null)
			update.set("contactnumber", request.getContactnumber());

		if (request.getDateofbirth() != null)
			update.set("dateofbirth", request.getDateofbirth());

		if (request.getAddress() != null)
			update.set("address", request.getAddress());

		if (request.getState() != null)
			update.set("state", request.getState());

		if (request.getCity() != null)
			update.set("city", request.getCity());

		if (request.getLoginemail() != null)
			update.set("loginemail", request.getLoginemail());

		if (request.getTemporaraypassword() != null)
			update.set("temporaraypassword", request.getTemporaraypassword());

		if (request.getAdminrole() != null)
			update.set("adminrole", request.getAdminrole());

		if (request.getAdminstatus() != null)
			update.set("adminstatus", request.getAdminstatus());

		if (files != null && files.length > 0) {

			try {
				MultipartFile file = files[0];

//				String uploadDir = "uploads/";
				File folder = new File(taskFilePath);
				if (!folder.exists())
					folder.mkdirs();

				String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
				Path filePath = Paths.get(taskFilePath + fileName);

				Files.write(filePath, file.getBytes());

				Map<String, Object> meta = new HashMap<>();
				meta.put("fileName", fileName);
				meta.put("mimeType", file.getContentType());
				meta.put("fileSizeKB", file.getSize() / 1024);

				if (file.getContentType() != null && file.getContentType().startsWith("image")) {
					BufferedImage img = ImageIO.read(filePath.toFile());
					if (img != null) {
						meta.put("width", img.getWidth());
						meta.put("height", img.getHeight());
					}
				}

				List<Map<String, Object>> metadataList = new ArrayList<>();
				metadataList.add(meta);

				update.set("metadata", metadataList);

			} catch (IOException e) {
				log.error("File upload failed", e);
				throw new RuntimeException("File upload failed");
			}
		}

		mongoOperations.updateFirst(query, update, SuperAdmin.class);

		ResponseStructure<String> response = new ResponseStructure<>();
		response.setMessage("Admin updated successfully");
		response.setStatus(HttpStatus.OK.value());

		return ResponseEntity.ok(response);
	}

	public ResponseEntity<ResponseStructure<SuperAdminCount>> getTrainerCounts() {

		long total = superadminrepo.count();
		long active = superadminrepo.countByadminstatus("Active");

		SuperAdminCount dto = new SuperAdminCount();

		dto.setTotalactiveadmins(active);
		dto.setTotaladmins(total);

		ResponseStructure<SuperAdminCount> structure = new ResponseStructure<>();
		structure.setMessage("Trainer count fetched");
		structure.setStatus(HttpStatus.OK.value());
		structure.setData(dto);

		return new ResponseEntity<>(structure, HttpStatus.OK);
	}

}
