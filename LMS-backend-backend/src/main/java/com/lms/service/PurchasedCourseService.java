package com.lms.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.lms.config.ResponseStructure;
import com.lms.dao.ModuleProgressDTO;
import com.lms.dao.PurchasedCourseDao;
import com.lms.dto.AddCourseDto;
import com.lms.dto.BatchModulesDto;
import com.lms.dto.BatchSessionDto;
import com.lms.dto.BatchWithCourseDTO;
import com.lms.dto.CourseProgresDTO;
import com.lms.dto.PurchasedCourseDto;
import com.lms.dto.StudentListDto;
import com.lms.entity.AddCourse;
import com.lms.entity.Batch;
import com.lms.entity.SessionReport;
import com.lms.entity.User;
import com.lms.entity.UserPurchasedCourse;
import com.lms.exceptions.CourseIdnotFoundException;
import com.lms.exceptions.FieldcannotbeEmpty;
import com.lms.exceptions.IdNotFoundException;
import com.lms.repository.AddCourseRepository;
import com.lms.repository.AddTrainerRepository;
import com.lms.repository.BatchRepository;
import com.lms.repository.CertificateRepository;
import com.lms.repository.InterestedStudentRepository;
import com.lms.repository.PurchasedCourseRepository;
import com.lms.repository.SessionReportRepository;
import com.lms.repository.UserRepository;

import org.bson.Document;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PurchasedCourseService {

	@Autowired
	PurchasedCourseDao purchasedao;

	@Autowired
	private MongoOperations mongoOperations;

	@Autowired
	BatchRepository batchrepo;

	@Autowired
	AddCourseRepository courserpo;

	@Autowired
	PurchasedCourseRepository purchaserepo;
	
	
	@Autowired
	InterestedStudentRepository interstedrepo;
	@Autowired
	InterestedStudentRepository interrepo;
	
	@Autowired
	 AddTrainerRepository trainerrepo;
	
	@Autowired
	UserRepository userepo;

	@Autowired
	CertificateRepository certirepo;

	@Autowired
	SessionReportRepository session;

	public ResponseEntity<ResponseStructure<UserPurchasedCourse>> savepurchasedcourse(
			UserPurchasedCourse purchasedcourse) {

		log.info("batch " + purchasedcourse);

		boolean alreadyExists = purchaserepo.existsByUseridAndBatchid(purchasedcourse.getUserid(),
				purchasedcourse.getBatchid());

		ResponseStructure<UserPurchasedCourse> responseStructure = new ResponseStructure<>();

		if (alreadyExists) {
			log.info("UserId from request: " + purchasedcourse.getUserid());
			log.info("BatchId from request: " + purchasedcourse.getBatchid());

			responseStructure.setMessage("User has already purchased this batch");
			responseStructure.setStatus(HttpStatus.CONFLICT.value());
			responseStructure.setData(null);

			return new ResponseEntity<>(responseStructure, HttpStatus.CONFLICT);
		}

		UserPurchasedCourse purchased = purchasedao.savepurchasedcourse(purchasedcourse);

		if (purchased != null) {
			responseStructure.setMessage("Batch purchased successfully");
			responseStructure.setStatus(HttpStatus.CREATED.value());
			responseStructure.setData(purchased);

			return new ResponseEntity<>(responseStructure, HttpStatus.CREATED);
		} else {
			throw new FieldcannotbeEmpty("Field can not be empty");
		}
	}

	public ResponseEntity<ResponseStructure<List<AddCourse>>> getCoursesByUserI(long userId) {
		System.out.println(userId);

		if (userId < 0) {
			throw new IdNotFoundException("User id not found");
		}

		Aggregation aggregation = Aggregation.newAggregation(
				Aggregation.match(Criteria.where("userid").is(userId).and("status").is("Active")),

				Aggregation.lookup("Add_courses", // collection name
						"courseid", // local field
						"course_id", // foreign field
						"course"),
				Aggregation.unwind("course"));
		List<Document> results = mongoOperations.aggregate(aggregation, "User_Purchasedcourse", Document.class)
				.getMappedResults();
		List<AddCourse> courses = results.stream().map(d -> d.get("course", Document.class)).filter(Objects::nonNull)
				.map(d -> mongoOperations.getConverter().read(AddCourse.class, d)).toList();

		if (courses.isEmpty()) {
			throw new CourseIdnotFoundException("Course not found for user");
		}

		ResponseStructure<List<AddCourse>> structure = new ResponseStructure<>();
		structure.setData(courses);
		structure.setMessage("Courses found");
		structure.setStatus(HttpStatus.OK.value());

		return ResponseEntity.ok(structure);
	}

	public ResponseEntity<ResponseStructure<List<BatchWithCourseDTO>>> getAllBatchesWithCourse() {

//		List<Batch> batches = batchrepo.findByStatus("Activate"); 
		List<Batch> batches = batchrepo.findAll();
		List<BatchWithCourseDTO> result = new ArrayList<>();
		for (Batch batch : batches) {
			BatchWithCourseDTO dto = new BatchWithCourseDTO();
			dto.setBatchId(batch.getBatchid());
			dto.setBatchstartdate(batch.getStartdate());
			dto.setStatus(batch.getStatus());
			dto.setBatchendate(batch.getEnddate());
			dto.setMaxstudentcapacity(batch.getStudentcapacity());

			dto.setBatchno(batch.getBatchno());

			AddCourse course = courserpo.findByCourseI(batch.getCourseid());

			if (course != null) {
				AddCourseDto courseDTO = new AddCourseDto();
				courseDTO.setCoursename(course.getCoursename());
				courseDTO.setCourseid(course.getCourseid());
				courseDTO.setCourselevel(course.getCourselevel());
				courseDTO.setModules(course.getModules());
				courseDTO.setCertificateavalibility(course.getCertificateavalibility());
				courseDTO.setNoofmodule(course.getNoofmodule());
				courseDTO.setAdminId(course.getAdminId());
				courseDTO.setAdminname(course.getAdminname());
				courseDTO.setCoursecategory(course.getCoursecategory());
				courseDTO.setCourseduration(course.getCourseduration());
				courseDTO.setStatus(course.getStatus());
				courseDTO.setRating(course.getRating());
				courseDTO.setCoursedesc(course.getCoursedesc());
				courseDTO.setMetadata(course.getMetadata());
				courseDTO.setModuleCount(course.getModuleCount());
				courseDTO.setLanguage(course.getLanguage());
				courseDTO.setTrainingmode(course.getTrainingmode());

				dto.setCourse(courseDTO);
			}
			result.add(dto);
		}

		ResponseStructure<List<BatchWithCourseDTO>> structure = new ResponseStructure<>();
		structure.setData(result);
		structure.setMessage("Courses found");
		structure.setStatus(HttpStatus.OK.value());
		return new ResponseEntity<ResponseStructure<List<BatchWithCourseDTO>>>(structure, HttpStatus.OK);

	}

	public ResponseEntity<ResponseStructure<UserPurchasedCourse>> enrolledcourse(long id) {

		ResponseStructure<UserPurchasedCourse> responseStructure = new ResponseStructure<>();
		boolean exists = purchaserepo.existsByUserid(id);
		if (exists) {
			responseStructure.setData(true);
			responseStructure.setMessage("user enrolled");
			responseStructure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<UserPurchasedCourse>>(responseStructure, HttpStatus.OK);
		} else {
			responseStructure.setData(false);
			responseStructure.setMessage("user didnt enrolled");
			responseStructure.setStatus(HttpStatus.NOT_FOUND.value());
			return new ResponseEntity<ResponseStructure<UserPurchasedCourse>>(responseStructure, HttpStatus.NOT_FOUND);
		}
	}

	public ResponseEntity<ResponseStructure<List<PurchasedCourseDto>>> findAllUsers() {
		List<UserPurchasedCourse> users = purchasedao.findAllPurchasedusers();
		List<PurchasedCourseDto> dtos = new ArrayList<>();

		if (users != null) {
			for (UserPurchasedCourse u : users) {
				PurchasedCourseDto courseDto = new PurchasedCourseDto();

				courseDto.setUserid(u.getUserid());
//				courseDto.setUsername(u.getUsername());
				courseDto.setBatchno(u.getBatchno());
				courseDto.setCoursename(u.getCoursename());
				courseDto.setBatchstartdate(u.getBatchstartdate());
				courseDto.setUseremail(u.getUseremail());
				courseDto.setEnrollDate(u.getEnrollDate());
				
				 User user = userepo.findByUserid(u.getUserid());

				    if (user != null) {
				    	 courseDto.setUsername(user.getFirstname()); 
				        courseDto.setUsercontact(String.valueOf(user.getPhone()));
				    }

//				courseDto.setUsercontact(u.getUsercontact());
				courseDto.setStatus(u.getStatus());

				dtos.add(courseDto);
			}
			ResponseStructure<List<PurchasedCourseDto>> structure = new ResponseStructure<>();
			structure.setData(dtos);
			structure.setMessage(" users found are ");
			structure.setStatus(HttpStatus.OK.value());

			return new ResponseEntity<ResponseStructure<List<PurchasedCourseDto>>>(structure, HttpStatus.OK);
		} else {
			throw new IdNotFoundException("users not found ");
		}
	}

	public ResponseEntity<ResponseStructure<List<UserPurchasedCourse>>> findByBatchid(long batchid) {

		Query query = new Query(Criteria.where("batchid").is(batchid));
		Batch batch = mongoOperations.findOne(query, Batch.class);

		String trainerName = batch != null ? batch.getPrimarytrainer() : null;

		System.out.println(batch);

		System.out.println(query + "hkuv");

		List<UserPurchasedCourse> course = mongoOperations.find(query, UserPurchasedCourse.class);

		ResponseStructure<List<UserPurchasedCourse>> structure = new ResponseStructure<>();

		if (course.isEmpty()) {
			structure.setMessage("No students found for this batch");
			structure.setStatus(HttpStatus.NOT_FOUND.value());
			structure.setData(Collections.emptyList());
			return new ResponseEntity<>(structure, HttpStatus.NOT_FOUND);
		}

		structure.setMessage("Registered students for this batch");
		structure.setStatus(HttpStatus.OK.value());
		structure.setData(course);

		return new ResponseEntity<>(structure, HttpStatus.OK);
	}

//public List<AddCourse> getIncompleteCoursesByUser(long userId) {
//
//    // 1️⃣ Get all incomplete purchases for user
//    List<UserPurchasedCourse> purchases =
//            purchaserepo.findByUseridAndCompleteFalse(userId);
//
//    if (purchases == null || purchases.isEmpty()) {
//        return Collections.emptyList();
//    }
//
//    // 2️⃣ Extract courseIds
//    List<Long> courseIds = purchases.stream()
//            .map(UserPurchasedCourse::getCourseid)
//            .distinct()
//            .collect(Collectors.toList());
//
//    // 3️⃣ Fetch full course details
//    return courserpo.findByCourseidIn(courseIds);
//}
//

	public ResponseEntity<ResponseStructure<List<AddCourse>>> getIncompleteCoursesByUser(long userId) {

		ResponseStructure<List<AddCourse>> structure = new ResponseStructure<>();

		// 1️⃣ Get all incomplete purchases for user
		List<UserPurchasedCourse> purchases = purchaserepo.findByUseridAndCompleteFalse(userId);

		if (purchases == null || purchases.isEmpty()) {
			structure.setMessage("No incomplete courses found for this user");
			structure.setStatus(HttpStatus.NOT_FOUND.value());
			structure.setData(Collections.emptyList());
			return new ResponseEntity<>(structure, HttpStatus.NOT_FOUND);
		}

		List<Long> courseIds = purchases.stream().map(UserPurchasedCourse::getCourseid).distinct()
				.collect(Collectors.toList());

		List<AddCourse> courses = courserpo.findByCourseidIn(courseIds);

		structure.setMessage("Incomplete courses fetched successfully");
		structure.setStatus(HttpStatus.OK.value());
		structure.setData(courses);

		return new ResponseEntity<>(structure, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<AddCourse>>> getIncompletedCoursesByUser(long userId) {

		ResponseStructure<List<AddCourse>> structure = new ResponseStructure<>();

		// Get all incomplete purchases for user
		List<UserPurchasedCourse> purchases = purchaserepo.findByUseridAndCompleteTrue(userId);

		if (purchases == null || purchases.isEmpty()) {
			structure.setMessage("No incomplete courses found for this user");
			structure.setStatus(HttpStatus.NOT_FOUND.value());
			structure.setData(Collections.emptyList());
			return new ResponseEntity<>(structure, HttpStatus.NOT_FOUND);
		}

		List<Long> courseIds = purchases.stream().map(UserPurchasedCourse::getCourseid).distinct()
				.collect(Collectors.toList());

		List<AddCourse> courses = courserpo.findByCourseidIn(courseIds);

		structure.setMessage("Incomplete courses fetched successfully");
		structure.setStatus(HttpStatus.OK.value());
		structure.setData(courses);

		return new ResponseEntity<>(structure, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<AddCourse>>> courseidfalse(long userId) {

		ResponseStructure<List<AddCourse>> structure = new ResponseStructure<>();

		//  Get all incomplete purchases for user
		List<UserPurchasedCourse> purchases = purchaserepo.findByCourseidAndCompleteFalse(userId);

		if (purchases == null || purchases.isEmpty()) {
			structure.setMessage("No incomplete courses found for this user");
			structure.setStatus(HttpStatus.NOT_FOUND.value());
			structure.setData(Collections.emptyList());
			return new ResponseEntity<>(structure, HttpStatus.NOT_FOUND);
		}

		List<Long> courseIds = purchases.stream().map(UserPurchasedCourse::getCourseid).distinct()
				.collect(Collectors.toList());

		List<AddCourse> courses = courserpo.findByCourseidIn(courseIds);

		structure.setMessage("Incomplete courses fetched successfully");
		structure.setStatus(HttpStatus.OK.value());
		structure.setData(courses);

		return new ResponseEntity<>(structure, HttpStatus.OK);
	}

	public ResponseStructure<Map<String, Long>> getTraineePurchaseStats() {
		
		long totalTrainees = interstedrepo.countByCurrentstatus("paid");
		long totalcertificate = certirepo.countByCertificateStatus("issued");
		long totalcerreject = certirepo.countByCertificateStatus("rejected");
		List<UserPurchasedCourse> allPurchases = purchaserepo.findAll();
		long totalPurchasingTrainees = allPurchases.stream().map(UserPurchasedCourse::getUserid).distinct().count();
		
		Map<String, Long> data = new HashMap<>();
		  long completedBatches = 0;
		    try {
		        List<Batch> allBatches = batchrepo.findAll();
		        
		        for (Batch batch : allBatches) {
		            // Calculate total sessions for this batch
		            int totalSessions = 0;
		            if (batch.getModules() != null && !batch.getModules().isEmpty()) {
		                totalSessions = batch.getModules().stream()
		                    .filter(module -> module != null && module.getTotalsession() != null)
		                    .mapToInt(module -> {
		                        try {
		                            return Integer.parseInt(module.getTotalsession());
		                        } catch (NumberFormatException e) {
		                            return 0;
		                        }
		                    })
		                    .sum();
		            }
		            
		            // Count completed sessions for this batch
		            if (totalSessions > 0) {
		                long completedSessions = session.countByBatchidAndStatus(
		                    batch.getBatchid(),
		                    true
		                );
		                
		                // If all sessions are completed, increment count
		                if (completedSessions >= totalSessions) {
		                    completedBatches++;
		                }
		            }
		        }
		    } catch (Exception e) {
		        System.err.println("❌ Error counting completed batches: " + e.getMessage());
		    }
		    
		    
		    long studentsNotCompleted = 0;

		    try {
		        List<Batch> allBatches = batchrepo.findAll();

		        for (Batch batch : allBatches) {

		            // Calculate total sessions for this batch
		            int totalSessions = 0;
		            if (batch.getModules() != null && !batch.getModules().isEmpty()) {
		                totalSessions = batch.getModules().stream()
		                    .filter(module -> module != null && module.getTotalsession() != null)
		                    .mapToInt(module -> {
		                        try {
		                            return Integer.parseInt(module.getTotalsession());
		                        } catch (NumberFormatException e) {
		                            return 0;
		                        }
		                    })
		                    .sum();
		            }

		            if (totalSessions == 0) continue;

		            // Count completed sessions for this batch
		            long completedSessions = session.countByBatchidAndStatus(
		                batch.getBatchid(), true
		            );

		            // ✅ Batch is completed
		            if (completedSessions >= totalSessions) {
		                // Batch completed → add 0 (don't count students)
		                System.err.println("Batch " + batch.getBatchid() + " COMPLETED → students count: 0");

		            } else {
		                // ✅ Batch NOT completed → count enrolled students
		                long enrolledStudents = purchaserepo.countByBatchid(batch.getBatchid());
		                studentsNotCompleted += enrolledStudents;
		                System.err.println("Batch " + batch.getBatchid()
		                    + " NOT COMPLETED → enrolled students: " + enrolledStudents);
		            }
		        }

		    } catch (Exception e) {
		        System.err.println("Error: " + e.getMessage());
		    }

//		    data.put("studentsNotCompleted", studentsNotCompleted);
		data.put("totalTrainees", totalTrainees);
		data.put("totalPurchasingTrainees",studentsNotCompleted  );
		data.put("completedcourses", completedBatches);
		data.put("certi", totalcertificate);
		data.put("certificatereject", totalcerreject);
		System.err.println(totalTrainees +"success");

		ResponseStructure<Map<String, Long>> response = new ResponseStructure<>();
		response.setStatus(200);
		response.setMessage("Trainee details");
		response.setData(data);

		return response;
	}

	public ResponseStructure<List<StudentListDto>> fetchStudentsList(long batchid) {

		List<StudentListDto> students = purchaserepo.findStudentsByBatchId(batchid);

		ResponseStructure<List<StudentListDto>> response = new ResponseStructure<>();

		if (students == null || students.isEmpty()) {
			response.setStatus(404);
			response.setMessage("No students found for this batch");
			response.setData(Collections.emptyList());
			return response;
		}

		response.setStatus(200);
		response.setMessage("Students fetched successfully");
		response.setData(students);

		return response;
	}

	public Map<String, List<CourseProgresDTO>> getUserCourseProgress(long userid) {
		List<UserPurchasedCourse> purchasedCourses = purchaserepo.findByUserid(userid);

		if (purchasedCourses == null || purchasedCourses.isEmpty()) {
			Map<String, List<CourseProgresDTO>> emptyResult = new HashMap<>();
			emptyResult.put("completed", new ArrayList<>());
			emptyResult.put("incomplete", new ArrayList<>());
			return emptyResult;
		}

		List<CourseProgresDTO> progressList = purchasedCourses.stream().map(this::calculateProgressWithModules)
				.filter(dto -> dto != null).collect(Collectors.toList());

		Map<String, List<CourseProgresDTO>> groupedResult = progressList.stream()
				.collect(Collectors.groupingBy(course -> course.isCompleted() ? "completed" : "incomplete"));

		groupedResult.putIfAbsent("completed", new ArrayList<>());
		groupedResult.putIfAbsent("incomplete", new ArrayList<>());

		return groupedResult;
	}

	private CourseProgresDTO calculateProgressWithModules(UserPurchasedCourse purchased) {
		try {
			Batch batch = batchrepo.findBybatchi(purchased.getBatchid());

			if (batch == null) {
				System.err.println("⚠️ Batch not found for batchId: " + purchased.getBatchid());
				return createDefaultProgressDTO(purchased);
			}
			AddCourse course = courserpo.findByCourseI(purchased.getCourseid());

			int totalSessions = 0;
			List<BatchModulesDto> moduleProgressList = new ArrayList<>();

			if (batch.getModules() != null && !batch.getModules().isEmpty()) {
				for (BatchModulesDto module : batch.getModules()) {
					int moduleTotalSessions = 0;
					try {
						moduleTotalSessions = Integer.parseInt(module.getTotalsession());
					} catch (NumberFormatException e) {
						System.err.println(" Invalid totalsession: " + module.getTotalsession());
					}

					totalSessions += moduleTotalSessions;
					long moduleCompletedSessions = session.countByBatchidAndModulenameAndStatus(purchased.getBatchid(),
							module.getModuleName(), true);

					List<SessionReport> moduleSessionReports = session
							.findByBatchidAndModulename(purchased.getBatchid(), module.getModuleName());
//               
//                if (module.getSessions() != null) {
//                    for (BatchSessionDto session : module.getSessions()) {
//                        boolean sessionCompleted = moduleSessionReports.stream()
//                            .anyMatch(sr -> 
//                                String.valueOf(sr.getSessionno()).equals(String.valueOf(session.getSessionNo())) 
//                                && sr.isStatus()
//                            );
//                        
//                        session.setCompleted(sessionCompleted);
//                    }
//                }

					if (module.getSessions() != null && !module.getSessions().isEmpty()) {

						List<BatchSessionDto> pendingSessions = new ArrayList<>();

						for (BatchSessionDto sessionDto : module.getSessions()) {

							boolean isCompleted = moduleSessionReports.stream()
									.anyMatch(sr -> String.valueOf(sr.getSessionno())
											.equals(String.valueOf(sessionDto.getSessionNo())) && sr.isStatus());

							// ONLY add session if NOT completed
							if (!isCompleted) {
								sessionDto.setCompleted(false);
								pendingSessions.add(sessionDto);
							}
						}

						// Replace sessions with only pending ones
						module.setSessions(pendingSessions);
					}

					double moduleProgress = moduleTotalSessions > 0
							? (moduleCompletedSessions * 100.0 / moduleTotalSessions)
							: 0.0;

					ModuleProgressDTO moduleProgressDto = new ModuleProgressDTO(module, (int) moduleCompletedSessions,
							moduleProgress);

					moduleProgressList.add(moduleProgressDto);
				}
			}

			// Count overall completed sessions
			long completedSessions = session.countByBatchidAndStatus(purchased.getBatchid(), true);

			// Build DTO
			CourseProgresDTO dto = new CourseProgresDTO();

			dto.setPurchaseId(purchased.getPurchaseid());
			dto.setCourseId(purchased.getCourseid());
			dto.setCourseName(purchased.getCoursename());
			dto.setBatchId(purchased.getBatchid());
			dto.setCoursedesc(batch.getCoursedesc());
			dto.setBatchNo(purchased.getBatchno());
			dto.setBatchStartDate(purchased.getBatchstartdate());
			dto.setBatchEndDate(batch.getEnddate());
			dto.setTotalSessions(totalSessions);
			dto.setMetadata(course.getMetadata());
			dto.setCompletedSessions((int) completedSessions);
			dto.setCompleted(totalSessions > 0 && completedSessions >= totalSessions);
			dto.setStatus(purchased.getStatus());
			dto.setTrainerId(batch.getPrimarytrainerid());
			dto.setTrainername(batch.getPrimarytrainer());
			dto.setEnrollDate(purchased.getEnrollDate());
			dto.setModules(moduleProgressList); // ✅ Reusing your existing DTOs

			return dto;

		} catch (Exception e) {
			System.err.println("Error calculating progress: " + e.getMessage());
			e.printStackTrace();
			return createDefaultProgressDTO(purchased);
		}
	}

	private CourseProgresDTO createDefaultProgressDTO(UserPurchasedCourse purchased) {
		CourseProgresDTO dto = new CourseProgresDTO();
		dto.setPurchaseId(purchased.getPurchaseid());
		dto.setCourseId(purchased.getCourseid());
		dto.setCourseName(purchased.getCoursename());
		dto.setBatchId(purchased.getBatchid());
		dto.setBatchNo(purchased.getBatchno());
		dto.setBatchStartDate(purchased.getBatchstartdate());
		dto.setBatchEndDate(null);
		dto.setTotalSessions(0);
		dto.setCompletedSessions(0);
		dto.setCompleted(false);
		dto.setStatus(purchased.getStatus());
		dto.setEnrollDate(purchased.getEnrollDate());
		dto.setModules(new ArrayList<>());
		return dto;
	}

}
