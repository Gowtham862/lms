package com.lms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


import com.lms.entity.SessionReport;

public interface SessionReportRepository extends MongoRepository<SessionReport, String> {
	
	     @Query("{ 'attendance.studentId': ?0 }")
	    List<SessionReport> findByStudentId(Long studentId);
	     List<SessionReport> findByBatchidIn(List<Long> batchIds);
	     List<SessionReport> findByTrainerid(Long trainerid);
         long count();
         List<SessionReport> findByCourseidAndBatchid(long courseid, long batchid);
         long countByBatchidAndStatus(long batchid, boolean status);
         List<SessionReport> findByBatchid(long batchid);
         List<SessionReport> findByBatchidAndStatus(long batchid, boolean status);
         long countByBatchidAndTraineridAndStatus(long batchid, long trainerid, boolean status);
         long countByBatchidAndModulenameAndStatus(long batchid,String modulename,boolean status);
         List<SessionReport> findByBatchidAndModulename( long batchid, String modulename);
         // Find completed session reports by trainer ID
         List<SessionReport> findByTraineridAndStatusTrue(long trainerId);
         
         // Find all session reports by trainer ID
         List<SessionReport> findByTrainerid(long trainerId);
         
         @Query(value = "{ 'courseid' : ?0 }")
         List<SessionReport> findByCourseId(long courseid);
         
         // Find session reports by batch ID and status
         List<SessionReport> findByBatchidAndStatusTrue(long batchId);
         Optional<SessionReport> findBySessionreportid(long sessionreportid);
         

}
