package com.lms.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.config.ResponseStructure;
import com.lms.dao.BatchDao;
import com.lms.dto.AddTrainerDto;
import com.lms.dto.BatchDto;
import com.lms.dto.BatchModulesDto;
import com.lms.dto.BatchSessionDto;
import com.lms.dto.ModuleDto;
import com.lms.dto.SessionDto;
import com.lms.dto.TrainerBatchCountDto;
import com.lms.dto.TrainerBatchDetailsDTO;
//import com.lms.dto.TrainerCourseDto;
import com.lms.dto.TrainerProgressDto;
import com.lms.dto.TrainerSummaryDto;
import com.lms.entity.AddCourse;
import com.lms.entity.AddTrainer;
import com.lms.entity.Batch;
import com.lms.entity.Questions;
import com.lms.entity.SessionReport;
import com.lms.entity.UserPurchasedCourse;
import com.lms.exceptions.BatchAlreadyExistsException;
import com.lms.exceptions.CourseIdnotFoundException;
import com.lms.exceptions.IdNotFoundException;
import com.lms.exceptions.UserAlreadyExistsException;
import com.lms.repository.AddCourseRepository;
import com.lms.repository.AddTrainerRepository;
import com.lms.repository.BatchRepository;
import com.lms.repository.PurchasedCourseRepository;
import com.lms.repository.SessionReportRepository;
import com.mongodb.client.result.UpdateResult;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BatchService {

	@Autowired
	BatchDao batchdao;
	
@Autowired
AddCourseRepository courserepo;




	@Autowired
	private MongoOperations mongoOperations;

	@Autowired
	private AddTrainerRepository trainerrepo;

	@Autowired
	BatchRepository batchrepo;

	@Autowired
	PurchasedCourseRepository purchaserepo;

//	@Autowired
//	AddCourseRepository courserepo;

	@Autowired
	private SessionReportRepository sessionReportRepo;

	public ResponseEntity<ResponseStructure<List<Batch>>> savebatch(Batch batch) {
		log.info("batch" + batch);
		boolean exists = batchrepo.existsByCourseidAndBatchno(batch.getCourseid(), batch.getBatchno());

		if (exists) {
			throw new BatchAlreadyExistsException("Batch " + batch.getBatchno() + " already exists for this course");
		}

		Batch batc = batchdao.savebatchsedetails(batch);
		if (batc != null) {

			ResponseStructure<List<Batch>> responseStructure = new ResponseStructure<>();
			responseStructure.setMessage("Batch created successfully");
			responseStructure.setStatus(HttpStatus.CREATED.value());
			responseStructure.setData(batc);

			return new ResponseEntity<ResponseStructure<List<Batch>>>(responseStructure, HttpStatus.OK);
		} else {
			throw new UserAlreadyExistsException("batch can not be empty");
		}
	}

	public ResponseEntity<ResponseStructure<List<Batch>>> findallthebatch() {
		List<Batch> batch = batchdao.findallbatch();
		List<BatchDto> batchdto = new ArrayList<>();
		if (batch != null && !batch.isEmpty()) {
			for (Batch b : batch) {
				System.err.println(b.getCourseid());
				BatchDto batdto = new BatchDto();
				batdto.setBatchid(b.getBatchid());
				batdto.setBatchno(b.getBatchno());
				batdto.setCoursename(b.getCoursename());
				batdto.setCourseid(b.getCourseid());
				batdto.setEnddate(b.getEnddate());
				batdto.setStartdate(b.getStartdate());
				batdto.setStudentcapacity(b.getStudentcapacity());
				batdto.setTrainingmode(b.getTrainingmode());
				batdto.setStatus(b.getStatus());
				batchdto.add(batdto);

			}

			ResponseStructure<List<Batch>> structure = new ResponseStructure<>();
			structure.setData(batchdto);
			structure.setMessage("Batch founded");
			structure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<Batch>>>(structure, HttpStatus.OK);
		} else {
			throw new CourseIdnotFoundException("Batch not found");
		}

	}

	public ResponseEntity<ResponseStructure<Batch>> findcoursebyid(long id) {
		List<Batch> batch = batchdao.findbycourseid(id);

		if (batch != null) {
			ResponseStructure<Batch> responseStructure = new ResponseStructure<>();
			responseStructure.setData(batchdao.findbycourseid(id));
			responseStructure.setMessage("course found");
			responseStructure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<Batch>>(responseStructure, HttpStatus.OK);
		} else {
			throw new IdNotFoundException("course id not found");

		}
	}

	public ResponseEntity<ResponseStructure<Batch>> findbybatchid(long id) {
		Batch batch = batchdao.findbybatchid(id);

		if (batch != null) {
			ResponseStructure<Batch> responseStructure = new ResponseStructure<>();
			responseStructure.setData(batchdao.findbybatchid(id));
			responseStructure.setMessage("batchfound found");
			responseStructure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<Batch>>(responseStructure, HttpStatus.OK);
		} else {
			throw new IdNotFoundException("course id not found");

		}
	}

	public ResponseEntity<ResponseStructure<String>> updateBatchByBatchId(long batchId,
			com.lms.dto.UpdateBatchDto request) {

		log.info("Update batch service called for batchId={}", batchId);
		Map<String, Object> fields = new ObjectMapper().convertValue(request, Map.class);
		fields.entrySet().removeIf(e -> e.getValue() == null);
		fields.remove("Batch_id");
		fields.remove("batch_id");	
		fields.remove("batchId");
		fields.remove("_id");
		Query query = new Query(Criteria.where("Batch_id").is(batchId));
		Batch existing = mongoOperations.findOne(query, Batch.class);
		if (existing == null) {
			ResponseStructure<String> response = new ResponseStructure<>();
			response.setMessage("Batch not found");
			response.setStatus(HttpStatus.NOT_FOUND.value());
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		Update update = new Update();
		fields.forEach(update::set);
		update.set("assignedDate", Instant.now());
		UpdateResult result = mongoOperations.updateFirst(query, update, Batch.class);
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setMessage("Batch updated successfully");
		response.setStatus(HttpStatus.OK.value());
		return ResponseEntity.ok(response);
	}



	public ResponseEntity<?> getTrainerBatchesWithCourse(long trainerId) {

		// 1️⃣ Fetch trainer batches
		Query batchQuery = new Query(Criteria.where("primarytrainerid").is(trainerId));
		List<Batch> batches = mongoOperations.find(batchQuery, Batch.class);

		if (batches == null || batches.isEmpty()) {
			ResponseStructure<?> response = new ResponseStructure<>();
			response.setStatus(HttpStatus.NOT_FOUND.value());
			response.setMessage("No batches found for this trainer");
			response.setData(Collections.emptyList());
			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		List<Map<String, Object>> responseList = new ArrayList<>();

	
		for (Batch batch : batches) {

			Map<String, Object> batchObj = new LinkedHashMap<>();
			batchObj.put("course_name", null);
			batchObj.put("batchName", batch.getBatchno());
			batchObj.put("batchid", batch.getBatchid());

			Query courseQuery = new Query(Criteria.where("courseid").is(batch.getCourseid()));
			AddCourse course = mongoOperations.findOne(courseQuery, AddCourse.class);

			if (course == null) {
				batchObj.put("course_name", "Course not found");
				batchObj.put("Modules", Collections.emptyList());
				responseList.add(batchObj);
				continue;
			}

			batchObj.put("course_name", course.getCoursename());
			batchObj.put("courseid", course.getCourseid());

			//  Fetch session reports for course + batch
			Query reportQuery = new Query(
					Criteria.where("courseid").is(batch.getCourseid()).and("batchid").is(batch.getBatchid()));
			List<SessionReport> reports = mongoOperations.find(reportQuery, SessionReport.class);

			//  Create lookup map → moduleId_sessionNo → status
			Map<String, Boolean> sessionStatusMap = new HashMap<>();

			for (SessionReport report : reports) {
				// "Session 1" → "1"
				String sessionNo = report.getSessionno().replaceAll("[^0-9]", "");

				String key = report.getModuleno() + "_" + sessionNo;
				sessionStatusMap.put(key, report.isStatus());
			}

			//  Build module + session response
			List<Map<String, Object>> moduleList = new ArrayList<>();

			for (Object moduleObjDb : course.getModules()) {

				Map<String, Object> dbModule = (Map<String, Object>) moduleObjDb;

				String moduleId = (String) dbModule.get("moduleId");

				Map<String, Object> moduleObj = new LinkedHashMap<>();
				moduleObj.put("moduleId", moduleId);
				moduleObj.put("moduleName", "Module " + dbModule.get("moduleName"));

				List<Map<String, Object>> sessionList = new ArrayList<>();
				List<Map<String, Object>> sessions = (List<Map<String, Object>>) dbModule.get("sessions");

				if (sessions != null) {
					for (Map<String, Object> s : sessions) {

						String sessionNo = String.valueOf(s.get("sessionNo"));
						String key = moduleId + "_" + sessionNo;

						Map<String, Object> sessionObj = new LinkedHashMap<>();
						sessionObj.put("sessionNo", s.get("sessionNo"));
						sessionObj.put("startDate", s.get("startDate"));
						sessionObj.put("startTime", s.get("startTime"));
						sessionObj.put("endDate", s.get("endDate"));
						sessionObj.put("endTime", s.get("endTime"));

						// ONLY if session report exists
						if (sessionStatusMap.containsKey(key)) {
							sessionObj.put("status", sessionStatusMap.get(key));
						}

						sessionList.add(sessionObj);
					}
				}

				moduleObj.put("sessions", sessionList);
				moduleList.add(moduleObj);
			}

			batchObj.put("Modules", moduleList);
			responseList.add(batchObj);
		}

		//  Final response
		ResponseStructure<Object> response = new ResponseStructure<>();
		response.setStatus(HttpStatus.OK.value());
		response.setMessage("Trainer batches founded");
		response.setData(responseList);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public TrainerBatchCountDto getTrainerBatchCounts(Long trainerId) {

		// Total batches under trainer
		List<Batch> allBatches = batchrepo.findByPrimarytrainerid(trainerId);

		// Active batches under trainer
		List<Batch> activeBatches = batchrepo.findByPrimarytraineridAndStatus(trainerId, "Active");
		List<Batch> completedBatches = batchrepo.findByPrimarytraineridAndStatus(trainerId, "Completed");
		TrainerBatchCountDto dto = new TrainerBatchCountDto();
		dto.setTrainerId(trainerId);
		dto.setTotalBatches(allBatches.size());
		dto.setActiveBatches(activeBatches.size());
		dto.setCompleted(completedBatches.size());

		return dto;
	}

//	public List<UserPurchasedCourse> getIncompleteCoursesByTrainer(long primaryTrainerId) {
//		 ResponseStructure<List<AddCourse>> structure = new ResponseStructure<>();
//	    // 1️⃣ Get all batches for this trainer
//	    List<Batch> batches = batchrepo.findByPrimarytrainerid(primaryTrainerId);
//
//	    if (batches == null || batches.isEmpty()) {
//	        return Collections.emptyList();
//	    }
//
//	    // 2️⃣ Extract unique course IDs
//	    Set<Long> courseIds = batches.stream()
//	            .map(batch -> batch.getCourseid())   // IMPORTANT: correct getter
//	            .filter(Objects::nonNull)
//	            .collect(Collectors.toSet());
//
//	    // 3️⃣ Call repo for each courseId
//	    List<UserPurchasedCourse> result = new ArrayList<>();
//
//	    for (Long courseId : courseIds) {
//	        System.out.println("Querying courseId = " + courseId);
//	        List<UserPurchasedCourse> purchases = purchaserepo.findByCourseidAndCompleteFalse(courseId);
//	        
//	        List<Long> cours = purchases.stream()
//	                .map(UserPurchasedCourse::getCourseid)
//	                .distinct()
//	                .collect(Collectors.toList());
//
//	      
//	        List<AddCourse> courses = courserepo.findByCourseidIn(cours);
//
//	        structure.setMessage("Incomplete courses fetched successfully");
//	        structure.setStatus(HttpStatus.OK.value());
//	        structure.setData(courses);
//            System.err.println(purchases);
//	        System.out.println("Found = " + purchases.size());
//
//	        
//	    }
//		return result;
//
//	  
//	}

	public List<AddCourse> getIncompleteCoursesByTrainer(long primaryTrainerId) {
		
		List<Batch> batches = batchrepo.findByPrimarytrainerid(primaryTrainerId);

		if (batches == null || batches.isEmpty()) {
			return Collections.emptyList();
		}

		
		Set<Long> courseIds = batches.stream().map(Batch::getCourseid) // Ensure getter is correct
				.filter(Objects::nonNull).collect(Collectors.toSet());

		
		Set<Long> incompleteCourseIds = new HashSet<>();
		for (Long courseId : courseIds) {
			System.out.println("Querying courseId = " + courseId);
			List<UserPurchasedCourse> purchases = purchaserepo.findByCourseidAndCompleteFalse(courseId);
			if (purchases != null && !purchases.isEmpty()) {
				// Add courseId to the set if there is any incomplete purchase
				incompleteCourseIds.add(courseId);
			}
			System.out.println("Found incomplete purchases = " + purchases.size());
		}

		// Fetch AddCourse objects for these incomplete course IDs
		List<AddCourse> incompleteCourses = courserepo.findByCourseidIn(new ArrayList<>(incompleteCourseIds));
		System.out.println("Total incomplete courses = " + incompleteCourses.size());

		return incompleteCourses;
	}

	public List<AddCourse> getcompleteCoursesByTrainer(long primaryTrainerId) {
		
		List<Batch> batches = batchrepo.findByPrimarytrainerid(primaryTrainerId);

		if (batches == null || batches.isEmpty()) {
			return Collections.emptyList();
		}

		Set<Long> courseIds = batches.stream().map(Batch::getCourseid) // Ensure getter is correct
				.filter(Objects::nonNull).collect(Collectors.toSet());

		// Collect all course IDs with incomplete purchases
		Set<Long> incompleteCourseIds = new HashSet<>();
		for (Long courseId : courseIds) {
			System.out.println("Querying courseId = " + courseId);
			List<UserPurchasedCourse> purchases = purchaserepo.findByCourseidAndCompleteTrue(courseId);
			if (purchases != null && !purchases.isEmpty()) {
				// Add courseId to the set if there is any incomplete purchase
				incompleteCourseIds.add(courseId);
			}
			System.out.println("Found incomplete purchases = " + purchases.size());
		}

		// Fetch AddCourse objects for these incomplete course IDs
		List<AddCourse> incompleteCourses = courserepo.findByCourseidIn(new ArrayList<>(incompleteCourseIds));
		System.out.println("Total incomplete courses = " + incompleteCourses.size());

		return incompleteCourses;
	}

	public List<TrainerSummaryDto> getTrainerSummary() {
		return batchrepo.getTrainerSummary();
	}

	public ResponseStructure<Map<String, Long>> getBatchCounts() {

		ResponseStructure<Map<String, Long>> structure = new ResponseStructure<>();

		long totalBatches = batchrepo.count();
		long activeBatches = batchrepo.countByStatus("Active");
		long inactiveBatches = batchrepo.countByStatus("InActive");

		Map<String, Long> response = new HashMap<>();
		response.put("totalBatches", totalBatches);
		response.put("activeBatches", activeBatches);
		response.put("inactiveBatches", inactiveBatches);

		structure.setStatus(HttpStatus.OK.value());
		structure.setMessage("Batch count fetched successfully");
		structure.setData(response);

		return structure;
	}

	public ResponseEntity<?> getTrainerBatchProgress(long trainerId) {
		try {
			List<Batch> trainerBatches = batchrepo.findByPrimarytrainerid(trainerId);
			System.err.println(trainerBatches);

			if (trainerBatches == null || trainerBatches.isEmpty()) {
				Map<String, Object> emptyResponse = new HashMap<>();
				emptyResponse.put("trainerId", trainerId);
				emptyResponse.put("completed", new ArrayList<>());
				emptyResponse.put("incomplete", new ArrayList<>());
				emptyResponse.put("totalCourses", 0);
				return ResponseEntity.ok(emptyResponse);
			}

			List<TrainerProgressDto> progressList = trainerBatches.stream()
					.map(batch -> calculateBatchProgress(batch, trainerId)).filter(dto -> dto != null)
					.collect(Collectors.toList());

			Map<String, List<TrainerProgressDto>> groupedResult = progressList.stream()
					.collect(Collectors.groupingBy(batch -> batch.isCompleted() ? "completed" : "incomplete"));

			groupedResult.putIfAbsent("completed", new ArrayList<>());
			groupedResult.putIfAbsent("incomplete", new ArrayList<>());

			Map<String, Object> response = new HashMap<>();
			response.put("trainerId", trainerId);
			response.put("completed", groupedResult.get("completed"));
			response.put("incomplete", groupedResult.get("incomplete"));
			response.put("totalCompleted", groupedResult.get("completed").size());
			response.put("totalIncomplete", groupedResult.get("incomplete").size());
			response.put("totalCourses", progressList.size());

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
		}
	}

	/**
	 * Calculate batch progress for a trainer
	 */
	private TrainerProgressDto calculateBatchProgress(Batch batch, long trainerId) {
		try {
			// Calculate total sessions from modules
			AddCourse course = courserepo.findByCourseI(batch.getCourseid());
			int totalSessions = 0;
			if (batch.getModules() != null && !batch.getModules().isEmpty()) {
				totalSessions = batch.getModules().stream()
						.filter(module -> module != null && module.getTotalsession() != null).mapToInt(module -> {
							try {
								return Integer.parseInt(module.getTotalsession());
							} catch (NumberFormatException e) {
								return 0;
							}
						}).sum();
			}

			long completedSessions = sessionReportRepo.countByBatchidAndStatus(batch.getBatchid(), true);
			long trainerCompletedSessions = sessionReportRepo.countByBatchidAndTraineridAndStatus(batch.getBatchid(),
					trainerId, true);

			TrainerProgressDto dto = new TrainerProgressDto();
			dto.setBatchid(batch.getBatchid());
			dto.setCourseId(batch.getCourseid());
			dto.setBatchNo(batch.getBatchno());
			dto.setCourseName(batch.getCoursename());
			dto.setBatchStartDate(batch.getStartdate());
			dto.setBatchEndDate(batch.getEnddate());
			dto.setTotalSessions(totalSessions);
			dto.setCompletedSessions((int) completedSessions);
			dto.setTrainerCompletedSessions((int) trainerCompletedSessions);
			dto.setCompleted(completedSessions >= totalSessions);
			dto.setStatus(batch.getStatus().toString());
			dto.setTrainerRole("Primary Trainer");
			dto.setTrainingMode(batch.getTrainingmode());
			dto.setStudentCapacity(batch.getStudentcapacity());
			dto.setPrimaryTrainerName(batch.getPrimarytrainer());
			dto.setCoursedesc(batch.getCoursedesc());
			dto.setModules(batch.getModules());
			dto.setMetadata(course.getMetadata());
			return dto;

		} catch (Exception e) {
			System.err.println("Error calculating batch progress: " + e.getMessage());
			return null;
		}
	}

	public ResponseEntity<ResponseStructure<List<TrainerBatchDetailsDTO>>> getCompleteBatchDetailsForPrimaryTrainer(
			long primaryTrainerId) {

		ResponseStructure<List<TrainerBatchDetailsDTO>> responseStructure = new ResponseStructure<>();

		try {
			System.err.println("\n========== START getCompleteBatchDetailsForPrimaryTrainer ==========");
			System.err.println("Primary Trainer ID: " + primaryTrainerId);

			//Get all batches where trainer is PRIMARY trainer only
			List<Batch> trainerBatches = batchrepo.findByPrimarytrainerid(primaryTrainerId);
			System.err.println("Found " + (trainerBatches != null ? trainerBatches.size() : 0) + " batches");

			if (trainerBatches == null || trainerBatches.isEmpty()) {
				responseStructure.setStatus(HttpStatus.OK.value());
				responseStructure.setMessage("No batches found for this trainer");
				responseStructure.setData(Collections.emptyList());
				return new ResponseEntity<>(responseStructure, HttpStatus.OK);
			}

			//Get all completed session reports for this primary trainer
			List<SessionReport> completedSessionReports = sessionReportRepo
					.findByTraineridAndStatusTrue(primaryTrainerId);
			System.err.println("Found " + completedSessionReports.size() + " completed session reports");

			//Create a map of batchId -> Map of moduleId -> Set of completed
			// session numbers
			Map<Long, Map<String, Set<String>>> completedSessionsByBatchAndModule = completedSessionReports.stream()
					.collect(Collectors.groupingBy(SessionReport::getBatchid, Collectors.groupingBy(
							SessionReport::getModuleno,
							Collectors.mapping(report -> String.valueOf(report.getSessionno()), Collectors.toSet()))));

			System.err.println("Completed Sessions Map: " + completedSessionsByBatchAndModule);

			// Map batches to DTO and filter sessions
			List<TrainerBatchDetailsDTO> batchDetails = trainerBatches.stream().map(batch -> {
				TrainerBatchDetailsDTO dto = mapToDTOWithFilteredSessions(batch, completedSessionsByBatchAndModule);
				System.err.println(">>> AFTER MAPPING - Batch " + dto.getBatchId() + " - Total: "
						+ dto.getTotalSessions() + " - Remaining: " + dto.getTotalRemainingSessions() + " - Completed: "
						+ dto.getTotalCompletedSessions() + " - Modules count: "
						+ (dto.getModules() != null ? dto.getModules().size() : 0));
				return dto;
			}).filter(dto -> {
				boolean hasRemaining = dto != null && dto.getTotalRemainingSessions() > 0;
				System.err.println(">>> FILTER CHECK - Batch " + (dto != null ? dto.getBatchId() : "null")
						+ " - Remaining Sessions: " + (dto != null ? dto.getTotalRemainingSessions() : "N/A")
						+ " - Will Include: " + hasRemaining);
				return hasRemaining;
			}).collect(Collectors.toList());

			System.err.println(">>> FINAL BATCH DETAILS COUNT: " + batchDetails.size());

			//Prepare response
			if (batchDetails.isEmpty()) {
				System.err.println(">>> All sessions completed - returning NO_CONTENT");
				responseStructure.setStatus(HttpStatus.OK.value());
				responseStructure.setMessage("All sessions completed for all batches");
				responseStructure.setData(Collections.emptyList());
				return new ResponseEntity<>(responseStructure, HttpStatus.OK);
			}

			// Log final data before returning
			System.err.println("\n>>> FINAL DATA BEING RETURNED:");
			for (TrainerBatchDetailsDTO detail : batchDetails) {
				System.err.println("  Batch " + detail.getBatchId() + " - Total: " + detail.getTotalSessions()
						+ " - Remaining: " + detail.getTotalRemainingSessions() + " - Completed: "
						+ detail.getTotalCompletedSessions() + " - Modules: "
						+ (detail.getModules() != null ? detail.getModules().size() : 0));
				if (detail.getModules() != null) {
					for (ModuleDto module : detail.getModules()) {
						System.err.println("    Module " + module.getModuleId() + " - Sessions: "
								+ (module.getSessions() != null ? module.getSessions().size() : 0));
					}
				}
			}

			responseStructure.setStatus(HttpStatus.OK.value());
			responseStructure.setMessage("Batch details retrieved successfully");
			responseStructure.setData(batchDetails);

			System.err.println("END getCompleteBatchDetailsForPrimaryTrainer");
			return new ResponseEntity<>(responseStructure, HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			responseStructure.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
			responseStructure.setMessage("Error retrieving batch details: " + e.getMessage());
			responseStructure.setData(null);
			return new ResponseEntity<>(responseStructure, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Map Batch entity to DTO and filter out completed sessions
	 */
	private TrainerBatchDetailsDTO mapToDTOWithFilteredSessions(Batch batch,
			Map<Long, Map<String, Set<String>>> completedSessionsByBatchAndModule) {

		System.err.println("Processing Batch " + batch.getBatchid() + "");

		TrainerBatchDetailsDTO dto = new TrainerBatchDetailsDTO();

		// Batch Details
		dto.setBatchId(batch.getBatchid());
		dto.setBatchNo(batch.getBatchno());
		dto.setTrainingMode(batch.getTrainingmode());
		dto.setStudentCapacity(batch.getStudentcapacity());
		dto.setStartDate(batch.getStartdate());
		dto.setEndDate(batch.getEnddate());
		dto.setPrimaryTrainerId(batch.getPrimarytrainerid());
		dto.setBackupTrainerId(batch.getBackuptrainerid());

		// Course Details
		dto.setCourseId(batch.getCourseid());
		dto.setCourseName(batch.getCoursename());

		// Get completed sessions map for this batch
		Map<String, Set<String>> completedSessionsByModule = completedSessionsByBatchAndModule
				.getOrDefault(batch.getBatchid(), Collections.emptyMap());

		System.err.println("  Completed Sessions By Module: " + completedSessionsByModule);

		// Convert BatchModulesDto to ModuleDto and filter
		List<ModuleDto> filteredModules = convertAndFilterModules(batch.getModules(), completedSessionsByModule);

		System.err.println("  Filtered Modules Count: " + (filteredModules != null ? filteredModules.size() : 0));

		dto.setModules(filteredModules);

		// Calculate ACTUAL total sessions from original modules
		int actualTotalSessions = 0;
		if (batch.getModules() != null && !batch.getModules().isEmpty()) {
			for (BatchModulesDto module : batch.getModules()) {
				if (module.getSessions() != null) {
					actualTotalSessions += module.getSessions().size();
				}
			}
		}
		System.err.println("  Actual Total Sessions (from original modules): " + actualTotalSessions);

		// Calculate total remaining sessions from filtered modules
		int totalRemainingSessions = 0;
		if (filteredModules != null && !filteredModules.isEmpty()) {
			for (ModuleDto module : filteredModules) {
				if (module.getSessions() != null) {
					int sessionCount = module.getSessions().size();
					totalRemainingSessions += sessionCount;
					System.err.println(
							"    Module " + module.getModuleId() + " has " + sessionCount + " remaining sessions");
				}
			}
		}

		System.err.println("  Total Remaining Sessions (from filtered modules): " + totalRemainingSessions);

		dto.setTotalSessions(actualTotalSessions);
		dto.setTotalRemainingSessions(totalRemainingSessions);
		dto.setTotalCompletedSessions(actualTotalSessions - totalRemainingSessions);

		System.err.println("  Final DTO Values - Total: " + dto.getTotalSessions() + ", Remaining: "
				+ dto.getTotalRemainingSessions() + ", Completed: " + dto.getTotalCompletedSessions());
		System.err.println("End Processing Batch " + batch.getBatchid() + "");

		return dto;
	}

	/**
	 * Convert BatchModulesDto to ModuleDto and filter out completed sessions
	 */
	private List<ModuleDto> convertAndFilterModules(List<BatchModulesDto> batchModules,
			Map<String, Set<String>> completedSessionsByModule) {

		if (batchModules == null || batchModules.isEmpty()) {
			System.err.println("No modules to process");
			return new ArrayList<>();
		}

		System.err.println("Processing "+batchModules.size()+"modules");

		List<ModuleDto> moduleDtoList = new ArrayList<>();

		for (BatchModulesDto batchModule : batchModules) {
			// Convert BatchModulesDto to ModuleDto
			String moduleId = String.valueOf(batchModule.getModuleNo());

			System.err.println("      Module " + moduleId + " (" + batchModule.getModuleName() + ")");

			// Get completed sessions for THIS specific module
			Set<String> completedSessionsForThisModule = completedSessionsByModule.getOrDefault(moduleId,
					Collections.emptySet());

			System.err.println("        Completed sessions in this module: " + completedSessionsForThisModule);
			System.err.println("        Total sessions in this module: "
					+ (batchModule.getSessions() != null ? batchModule.getSessions().size() : 0));

			// Convert BatchSessionDto to SessionDto and filter
			List<SessionDto> remainingSessions = convertAndFilterSessions(batchModule.getSessions(),
					completedSessionsForThisModule);

			System.err.println("  Remaining sessions after filter: " + remainingSessions.size());

			// Only add module if it has remaining sessions
			if (!remainingSessions.isEmpty()) {
				ModuleDto moduleDto = new ModuleDto();
				moduleDto.setModuleId(moduleId);
				moduleDto.setModuleName(batchModule.getModuleName());
				moduleDto.setModuleDescription("");
				moduleDto.setModuleDuration(batchModule.getSessionDuration());
				moduleDto.setSessions(remainingSessions);
				moduleDtoList.add(moduleDto);
				System.err.println("Module INCLUDED in filtered list");
			} else {
				System.err.println("Module EXCLUDED (no remaining sessions)");
			}
		}

		System.err.println("    Total modules in filtered list: " + moduleDtoList.size());
		return moduleDtoList;
	}

	/**
	 * Convert BatchSessionDto to SessionDto and filter out completed sessions
	 */
	private List<SessionDto> convertAndFilterSessions(List<BatchSessionDto> batchSessions,
			Set<String> completedSessions) {

		if (batchSessions == null || batchSessions.isEmpty()) {
			return new ArrayList<>();
		}

		List<SessionDto> sessionDtoList = new ArrayList<>();

		for (BatchSessionDto batchSession : batchSessions) {
			String sessionNoStr = String.valueOf(batchSession.getSessionNo());
			boolean isCompleted = completedSessions.contains(sessionNoStr);

			System.err.println("Session " + sessionNoStr + "Completed " + isCompleted);

			// Only include if session is not completed
			if (!isCompleted) {
				SessionDto sessionDto = new SessionDto();
				sessionDto.setSessionNo(batchSession.getSessionNo());
				sessionDto.setStartDate(batchSession.getSessionstartdate());
				sessionDto.setStartTime(batchSession.getStarttime());
				sessionDto.setEndDate(batchSession.getSessionenddate());
				sessionDto.setEndTime(batchSession.getEndtime());

				sessionDtoList.add(sessionDto);
			}
		}
		System.err.println("success" + sessionDtoList);
		return sessionDtoList;

	}
	
	
	 public Batch getTrainerByCourseId(long courseId) {

	        List<Batch> batches = batchrepo.findByCourseId(courseId);

        if (batches == null || batches.isEmpty()) {
	            return null;
	        }

	        // If multiple batches exist → pick active/latest
	        return batches.get(0);
	    }
	
//	public BatchDto getTrainerByCourseId(long courseId) {
//
//	    List<Batch> batches = batchrepo.findByCourseId(courseId);
//
//	    if (batches == null || batches.isEmpty()) {
//	        return null;
//	    }
//
//	    Batch batch = batches.get(0);
//
//	    BatchDto dto = new BatchDto();
//	    dto.setCourseid(batch.getCourseid());
//	    dto.setBatchid(batch.getBatchid());
//	    dto.setBatchno(batch.getBatchno());
//	    dto.setTrainingmode(batch.getTrainingmode());
//	    dto.setStartdate(batch.getStartdate());
//	    dto.setEnddate(batch.getEnddate());
//	    dto.setPrimarytrainer(batch.getPrimarytrainer());
//	    dto.setPrimarytrainerid(batch.getPrimarytrainerid());
//	    dto.setBackuptrainer(batch.getBackuptrainer());
//	    dto.setBackuptrainerid(batch.getBackuptrainerid());
//
//	    // Primary trainer details
//	    trainerrepo.findByTrainerid(String.valueOf(batch.getPrimarytrainerid()))
//	            .ifPresent(trainer -> {
//	                AddTrainerDto trainerDto = new AddTrainerDto();
//	                trainerDto.setTrainerid(trainer.getTrainerid());
//	                trainerDto.setTrainername(trainer.getTrainername());
//	                trainerDto.setPersonalemailid(trainer.getPersonalemailid());
//	                trainerDto.setContactnumber(trainer.getContactnumber());
//	                trainerDto.setQualification(trainer.getQualification());
//
//	                dto.setPrimaryTrainerDetails(trainerDto);
//	            });
//
//	    // Backup trainer details
//	    trainerrepo.findByTrainerid(String.valueOf(batch.getBackuptrainerid()))
//	            .ifPresent(trainer -> {
//	                AddTrainerDto trainerDto = new AddTrainerDto();
//	                trainerDto.setTrainerid(trainer.getTrainerid());
//	                trainerDto.setTrainername(trainer.getTrainername());
//	                trainerDto.setPersonalemailid(trainer.getPersonalemailid());
//	                trainerDto.setContactnumber(trainer.getContactnumber());
//	                trainerDto.setQualification(trainer.getQualification());
//
//	                dto.setBackupTrainerDetails(trainerDto);
//	            });
//
//	    return dto;
//	}
	 
	 public ResponseStructure<Map<String, Long>> getBatchCountss() {
		 
		    ResponseStructure<Map<String, Long>> structure = new ResponseStructure<>();
	 
		    long totalBatches = batchrepo.count();
			long activeBatches = batchrepo.countByStatus("Active");
			long inactiveBatches = batchrepo.countByStatus("InActive");
			long completedbatches=batchrepo.countByStatus("Completed");
		    
		    // ✅ Calculate completed batches
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
		                long completedSessions = sessionReportRepo.countByBatchidAndStatus(
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
	 
		    Map<String, Long> response = new HashMap<>();
		    response.put("totalBatches", totalBatches);
		    response.put("activeBatches", activeBatches);
		    response.put("inactiveBatches", inactiveBatches);
		    response.put("completedBatches", completedbatches);
	 
		    structure.setStatus(HttpStatus.OK.value());
		    structure.setMessage("Batch count fetched successfully");
		    structure.setData(response);
	 
		    return structure;
		}
	 



	 
}
