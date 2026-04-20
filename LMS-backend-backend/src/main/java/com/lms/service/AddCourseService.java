package com.lms.service;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.io.exceptions.IOException;
import com.lms.config.ResponseStructure;
import com.lms.dao.AddCourseDao;
import com.lms.dto.AddCourseDto;
import com.lms.dto.BatchModulesDto;
import com.lms.dto.CourseCountDto;
import com.lms.dto.CourseDashboardDto;
import com.lms.dto.UpdateCourseDto;
import com.lms.dto.UserRecommendedCourseDto;
import com.lms.entity.AddCourse;
import com.lms.entity.Batch;
import com.lms.entity.UserPurchasedCourse;
import com.lms.entity.status;
import com.lms.exceptions.CourseIdnotFoundException;
import com.lms.exceptions.FieldcannotbeEmpty;
import com.lms.exceptions.IdAlreadyExistsException;
import com.lms.exceptions.IdNotFoundException;
import com.lms.repository.AddCourseRepository;
import com.lms.repository.BatchRepository;
import com.lms.repository.CertificateRepository;
import com.lms.repository.PurchasedCourseRepository;
import com.lms.repository.SessionReportRepository;
import com.lms.utils.MediaUtils;
import com.mongodb.BasicDBObject;
import com.mongodb.client.result.UpdateResult;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AddCourseService {
	@Value("${task.file.path:uploads/}")
	private String taskFilePath;
	@Autowired
	AddCourseDao coursedao;
	@Autowired
	AddCourseDto addcoursedto;

	@Autowired
	AddCourseRepository courserepository;

	@Autowired
	private MongoOperations mongoOperations;

	@Autowired
	private BatchRepository batchrepo;

	@Autowired
	private MediaUtils mediautils;
	
	 @Autowired
	 CertificateRepository certificaterepo;
	 @Autowired
	 SessionReportRepository sessionrepo;
	 
	 @Autowired
	 PurchasedCourseRepository purchaserepo;

	public ResponseEntity<ResponseStructure<?>> savecourse(AddCourse course, MultipartFile[] files) {
          System.out.println("jlo");
//        log.info("Entered savecourse()");
		File folder = new File("uploads");
//	String[] fil = folder.list();
//
//	if (files != null && files.length > 0) {
//		log.info("Files present in uploads folder:");
//		for (String f : fil) {
//			System.out.println(f);
//		}
//	} else {
//		log.info("No files found in uploads folder");
//	}
		if (folder.exists() && folder.isDirectory()) {
			log.info("Folder exists");
		} else {
			log.info("Folder does NOT exist");
		}

		if (course == null) {
			throw new FieldcannotbeEmpty("Course field cannot be empty");
		}
		ResponseEntity<?> metaResponse = mediautils.uploadAndGetMetadata(files);

		if (metaResponse.getStatusCode().is2xxSuccessful()) {
			List<Map<String, Object>> metadataList = (List<Map<String, Object>>) metaResponse.getBody();

			course.setMetadata(metadataList);
		}

		boolean idexists = courserepository.existsBycourseid(course.getCourseid());
		if (idexists) {
			throw new IdAlreadyExistsException("id already exists");
		} else {

			course = coursedao.addnewcourse(course);
			addcoursedto.setCertificateavalibility(course.getCertificateavalibility());
			addcoursedto.setCourseid(course.getCourseid());
			addcoursedto.setAdminId(course.getAdminId());
			addcoursedto.setCoursename(course.getCoursename());
			addcoursedto.setCourselevel(course.getCourselevel());
			addcoursedto.setNoofmodule(course.getNoofmodule());
			addcoursedto.setModules(course.getModules());
			addcoursedto.setMetadata(course.getMetadata());
			addcoursedto.setRecommendedCourseIds(course.getRecommendedCourseIds());
			addcoursedto.setPrice(course.getPrice());
			addcoursedto.setDiscount(course.getDiscount());
			addcoursedto.setAdminname(course.getAdminname());
			addcoursedto.setCoursecategory(course.getCoursecategory());
			addcoursedto.setStatus(course.getStatus());
			ResponseStructure<AddCourseDto> structure = new ResponseStructure<>();
			structure.setMessage("course detail created successfully");
			structure.setData(addcoursedto);
			structure.setStatus(HttpStatus.CREATED.value());

			return new ResponseEntity<>(structure, HttpStatus.CREATED);
		}

	}

	public ResponseEntity<ResponseStructure<List<AddCourse>>> findallthecourses() {
		List<AddCourse> courses = coursedao.findallcourses();
		List<AddCourseDto> coursedto = new ArrayList<>();
		if (courses != null && !courses.isEmpty()) {
			for (AddCourse c : courses) {
				System.err.println(c.getCourseid());
				AddCourseDto coudto = new AddCourseDto();
				coudto.setCertificateavalibility(c.getCertificateavalibility());
				coudto.setCoursecategory(c.getCoursecategory());
				coudto.setAdminId(c.getAdminId());
				coudto.setAdminname(c.getAdminname());
				coudto.setCourselevel(c.getCourselevel());
				coudto.setCoursename(c.getCoursename());
				coudto.setCourseid(c.getCourseid());
				coudto.setMetadata(c.getMetadata());
				coudto.setModules(c.getModules());
				coudto.setCourseduration(c.getCourseduration());
				coudto.setNoofmodule(c.getNoofmodule());
				coudto.setCoursedesc(c.getCoursedesc());
				coudto.setRating(c.getRating());
				coudto.setStatus(c.getStatus());
				coudto.setTrainingmode(c.getTrainingmode());
				coursedto.add(coudto);

			}

			ResponseStructure<List<AddCourse>> structure = new ResponseStructure<>();
			structure.setData(coursedto);
			structure.setMessage("course founded");
			structure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<AddCourse>>>(structure, HttpStatus.OK);
		} else {
			throw new CourseIdnotFoundException("course not found");
		}

	}

	public ResponseEntity<ResponseStructure<List<AddCourse>>> getpublishedCourses() {
		List<AddCourse> courses = coursedao.getpublishedCourses();
		List<AddCourseDto> coursedto = new ArrayList<>();
		if (courses != null && !courses.isEmpty()) {
			for (AddCourse c : courses) {
				System.err.println(c.getCourseid());
				AddCourseDto coudto = new AddCourseDto();
				coudto.setCertificateavalibility(c.getCertificateavalibility());
				coudto.setCoursecategory(c.getCoursecategory());
				coudto.setAdminId(c.getAdminId());
				coudto.setAdminname(c.getAdminname());
				coudto.setCourselevel(c.getCourselevel());
				coudto.setCoursename(c.getCoursename());
				coudto.setCourseid(c.getCourseid());
				coudto.setMetadata(c.getMetadata());
				
				coudto.setModules(c.getModules());
				coudto.setCourseduration(c.getCourseduration());
				coudto.setNoofmodule(c.getNoofmodule());
				coudto.setCoursedesc(c.getCoursedesc());
				coudto.setRating(c.getRating());
				coudto.setStatus(c.getStatus());
				coursedto.add(coudto);

			}

			ResponseStructure<List<AddCourse>> structure = new ResponseStructure<>();
			structure.setData(coursedto);
			structure.setMessage("course founded");
			structure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<AddCourse>>>(structure, HttpStatus.OK);
		} else {
			throw new CourseIdnotFoundException("course not found");
		}

	}

	public ResponseEntity<ResponseStructure<String>> deleteModule(String courseId, String moduleId) {
		Query query = Query.query(Criteria.where("course_id").is(courseId).and("Modules.moduleId").is(moduleId));

		Update update = new Update().pull("Modules", new BasicDBObject("moduleId", moduleId));

		UpdateResult result = mongoOperations.updateFirst(query, update, AddCourse.class);
		ResponseStructure<String> responseStructure = new ResponseStructure<>();

		if (result.getMatchedCount() == 0) {
			responseStructure.setMessage("Course or Module not found");
			responseStructure.setStatus(HttpStatus.NOT_FOUND.value());
			responseStructure.setData(null);

			return new ResponseEntity<>(responseStructure, HttpStatus.NOT_FOUND);
		}

		if (result.getModifiedCount() == 0) {
			responseStructure.setMessage("Module already deleted");
			responseStructure.setStatus(HttpStatus.CONFLICT.value());
			responseStructure.setData(null);

			return new ResponseEntity<>(responseStructure, HttpStatus.CONFLICT);
		}

		responseStructure.setMessage("Module deleted successfully");
		responseStructure.setStatus(HttpStatus.OK.value());
		responseStructure.setData("DELETED");

		return new ResponseEntity<>(responseStructure, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<AddCourse>> findByCourseId(long courseId) {

		Query query = new Query(Criteria.where("course_id").is(courseId));

		AddCourse course = mongoOperations.findOne(query, AddCourse.class);

		if (course == null) {
			ResponseStructure<AddCourse> structure = new ResponseStructure<>();
			structure.setMessage("Course not found");
			structure.setStatus(HttpStatus.NOT_FOUND.value());
			structure.setData(null);
			return new ResponseEntity<>(structure, HttpStatus.NOT_FOUND);
		}

		ResponseStructure<AddCourse> structure = new ResponseStructure<>();
		structure.setMessage("Course data fetched successfully");
		structure.setStatus(HttpStatus.OK.value());
		structure.setData(course);

		return new ResponseEntity<>(structure, HttpStatus.OK);
	}

   

//	public ResponseEntity<ResponseStructure<String>> updateCourse(long courseId, UpdateCourseDto request,
//			MultipartFile[] files) {
//
//		Query query = new Query(Criteria.where("course_id").is(courseId));
//
//		AddCourse existing = mongoOperations.findOne(query, AddCourse.class);
//		if (existing == null) {
//			ResponseStructure<String> response = new ResponseStructure<>();
//			response.setMessage("Course not found");
//			response.setStatus(HttpStatus.NOT_FOUND.value());
//			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
//		}
//		Update update = new Update();
//
//		if (request.getCoursename() != null)
//			update.set("course_name", request.getCoursename());
//
//		if (request.getCourseduration() != null)
//			update.set("course_duration", request.getCourseduration());
//
//	if (request.getCoursedesc() != null)
//			update.set("course_desc", request.getCoursedesc());
//
//		if (request.getCoursecategory() != null)
//			update.set("course_category", request.getCoursecategory());
//
//		if (request.getCourselevel() != null)
//			update.set("course_level", request.getCourselevel());
//
//		if (request.getTrainingmode() != null)
//			update.set("training_mode", request.getTrainingmode());
//		
//		if (request.getRecommendedCourseIds() != null)
//			update.set("recommended_course_ids", request.getRecommendedCourseIds());
//		
//		if (request.getPrice() != null)
//	        update.set("price", request.getPrice());
//
//	    if (request.getDiscount() != null)
//	        update.set("discount", request.getDiscount());
//		
//
//		if (request.getLanguage() != null)
//			update.set("language", request.getLanguage());
//
//		if (request.getCertificateavalibility() != null)
//			update.set("certificate_avalibility", request.getCertificateavalibility());
//
//		if (request.getModules() != null)
//			update.set("modules", request.getModules());
//		if (request.getStatus() != null)
//			update.set("status", request.getStatus());
//		mongoOperations.updateFirst(query, update, AddCourse.class);
//
//		ResponseStructure<String> response = new ResponseStructure<>();
//		response.setMessage("Course updated successfully");
//		response.setStatus(HttpStatus.OK.value());
//
//		return ResponseEntity.ok(response);
//	}
	public ResponseEntity<ResponseStructure<String>> updateCourse(
	        long courseId, 
	        UpdateCourseDto request,
	        MultipartFile[] files) {

	    Query query = new Query(Criteria.where("course_id").is(courseId));

	    AddCourse existing = mongoOperations.findOne(query, AddCourse.class);
	    if (existing == null) {
	        ResponseStructure<String> response = new ResponseStructure<>();
	        response.setMessage("Course not found");
	        response.setStatus(HttpStatus.NOT_FOUND.value());
	        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	    }

	    Update update = new Update();

	    // Update simple fields if present
	    if (request.getCoursename() != null)
	        update.set("course_name", request.getCoursename());
	    if (request.getCourseduration() != null)
	        update.set("course_duration", request.getCourseduration());
	    if (request.getCoursedesc() != null)
	        update.set("course_desc", request.getCoursedesc());
	    if (request.getCoursecategory() != null)
	        update.set("course_category", request.getCoursecategory());
	    if (request.getCourselevel() != null)
	        update.set("course_level", request.getCourselevel());
	    if (request.getTrainingmode() != null)
	        update.set("training_mode", request.getTrainingmode());
	    if (request.getLanguage() != null)
	        update.set("language", request.getLanguage());
	    if (request.getCertificateavalibility() != null)
	        update.set("certificate_avalibility", request.getCertificateavalibility());
	    if (request.getModules() != null)
	        update.set("modules", request.getModules());
	    if (request.getStatus() != null)
	        update.set("status", request.getStatus());
	    if (request.getRecommendedCourseIds() != null)
	        update.set("recommended_course_ids", request.getRecommendedCourseIds());
	    if (request.getPrice() != null)
	        update.set("price", request.getPrice());
	    if (request.getDiscount() != null)
	        update.set("discount", request.getDiscount());

	    
	    if (files != null && files.length > 0) {
	        ResponseEntity<?> metaResponse = mediautils.uploadAndGetMetadata(files);
	        if (metaResponse.getStatusCode().is2xxSuccessful()) {
	            List<Map<String, Object>> metadataList = (List<Map<String, Object>>) metaResponse.getBody();
	            if (metadataList != null && !metadataList.isEmpty()) {
	                
	                update.set("metadata", metadataList);
	                
	                update.set("thumbnailUrl", metadataList.get(0).get("fileUrl"));
	            }
	        }
	    }

	    // Apply the update
	    mongoOperations.updateFirst(query, update, AddCourse.class);

	    ResponseStructure<String> response = new ResponseStructure<>();
	    response.setMessage("Course updated successfully");
	    response.setStatus(HttpStatus.OK.value());

	    return ResponseEntity.ok(response);
	}


	public ResponseEntity<ResponseStructure<AddCourse>> deleteCourse(long id) {

		ResponseStructure<AddCourse> responseStructure = new ResponseStructure<>();
		AddCourse course = coursedao.findbyid(id);
		List<Batch> batch = batchrepo.findByCourseId(id);
		batchrepo.deleteByCourseid(id);

		if (course != null) {

			responseStructure.setData(coursedao.deleteCartById(id));
			responseStructure.setMessage("course deleted");
			responseStructure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<AddCourse>>(responseStructure, HttpStatus.OK);
		} else {
			responseStructure.setMessage("course id not found");
			responseStructure.setStatus(HttpStatus.NOT_FOUND.value());
			return new ResponseEntity<ResponseStructure<AddCourse>>(responseStructure, HttpStatus.NOT_FOUND);
		}
	}

	public ResponseEntity<ResponseStructure<AddCourse>> findcourse(long id) {
		AddCourse course = coursedao.findbyid(id);
		if (course != null) {
			ResponseStructure<AddCourse> responseStructure = new ResponseStructure<>();
			responseStructure.setData(coursedao.findbyid(id));
			responseStructure.setMessage("course found");
			responseStructure.setStatus(HttpStatus.FOUND.value());
			return new ResponseEntity<ResponseStructure<AddCourse>>(responseStructure, HttpStatus.FOUND);
		} else {
			throw new IdNotFoundException("course id not found");

		}
	}
	
	public ResponseEntity<ResponseStructure<CourseCountDto>> getCourseCounts() {

	    long total = courserepository.count();
	    long published = courserepository.countByStatus("Published");
	    long Archived=courserepository.countByStatus("Archived");
	    long totalsession=sessionrepo.count();
	    long totalcertificate=certificaterepo.count();
	    CourseCountDto dto = new CourseCountDto();
	    dto.setTotalCourses(total);
	    dto.setPublishedCourses(published);
	    dto.setSessioncount(totalsession);
	    dto.setArchived(Archived);
	    dto.setTotalcertificate(totalcertificate);

	    ResponseStructure<CourseCountDto> structure = new ResponseStructure<>();
	    structure.setStatus(HttpStatus.OK.value());
	    structure.setMessage("Course count fetched");
	    structure.setData(dto);

	    return new ResponseEntity<>(structure, HttpStatus.OK);
	}
	
	
	
	   

	public ResponseStructure<List<CourseDashboardDto>> getCourseDashboard() {

	    List<AddCourse> courses = courserepository.findAll();
	    List<CourseDashboardDto> responseList = new ArrayList<>();

	    for (AddCourse course : courses) {

	        long courseId = course.getCourseid();

	        // Get all batches for this course
	        List<Batch> batches = batchrepo.findByCourseId(courseId);
	        long totalBatches = batches.size();

	        // Count unique trainers
	        Set<Long> trainerIds = new HashSet<>();
	        for (Batch batch : batches) {
	            if (batch.getPrimarytrainerid() != 0)
	                trainerIds.add(batch.getPrimarytrainerid());
	            if (batch.getBackuptrainerid() != 0)
	                trainerIds.add(batch.getBackuptrainerid());
	        }
	        long totalTrainers = trainerIds.size();

	        // Count total trainees
	        long totalTrainees = 0;
	        if (!batches.isEmpty()) {
	            List<Long> batchIds = batches.stream()
	                    .map(Batch::getBatchid)
	                    .toList();

	            totalTrainees = purchaserepo.countByBatchidIn(batchIds);
	        }

	        // Calculate total sessions from ALL batches (not from course)
	        long totalSessions = 0;
	        ObjectMapper mapper = new ObjectMapper();
	        
	        for (Batch batch : batches) {
	            if (batch.getModules() != null && !batch.getModules().isEmpty()) {
	                try {
	                    List<BatchModulesDto> batchModules = mapper.convertValue(
	                        batch.getModules(), 
	                        new TypeReference<List<BatchModulesDto>>() {}
	                    );
	                    for (BatchModulesDto module : batchModules) {
	                        if (module.getSessions() != null) {
	                            totalSessions += module.getSessions().size();
	                        }
	                    }
	                } catch (Exception e) {
	                    log.error("Error converting batch modules: " + e.getMessage());
	                }
	            }
	        }

	        CourseDashboardDto dto = new CourseDashboardDto();
	        dto.setCourseId(courseId);
	        dto.setCourseName(course.getCoursename());
	        dto.setTotalBatches(totalBatches);
	        dto.setTotalTrainers(totalTrainers);
	        dto.setTotalTrainees(totalTrainees);
	        dto.setTotalSessions(totalSessions);

	        responseList.add(dto);
	    }

	    ResponseStructure<List<CourseDashboardDto>> structure = new ResponseStructure<>();
	    structure.setStatus(200);
	    structure.setMessage("Course dashboard fetched successfully");
	    structure.setData(responseList);

	    return structure;
	}
	
	public ResponseEntity<ResponseStructure<List<AddCourse>>> 
	getRecommendedCourse(long courseId) {

	    AddCourse course = courserepository.findByCourseI(courseId);

	    if (course == null) {
	        throw new IdNotFoundException("Course not found");
	    }

	    List<String> recommendedIdsStr = course.getRecommendedCourseIds();

	    if (recommendedIdsStr == null || recommendedIdsStr.isEmpty()) {
	        ResponseStructure<List<AddCourse>> response =
	                new ResponseStructure<>();
	        response.setMessage("No recommended courses found");
	        response.setStatus(404);
	        response.setData(List.of());
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	    }

	   
	    List<Long> recommendedIds = recommendedIdsStr.stream()
	            .map(Long::valueOf)
	            .toList();

//	    List<AddCourse> recommendedCourses =
//	            courserepository.findByCourseidIn(recommendedIds);

	    List<AddCourse> recommendedCourses =
	            courserepository.findByCourseidInAndStatus(
	                    recommendedIds,
	                    status.Published
	            );
	    ResponseStructure<List<AddCourse>> structure =
	            new ResponseStructure<>();
	    structure.setMessage("Recommended courses fetched successfully");
	    structure.setStatus(200);
	    structure.setData(recommendedCourses);

	    return ResponseEntity.ok(structure);
	}
	
	public ResponseEntity<ResponseStructure<List<AddCourse>>> 
    getRecommendedCourses(long courseId) {

        AddCourse course = courserepository.findByCourseI(courseId);

        if (course == null) {
            throw new IdNotFoundException("Course not found");
        }

        List<String> recommendedIdsStr = course.getRecommendedCourseIds();

        if (recommendedIdsStr == null || recommendedIdsStr.isEmpty()) {
            ResponseStructure<List<AddCourse>> response =
                    new ResponseStructure<>();
            response.setMessage("No recommended courses found");
            response.setStatus(404);
            response.setData(List.of());

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(response);
        }

       
        List<Long> recommendedIds = recommendedIdsStr.stream()
                .map(Long::valueOf)
                .toList();

        List<AddCourse> recommendedCourses =
                courserepository.findByCourseidIn(recommendedIds);

        ResponseStructure<List<AddCourse>> structure =
                new ResponseStructure<>();
        structure.setMessage("Recommended courses fetched successfully");
        structure.setStatus(200);
        structure.setData(recommendedCourses);

        return ResponseEntity.ok(structure);
    }
//	 public ResponseEntity<ResponseStructure<UserRecommendedCourseDto>> getRecommendedCoursesByUserId(long userId) {
//
//	        
//	        List<UserPurchasedCourse> purchasedCourses = purchaserepo.findByUserid(userId);
//
//	        if (purchasedCourses.isEmpty()) {
//	            ResponseStructure<UserRecommendedCourseDto> response = new ResponseStructure<>();
//	            response.setMessage("User has not purchased any courses");
//	            response.setStatus(HttpStatus.NOT_FOUND.value());
//	            response.setData(null);
//	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//	        }
//
//	       
//	        Set<String> recommendedIds = new HashSet<>();
//
//	        for (UserPurchasedCourse purchase : purchasedCourses) {
//	            AddCourse course =
//	                    courserepository.findByCourseid(purchase.getCourseid());
//
//	            if (course != null && course.getRecommendedCourseIds() != null) {
//	                recommendedIds.addAll(course.getRecommendedCourseIds());
//	            }
//	        }
//
//	        List<AddCourse> recommendedCourses =
//	                courserepository.findAllByCourseidIn(
//	                        new ArrayList<>(recommendedIds)
//	                );
//
//	        UserRecommendedCourseDto dto = new UserRecommendedCourseDto();
//	        dto.setUserId(userId);
//	        dto.setRecommendedCourses(recommendedCourses);
//	        ResponseStructure<UserRecommendedCourseDto> response = new ResponseStructure<>();
//	        response.setMessage("Recommended course IDs fetched successfully");
//	        response.setStatus(HttpStatus.OK.value());
//	        response.setData(dto);
//
//	        return ResponseEntity.ok(response);
//	    }
	public ResponseEntity<ResponseStructure<UserRecommendedCourseDto>>
	getRecommendedCoursesByUserId(long userId) {

	    List<UserPurchasedCourse> purchasedCourses =
	            purchaserepo.findByUserid(userId);

	    if (purchasedCourses.isEmpty()) {
	        ResponseStructure<UserRecommendedCourseDto> response =
	                new ResponseStructure<>();
	        response.setMessage("User has not purchased any courses");
	        response.setStatus(HttpStatus.NOT_FOUND.value());
	        response.setData(null);
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	    }

	    Set<Long> recommendedIds = new HashSet<>();

	    for (UserPurchasedCourse purchase : purchasedCourses) {

	        AddCourse course =
	                courserepository.findByCourseid(purchase.getCourseid());

	        if (course != null && course.getRecommendedCourseIds() != null) {

	            for (String id : course.getRecommendedCourseIds()) {
	                recommendedIds.add(Long.parseLong(id));  // 🔥 convert here
	            }
	        }
	    }


	    
	    List<AddCourse> recommendedCourses =
	            courserepository.findByCourseidInAndStatus(
	                    new ArrayList<>(recommendedIds),
	                    status.Published
	            );
	    

	    UserRecommendedCourseDto dto = new UserRecommendedCourseDto();
	    dto.setUserId(userId);
	    dto.setRecommendedCourses(recommendedCourses);

	    ResponseStructure<UserRecommendedCourseDto> response =
	            new ResponseStructure<>();
	    response.setMessage("Recommended courses fetched successfully");
	    response.setStatus(HttpStatus.OK.value());
	    response.setData(dto);

	    return ResponseEntity.ok(response);
	}
	
}
	


