package com.lms.service;

import java.io.File;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.lms.config.ResponseStructure;
import com.lms.dao.SessionReportDao;
import com.lms.dto.AllAttendanceResponseDto;
import com.lms.dto.BatchAttendanceDto;
import com.lms.dto.BatchModulesDto;
import com.lms.dto.BatchSessionDto;

import com.lms.dto.CourseModuleSessionDto;
import com.lms.dto.CourseSummaryDto;
import com.lms.dto.ModuleDateDto;
import com.lms.dto.ModuleDetailDto;

import com.lms.dto.ModuleSummaryDto;

import com.lms.dto.SessionDetailDto;
import com.lms.dto.SessionRecordingVideoDto;
import com.lms.dto.SessionReportDto;
import com.lms.dto.SessionReportRecordingDto;
import com.lms.dto.StudentAttendanceDT;
import com.lms.dto.StudentAttendanceDto;
import com.lms.dto.TrainerSessionSummaryDto;



import com.lms.dto.UserSessionDTO;
import com.lms.entity.AddCourse;
import com.lms.entity.Batch;
import com.lms.entity.RecordingSessions;
import com.lms.entity.SessionReport;
import com.lms.entity.StudentAttendance;
import com.lms.entity.User;
import com.lms.exceptions.FieldcannotbeEmpty;
import com.lms.exceptions.IdNotFoundException;
import com.lms.repository.AddCourseRepository;
import com.lms.repository.BatchRepository;
import com.lms.repository.CertificateRepository;
import com.lms.repository.RecordingSessionRepository;
import com.lms.repository.SessionReportRepository;
import com.lms.repository.UserRepository;
import com.lms.utils.MediaUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SessionReportService {

	@Autowired
	private SessionReportDao sessiondao;
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private MediaUtils mediautils;
	@Autowired
	private SessionReportRepository sessionrepo;
	@Autowired
	private AddCourseRepository courserepo;
	@Autowired
	BatchRepository batchrepo;
	@Autowired
	CertificateRepository certirepo;
	@Value("${task.file.path:uploads/}")
	private String taskFilePath;

	@Autowired
	RecordingSessionRepository recordingrepo;
	// flat folder in project root
	private static final String UPLOAD_DIR = "uploads/"; 

	public ResponseEntity<ResponseStructure<?>> savessionreport(SessionReport report, MultipartFile[] files) {
		File folder = new File("uploads");
		if (folder.exists() && folder.isDirectory()) {
			log.info("Folder exists");
		} else {
			log.info("Folder does NOT exist");
		}
		if (report == null) {
			throw new FieldcannotbeEmpty("report field cannot be empty");
		}
		ResponseEntity<?> metaResponse = mediautils.uploadAndGetMetadataonlypdf(files);
		if (metaResponse.getStatusCode().is2xxSuccessful()) {
			@SuppressWarnings("unchecked")
			List<Map<String, Object>> metadataList = (List<Map<String, Object>>) metaResponse.getBody();
			report.setMetadata(metadataList);
		}
		if (report != null) {
			report = sessiondao.addsessionreport(report);
			SessionReportDto dto = new SessionReportDto();
			dto.setBatchid(report.getBatchid());
			dto.setAttendance(report.getAttendance());
			dto.setBatchno(report.getBatchno());
			dto.setCourseid(report.getCourseid());
//			dto.setModuleid(report.getModuleno);
			dto.setModuleno(report.getModuleno());
			dto.setSessionno(report.getSessionno());
			dto.setCoursename(report.getCoursename());
			dto.setModulename(report.getModulename());
			dto.setMetadata(report.getMetadata());
			dto.setSessionreportid(report.getSessionreportid());
			ResponseStructure<SessionReportDto> structure = new ResponseStructure<>();
			structure.setMessage("session report created successfully");
			structure.setData(dto);
			structure.setStatus(HttpStatus.CREATED.value());
			return new ResponseEntity<>(structure, HttpStatus.CREATED);

		} else {
			ResponseStructure<SessionReportDto> structure = new ResponseStructure<>();
			structure.setMessage("session report failed to create");
			structure.setData(null);
			structure.setStatus(HttpStatus.CREATED.value());
			return new ResponseEntity<>(structure, HttpStatus.CREATED);
		}
	}

   

	public ResponseStructure<List<ModuleDateDto>> getModuleDatesFromSessionReports() {

		List<SessionReport> reports = sessionrepo.findAll();
		ResponseStructure<List<ModuleDateDto>> response = new ResponseStructure<>();

		if (reports == null || reports.isEmpty()) {
			response.setStatus(404);
			response.setMessage("No session reports found");
			response.setData(new ArrayList<>());
			return response;
		}

		// Group by Course + Batch + Module
		Map<String, List<SessionReport>> grouped = reports.stream()
				.collect(Collectors.groupingBy(r -> r.getCourseid() + "_" + r.getBatchid() + "_" + r.getModuleno()));

		List<ModuleDateDto> result = new ArrayList<>();

		for (Map.Entry<String, List<SessionReport>> entry : grouped.entrySet()) {

			List<SessionReport> moduleReports = entry.getValue();
			if (moduleReports.isEmpty())
				continue;

			SessionReport firstReport = moduleReports.get(0);

			long courseId = firstReport.getCourseid();
			long batchid = firstReport.getBatchid();
			String moduleNo = firstReport.getModuleno();
			String moduleName = firstReport.getModulename();
			String batchNo = firstReport.getBatchno();
			String coursename=firstReport.getCoursename();
			Optional<Batch> batchOpt = batchrepo.findBybatchid(batchid);
			if (batchOpt.isEmpty())
				continue;

			Batch batch = batchOpt.get();

			long trainerId = batch.getPrimarytrainerid();
			String trainername = batch.getPrimarytrainer();

			List<BatchModulesDto> batchModules = batch.getModules();
			if (batchModules == null || batchModules.isEmpty())
				continue;

			BatchModulesDto batchModule = batchModules.stream()
					.filter(m -> String.valueOf(moduleNo).equalsIgnoreCase(m.getModuleNo()))

					.findFirst().orElse(null);

			if (batchModule == null)
				continue;

			List<BatchSessionDto> sessions = batchModule.getSessions();
			if (sessions == null || sessions.isEmpty())
				continue;

			// Sort sessions
			List<BatchSessionDto> sortedSessions = sessions.stream()
					.sorted(Comparator.comparingInt(BatchSessionDto::getSessionNo)).collect(Collectors.toList());

			BatchSessionDto firstSession = sortedSessions.get(0);
			BatchSessionDto lastSession = sortedSessions.get(sortedSessions.size() - 1);

			String moduleStartDate = firstSession.getSessionstartdate();
			String moduleEndDate = lastSession.getSessionenddate();

			//CORRECT MODULE COMPLETION LOGIC

			int totalSessions = sortedSessions.size();

			// Get distinct session numbers that have reports
			Set<String> completedSessionNumbers = moduleReports.stream().map(SessionReport::getSessionno)
					.collect(Collectors.toSet());

			boolean moduleCompleted = (totalSessions == completedSessionNumbers.size());

			
			ModuleDateDto dto = new ModuleDateDto();
			dto.setCourseId(courseId);
			dto.setModuleId(String.valueOf(moduleNo));
			dto.setModulename(moduleName);
			dto.setModuleStartDate(moduleStartDate);
			dto.setModuleEndDate(moduleEndDate);
			dto.setBatchno(batchNo);
			dto.setBatchid(batchid);
			dto.setTrainerName(trainername);
			dto.setTrainerId(trainerId);
			dto.setModuleCompleted(moduleCompleted);
			dto.setCoursename(coursename);

			result.add(dto);
		}

		if (result.isEmpty()) {
			response.setStatus(404);
			response.setMessage("No modules found in session reports");
			response.setData(new ArrayList<>());
			return response;
		}

		response.setStatus(200);
		response.setMessage("Module dates fetched successfully");
		response.setData(result);

		return response;
	}

//	private double calculateCustomAttendance(int attended, int totalSessions) {
//
//		if (totalSessions <= 0)
//			return 0;
//
//		if (attended >= totalSessions)
//			return 100.0;
//
//		switch (totalSessions) {
//		case 1:
//			return attended == 1 ? 100.0 : 0.0;
//		case 2:
//			return attended == 1 ? 75.0 : (attended == 2 ? 100.0 : 0.0);
//		case 3:
//			if (attended == 1)
//				return 50.0;
//			if (attended == 2)
//				return 75.0;
//			return 100.0;
//		default:
//			return ((double) attended / totalSessions) * 100.0;
//		}
//	}
	private double calculateCustomAttendance(int attended, int totalSessions) {
		 log.info("=== ATTENDANCE CALCULATION ===");
		    log.info("Attended: " + attended);
		    log.info("Total Sessions: " + totalSessions);
	    
	    if (totalSessions <= 0) 
	        return 0;
	    
	    // Handle case where attended exceeds total (shouldn't happen, but just in case)
	    if (attended > totalSessions)
	        return 100.0;
	    
	    switch (totalSessions) {
	        case 1:
	            return attended == 1 ? 100.0 : 0.0;
	        case 2:
	            if (attended == 0) return 0.0;
	            if (attended == 1) return 50.0;  // 1/2 = 50%
	            if (attended == 2) return 100.0;
	            return 0.0;
	        case 3:
	            if (attended == 0) return 0.0;
	            if (attended == 1) return 33.33;  // 1/3 ≈ 33%
	            if (attended == 2) return 66.67;  // 2/3 ≈ 67%
	            if (attended == 3) return 100.0;
	            return 0.0;
	        default:
	            // For 4+ sessions, use standard percentage
	            return ((double) attended / totalSessions) * 100.0;
	    }
	}

	public AllAttendanceResponseDto getAllAttendanceByTrainer(Long trainerId) {

		List<Batch> trainerBatches = batchrepo.findByPrimarytrainerid(trainerId);

		if (trainerBatches == null || trainerBatches.isEmpty()) {
			return new AllAttendanceResponseDto();
		}

		List<Long> batchIds = trainerBatches.stream().map(Batch::getBatchid).collect(Collectors.toList());

		List<SessionReport> reports = sessionrepo.findByBatchidIn(batchIds);

		if (reports.isEmpty()) {
			return new AllAttendanceResponseDto();
		}

		Map<String, List<SessionReport>> groupedMap = new HashMap<>();

		for (SessionReport report : reports) {
			String key = report.getCourseid() + "_" + report.getBatchid();
			groupedMap.computeIfAbsent(key, k -> new ArrayList<>()).add(report);
		}

		List<BatchAttendanceDto> batchResults = new ArrayList<>();

		for (Map.Entry<String, List<SessionReport>> entry : groupedMap.entrySet()) {

			List<SessionReport> batchReports = entry.getValue();

			long courseId = batchReports.get(0).getCourseid();
			long batchId = batchReports.get(0).getBatchid();
			String batchNo = batchReports.get(0).getBatchno();
			String coursename = batchReports.get(0).getCoursename();

			int totalSessions = batchReports.size();

			Map<Long, StudentAttendanceDto> studentMap = new HashMap<>();

			for (SessionReport report : batchReports) {

				if (report.getAttendance() == null || report.getAttendance().isEmpty()) {
					continue;
				}

				for (StudentAttendance att : report.getAttendance()) {

					StudentAttendanceDto dto = studentMap.get(att.getStudentId());

					if (dto == null) {
						dto = new StudentAttendanceDto();
						dto.setStudentId(att.getStudentId());
						dto.setName(att.getName());
						dto.setAttendedSessions(0);
						dto.setCourseId(courseId);
						dto.setBatchId(batchId);
						studentMap.put(att.getStudentId(), dto);
					}

					if (Boolean.TRUE.equals(att.getPresent())) {
						dto.setAttendedSessions(dto.getAttendedSessions() + 1);
					}
				}
			}
			for (StudentAttendanceDto dto : studentMap.values()) {
				double percentage = ((double) dto.getAttendedSessions() / totalSessions) * 100;
				dto.setAttendancePercentage(Math.round(percentage * 100.0) / 100.0);
				dto.setCertificateEligible(percentage >= 75);
			}

			Batch batchInfo = trainerBatches.stream().filter(b -> b.getBatchid() == batchId).findFirst().orElse(null);

			String trainerName = (batchInfo != null) ? batchInfo.getPrimarytrainer() : "N/A";

			BatchAttendanceDto batchDto = new BatchAttendanceDto();
			batchDto.setCourseId(courseId);
			batchDto.setBatchId(batchId);
			batchDto.setBatchNo(batchNo);
			batchDto.setCoursename(coursename);
			batchDto.setTotalSessions(totalSessions);
			batchDto.setTrainername(trainerName);
			batchDto.setTrainerid(trainerId);

			batchDto.setStudents(new ArrayList<>(studentMap.values()));

			batchResults.add(batchDto);
		}

		AllAttendanceResponseDto response = new AllAttendanceResponseDto();
		response.setBatches(batchResults);

		return response;
	}

	public StudentAttendanceDT getOverallAttendanceSummary(long studentId) {

		// 1️⃣ Get all session reports
		List<SessionReport> reports = sessionrepo.findAll();

		if (reports == null || reports.isEmpty()) {
			return new StudentAttendanceDT(studentId, 0, 0, 0.0);
		}

		int totalSessions = 0;
		int attendedSessions = 0;
		for (SessionReport report : reports) {

			if (report.getAttendance() == null || report.getAttendance().isEmpty())
				continue;

			for (StudentAttendance att : report.getAttendance()) {
				if (att.getStudentId().equals(studentId)) {
					totalSessions++;
					if (Boolean.TRUE.equals(att.getPresent())) {
						attendedSessions++;
					}
				}
			}
		}
		double percentage = 0.0;
		if (totalSessions > 0) {
			percentage = ((double) attendedSessions / totalSessions) * 100;
			percentage = Math.round(percentage * 100.0) / 100.0;
		}

		return new StudentAttendanceDT(studentId, totalSessions, attendedSessions, percentage);
	}

	public ResponseEntity<ResponseStructure<List<TrainerSessionSummaryDto>>> getTrainerSessionSummary(Long trainerId) {

		List<SessionReport> reports = sessionrepo.findByTrainerid(trainerId);

		ResponseStructure<List<TrainerSessionSummaryDto>> structure = new ResponseStructure<>();

		if (reports != null && !reports.isEmpty()) {

			List<TrainerSessionSummaryDto> dtoList = reports.stream().map(report -> {
				TrainerSessionSummaryDto dto = new TrainerSessionSummaryDto();
				dto.setCreatedDate(report.getCreatedDate());
				dto.setBatchno(report.getBatchno());
				dto.setMetadata(report.getMetadata());
				dto.setCoursename(report.getCoursename());

				return dto;
			}).toList();

			structure.setMessage("Session found");
			structure.setStatus(HttpStatus.OK.value());
			structure.setData(dtoList);

			return new ResponseEntity<>(structure, HttpStatus.OK);
		}

		structure.setData(new ArrayList<>());
		structure.setMessage("No session found");
		structure.setStatus(HttpStatus.OK.value());

		return new ResponseEntity<>(structure, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<SessionReportRecordingDto>>> recordSession(Long trainerId) {

		List<SessionReport> reports = sessionrepo.findByTrainerid(trainerId);

		ResponseStructure<List<SessionReportRecordingDto>> structure = new ResponseStructure<>();
		List<SessionReportRecordingDto> dtoList = new ArrayList<>();

		if (reports != null && !reports.isEmpty()) {

			for (SessionReport report : reports) {

				SessionReportRecordingDto dto = new SessionReportRecordingDto();

				dto.setBatchid(report.getBatchid());
				dto.setMetadata(report.getMetadata());
				dto.setCoursename(report.getCoursename());
				dto.setCourseid(report.getCourseid());
				dto.setModulename(report.getModulename());
				dto.setSessionno(report.getSessionno());
				dto.setSessionreportid(report.getSessionreportid());
				dto.setBatchno(report.getBatchno());
				dto.setModuleno(report.getModuleno());
				dto.setStatus(report.isStatus());
				boolean isRecorded = recordingrepo.existsBySessionreportid(report.getSessionreportid());
				System.err.println(isRecorded);
				dto.setRecorded(isRecorded); // true if r

				dtoList.add(dto);
			}

			structure.setMessage("Session found");
			structure.setStatus(HttpStatus.OK.value());
			structure.setData(dtoList);

			return ResponseEntity.ok(structure);
		}

		structure.setMessage("No session found");
		structure.setStatus(HttpStatus.OK.value());
		structure.setData(new ArrayList<>());

		return ResponseEntity.ok(structure);
	}

	public int calculateCompletionPercentage(int completedModules, int totalModules) {
		if (totalModules == 0)
			return 0;
		return (completedModules * 100) / totalModules;
	}

	private final ObjectMapper mapper = new ObjectMapper();

	public List<CourseSummaryDto> getAllModuleSummary() {
		List<SessionReport> reports = sessionrepo.findAll();
		if (reports.isEmpty())
			return new ArrayList<>();

		// Group by courseId + batchId
		Map<String, List<SessionReport>> grouped = reports.stream()
				.collect(Collectors.groupingBy(r -> r.getCourseid() + "_" + r.getBatchid()));

		List<CourseSummaryDto> result = new ArrayList<>();

		for (Map.Entry<String, List<SessionReport>> entry : grouped.entrySet()) {
			List<SessionReport> groupReports = entry.getValue();
			SessionReport first = groupReports.get(0);

			long courseId = first.getCourseid();
			long batchId = first.getBatchid();

			Optional<Batch> batchOpt = batchrepo.findBybatchid(batchId);

			if (batchOpt.isEmpty())
				continue;

			Batch batch = batchOpt.get();
			long trainerId = batch.getPrimarytrainerid();
			String trainername = batch.getPrimarytrainer();

			// Get modules from batch
			List<BatchModulesDto> rawModules = batch.getModules();

			if (rawModules == null || rawModules.isEmpty())
				continue;

			List<BatchModulesDto> modules = mapper.convertValue(rawModules, new TypeReference<List<BatchModulesDto>>() {
			});

			// Count completed sessions per module
			//  moduleno, Value: Set of completed session numbers
			Map<String, Set<String>> moduleSessionMap = new HashMap<>();

			for (SessionReport r : groupReports) {
				String moduleNo = r.getModuleno();
				String sessionNo = r.getSessionno();

				moduleSessionMap.computeIfAbsent(moduleNo, k -> new HashSet<>()).add(sessionNo);
			}

			CourseSummaryDto courseDto = new CourseSummaryDto();
			courseDto.setCourseId(courseId);
			courseDto.setBatchId(batchId);
			courseDto.setCourseName(first.getCoursename());
			courseDto.setBatchNo(first.getBatchno());
			courseDto.setTrainerName(trainername);

			List<ModuleSummaryDto> moduleList = new ArrayList<>();

			int completedModules = 0;
			int pendingModules = 0;
			int inProgressModules = 0;

			for (BatchModulesDto module : modules) {
				String moduleNo = String.valueOf(module.getModuleNo());

				int totalSessions = module.getSessions() != null ? module.getSessions().size() : 0;
				int completedSessions = moduleSessionMap.getOrDefault(moduleNo, new HashSet<>()).size();

				ModuleSummaryDto mDto = new ModuleSummaryDto();
				mDto.setModuleId(moduleNo);
				mDto.setModuleName(module.getModuleName());
				mDto.setTotalSessions(totalSessions);
				mDto.setCompletedSessions(completedSessions);

				if (completedSessions == totalSessions && totalSessions > 0) {
					mDto.setModuleStatus("COMPLETED");
					completedModules++;
				} else if (completedSessions == 0) {
					mDto.setModuleStatus("PENDING");
					pendingModules++;
				} else {
					mDto.setModuleStatus("IN_PROGRESS");
					inProgressModules++;
				}

				moduleList.add(mDto);
			}

			courseDto.setTotalModules(modules.size());
			courseDto.setModulesCompleted(completedModules);
			courseDto.setModulesPending(pendingModules);
			courseDto.setModulesInProgress(inProgressModules);

			int percent = calculateCompletionPercentage(completedModules, modules.size());
			courseDto.setCourseCompletionPercentage(percent);

			// Optional set the module list if needed
			// courseDtosetModules(moduleList);

			result.add(courseDto);
		}

		return result;
	}

	public ResponseEntity<ResponseStructure<List<CourseSummaryDto>>> getAllModuleSummaryResponse() {
		List<CourseSummaryDto> result = getAllModuleSummary();

		ResponseStructure<List<CourseSummaryDto>> structure = new ResponseStructure<>();
		if (result != null && !result.isEmpty()) {
			structure.setMessage("Course summary found");
			structure.setStatus(HttpStatus.OK.value());
			structure.setData(result);
			return new ResponseEntity<>(structure, HttpStatus.OK);
		} else {
			structure.setMessage("No course summary found");
			structure.setStatus(HttpStatus.OK.value());
			structure.setData(new ArrayList<>());
			return new ResponseEntity<>(structure, HttpStatus.OK);
		}
	}

	public AllAttendanceResponseDto getAllAttendance() {

	    List<SessionReport> reports = sessionrepo.findAll();
	    log.info("Total session reports: " + reports.size());

	    AllAttendanceResponseDto response = new AllAttendanceResponseDto();

	    if (reports == null || reports.isEmpty()) {
	        log.warn("No session reports found");
	        response.setBatches(Collections.emptyList());
	        return response;
	    }

	    Set<String> certifiedSet = certirepo.findAll().stream()
	            .filter(c -> "issued".equals(c.getCertificateStatus()))
	            .map(c -> c.getCourseid() + "_" + c.getUserid())
	            .collect(Collectors.toSet());
 
	    Set<String> rejectedSet = certirepo.findAll().stream()
	            .filter(c -> "rejected".equals(c.getCertificateStatus()))
	            .map(c -> c.getCourseid() + "_" + c.getUserid())
	            .collect(Collectors.toSet());
	    
	    log.info("Total certified students: " + certifiedSet.size());

	    Map<String, List<SessionReport>> groupedMap = reports.stream()
	            .collect(Collectors.groupingBy(r -> r.getCourseid() + "_" + r.getBatchid()));

	    log.info("Total batches: " + groupedMap.size());

	    List<BatchAttendanceDto> batchResults = new ArrayList<>();
	    
	    for (Map.Entry<String, List<SessionReport>> entry : groupedMap.entrySet()) {
	        
	        List<SessionReport> batchReports = entry.getValue();
	        SessionReport first = batchReports.get(0);

	        long courseId = first.getCourseid();
	        long batchId = first.getBatchid();
	        String batchNo = first.getBatchno();
	        String courseName = first.getCoursename();

	        log.info("Processing batch: " + batchNo + " (Course: " + courseName + ")");

	        int totalSessions = batchReports.size();

	        Map<Long, StudentAttendanceDto> studentMap = new HashMap<>();
	        
	        for (SessionReport report : batchReports) {
	            if (report.getAttendance() == null) continue;

	            for (StudentAttendance att : report.getAttendance()) {

	                StudentAttendanceDto dto = studentMap.computeIfAbsent(att.getStudentId(), id -> {
	                    StudentAttendanceDto s = new StudentAttendanceDto();
	                    s.setStudentId(att.getStudentId());
	                    
	                
	                    
	                    User user = userRepository.findByUserid(att.getStudentId());

	        	        if (user != null) {
	        	        	 s.setName(user.getFirstname());
	        	        } else {
	        	        	s.setName(null);
	        	        }
	                    s.setAttendedSessions(0);
	                    s.setCourseId(courseId);
	                    s.setBatchId(batchId);
	                    return s;
	                });

	                if (Boolean.TRUE.equals(att.getPresent())) {
	                    dto.setAttendedSessions(dto.getAttendedSessions() + 1);
	                }
	            }
	        }

	        log.info("Total students in batch: " + studentMap.size());

	        // Calculate attendance and mark if already certified
	        for (StudentAttendanceDto dto : studentMap.values()) {
	            double percentage = calculateCustomAttendance(dto.getAttendedSessions(), totalSessions);
	            dto.setAttendancePercentage(Math.round(percentage * 100.0) / 100.0);
	            dto.setCertificateEligible(percentage >= 75);
	            
	            boolean isCertified = certifiedSet.contains(dto.getCourseId() + "_" + dto.getStudentId());
	            boolean isRejected = rejectedSet.contains(dto.getCourseId() + "_" + dto.getStudentId());
 
	           
	            dto.setAlreadyCertified(isCertified && !isRejected);
	            dto.setAlreadyRejected(isRejected);
	        }

	        
	        List<StudentAttendanceDto> allStudents = new ArrayList<>(studentMap.values());

	        if (allStudents.isEmpty()) {
	            log.warn("No students found in batch " + batchNo);
	            continue;
	        }

	        log.info("Total students to display: " + allStudents.size());

	        Batch batchInfo = batchrepo.findBybatchi(batchId);

	        BatchAttendanceDto batchDto = new BatchAttendanceDto();
	        batchDto.setCourseId(courseId);
	        batchDto.setBatchId(batchId);
	        batchDto.setBatchNo(batchNo);
	        batchDto.setCoursename(courseName);
	        batchDto.setTotalSessions(totalSessions);
	        batchDto.setTrainername(batchInfo != null ? batchInfo.getPrimarytrainer() : "N/A");
	        batchDto.setTrainerid(batchInfo != null ? batchInfo.getPrimarytrainerid() : 0L);
	        batchDto.setStudents(allStudents);

	        batchResults.add(batchDto);
	    }

	    log.info("Total batches with students: " + batchResults.size());
	    response.setBatches(batchResults);
	    return response;
	}
	public List<UserSessionDTO> getSessionReportsByUserId(Long userId) {

		List<SessionReport> sessions = sessionrepo.findByStudentId(userId);
		List<UserSessionDTO> response = new ArrayList<>();

		for (SessionReport session : sessions) {

			List<StudentAttendance> userAttendance = session.getAttendance().stream()
					.filter(a -> a.getStudentId() != null && a.getStudentId().equals(userId))
					.collect(Collectors.toList());

			UserSessionDTO dto = new UserSessionDTO();
			dto.setTrainername(session.getTrainername());
			dto.setCreatedDate(session.getCreatedDate());
			dto.setCoursename(session.getCoursename());

			dto.setAttendance(userAttendance);
			dto.setMetadata(session.getMetadata());

			response.add(dto);
		}

		return response;
	}

  

	public ResponseStructure<CourseModuleSessionDto> getCourseModulesAndSessions(Long courseId) {

		ResponseStructure<CourseModuleSessionDto> response = new ResponseStructure<>();

		// Get all session reports for this course
		List<SessionReport> reports = sessionrepo.findByCourseId(courseId);

		if (reports == null || reports.isEmpty()) {
			response.setStatus(404);
			response.setMessage("No sessions found for this course");
			response.setData(null);
			return response;
		}

		// Get course name from first report
		String courseName = reports.get(0).getCoursename();

		// Group by module number
		Map<String, List<SessionReport>> moduleMap = reports.stream()
				.collect(Collectors.groupingBy(SessionReport::getModuleno));

		List<ModuleDetailDto> moduleList = new ArrayList<>();
		int totalSessions = 0;

		// Process each module
		for (Map.Entry<String, List<SessionReport>> entry : moduleMap.entrySet()) {
			String moduleNo = entry.getKey();
			List<SessionReport> moduleSessions = entry.getValue();

			if (moduleSessions.isEmpty())
				continue;

			String moduleName = moduleSessions.get(0).getModulename();

			// Get unique sessions (based on batchId + sessionNo combination)
			Map<String, SessionReport> uniqueSessions = new HashMap<>();
			for (SessionReport sr : moduleSessions) {
				String sessionKey = sr.getBatchid() + "_" + sr.getSessionno();
				uniqueSessions.putIfAbsent(sessionKey, sr);
			}

			List<SessionDetailDto> sessionDetails = new ArrayList<>();

			for (SessionReport session : uniqueSessions.values()) {
				SessionDetailDto sessionDto = new SessionDetailDto();
				sessionDto.setSessionReportId(session.getSessionreportid());
				sessionDto.setSessionNo(session.getSessionno());
//	                sessionDto.setMetadata(session.getMetadata());

				sessionDetails.add(sessionDto);
			}

			// Sort sessions by session number
			sessionDetails.sort(Comparator.comparing(s -> Integer.parseInt(s.getSessionNo())));

			ModuleDetailDto moduleDto = new ModuleDetailDto();
			moduleDto.setModuleNo(moduleNo);
			moduleDto.setModuleName(moduleName);
			moduleDto.setTotalSessions(uniqueSessions.size());
			moduleDto.setCompletedSessions(uniqueSessions.size());
			moduleDto.setSessions(sessionDetails);

			moduleList.add(moduleDto);
			totalSessions += uniqueSessions.size();
		}

		// Sort modules by module number
		moduleList.sort(Comparator.comparing(m -> Integer.parseInt(m.getModuleNo())));

		CourseModuleSessionDto courseDto = new CourseModuleSessionDto();
		courseDto.setCourseId(courseId);
		courseDto.setCourseName(courseName);
		courseDto.setTotalModules(moduleList.size());
		courseDto.setTotalSessions(totalSessions);
		courseDto.setModules(moduleList);

		response.setStatus(200);
		response.setMessage("Course modules and sessions fetched successfully");
		response.setData(courseDto);

		return response;
	}
	
	
	public ResponseEntity<ResponseStructure<SessionRecordingVideoDto>> findSessionRecording(long sessionReportId) {

	    Optional<SessionReport> sessionOpt = sessionrepo.findBySessionreportid(sessionReportId);
	    
	    if (sessionOpt.isEmpty()) {
	        throw new IdNotFoundException("Session report id not found");
	    }
	    
	    SessionReport session = sessionOpt.get();
	    RecordingSessions recordingVideo = recordingrepo.findBySessionreportid(sessionReportId);

	    SessionRecordingVideoDto dto = new SessionRecordingVideoDto();
	    dto.setSessionReportId(session.getSessionreportid());
	    dto.setSessionNo(session.getSessionno());
	    dto.setUploadedby(session.getTrainername());
	    dto.setUploadeddate(session.getCreatedDate());
	    dto.setDocumentsMetadata(session.getMetadata());
	   
	    if (recordingVideo != null) {
	        dto.setRecordingMetadata(recordingVideo.getMetadata());
	    } else {
	        dto.setRecordingMetadata(new ArrayList<>());
	    }

	    ResponseStructure<SessionRecordingVideoDto> responseStructure = new ResponseStructure<>();
	    responseStructure.setData(dto);
	    responseStructure.setMessage("Session recording and documents found");
	    responseStructure.setStatus(HttpStatus.OK.value());
	    
	    return new ResponseEntity<>(responseStructure, HttpStatus.OK);
	}

}
