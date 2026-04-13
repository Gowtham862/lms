package com.lms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.lms.dto.AllAttendanceResponseDto;
import com.lms.dto.CourseModuleSessionDto;
import com.lms.dto.CourseSummaryDto;
import com.lms.dto.ModuleDateDto;
import com.lms.dto.SessionRecordingVideoDto;
import com.lms.dto.SessionReportRecordingDto;
import com.lms.dto.StudentAttendanceDT;
import com.lms.dto.TrainerSessionSummaryDto;
import com.lms.dto.UserSessionDTO;

import com.lms.entity.SessionReport;
import com.lms.service.SessionReportService;

import io.jsonwebtoken.io.IOException;

import lombok.extern.slf4j.Slf4j;



@RestController
@RequestMapping("/sessionreport")
@Slf4j
public class SessionReportController {
	
	@Autowired
	SessionReportService service;
	
	@PostMapping(value = "/uploa", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> savereport(@RequestPart("report") String report,
			@RequestPart("file") MultipartFile[] files)
			throws IOException, JsonMappingException, JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		SessionReport courses = mapper.readValue(report, SessionReport.class);
		System.err.println(courses +"hlo");
		return service.savessionreport(courses, files);
	}
	
//	     @GetMapping("/getall")
//	    public ResponseEntity<List<CourseProgressDto>> getAllDemo() {
//	        return ResponseEntity.ok(service.getAllProgressDemo());
//	    }
	
//	  @GetMapping("/getall")
//	    public ResponseEntity<ResponseStructure<List<CourseSummaryDto>>> getAll() {
//	        return service.getAllModuleSummaryResponse();
//	    }
	  
	 
	  
	  @GetMapping("/getAl")
	    public ResponseEntity<?> getAllAttendance() {
	        AllAttendanceResponseDto response = service.getAllAttendance();
	        return ResponseEntity.ok(response);
	    }
	   @GetMapping("/user/{userId}")
	    public ResponseEntity<List<UserSessionDTO>> getSessionsByUserId(@PathVariable Long userId) {
	        List<UserSessionDTO> sessions = service.getSessionReportsByUserId(userId);
	        if (sessions.isEmpty()) {
	            return ResponseEntity.noContent().build();
	        }
	        return ResponseEntity.ok(sessions);
	    }
	   @GetMapping("/trainer/{trainerId}")
	    public ResponseEntity<AllAttendanceResponseDto> getAttendanceByTrainer(   @PathVariable Long trainerId) {

	        AllAttendanceResponseDto response=service.getAllAttendanceByTrainer(trainerId);

	        return ResponseEntity.ok(response);
	    }
	   
	    @GetMapping("/student/{studentId}/overall")
	    public ResponseEntity<StudentAttendanceDT> getStudentOverallAttendance( @PathVariable long studentId) {

	    	StudentAttendanceDT response =service.getOverallAttendanceSummary(studentId);

	        return ResponseEntity.ok(response);
	    }
	    
	    @GetMapping("/sessions/{trainerId}")
	    public ResponseEntity<ResponseStructure<List<TrainerSessionSummaryDto>>> getTrainerSessionSummary(@PathVariable Long trainerId) {

	        return service.getTrainerSessionSummary(trainerId);
	    }
	    
	    @GetMapping("/trainer/recording/{trainerId}")
	    public ResponseEntity<ResponseStructure<List<SessionReportRecordingDto>>> 
	            recordSession(@PathVariable Long trainerId) {

	        return service.recordSession(trainerId);
	    }
	    @GetMapping("/getall")
	    public ResponseEntity<ResponseStructure<List<CourseSummaryDto>>> getAll() {
	        return service.getAllModuleSummaryResponse();
	    }
	    @GetMapping("/dates")
	    public ResponseEntity<ResponseStructure<List<ModuleDateDto>>> getSessionDates() {
	        ResponseStructure<List<ModuleDateDto>> response = service.getModuleDatesFromSessionReports();
	        return ResponseEntity.ok(response);
	    }
	    @GetMapping("/modulessessions/{courseId}")
	    public ResponseStructure<CourseModuleSessionDto> getCourseModulesAndSessions(
	            @PathVariable Long courseId) {
	       return service.getCourseModulesAndSessions(courseId);
	       
	    }
	    @GetMapping("/recording/{sessionReportId}")
	    public ResponseEntity<ResponseStructure<SessionRecordingVideoDto>> getSessionRecording(
	            @PathVariable long sessionReportId) {
	        return service.findSessionRecording(sessionReportId);
	    }
	
}
