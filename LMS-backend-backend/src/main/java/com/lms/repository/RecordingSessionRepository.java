package com.lms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.lms.entity.RecordingSessions;
@Repository
public interface RecordingSessionRepository extends MongoRepository<RecordingSessions, String>{
	
	 List<RecordingSessions> findByCourseidIn(List<Long> courseIds);
	 
//	 RecordingSessions findByRecordingsessionid(long recordingsessionid);
	  RecordingSessions findBySessionreportid(long sessionreportid);
	  boolean existsBySessionreportid(Long sessionreportid);
	  Optional<RecordingSessions> findBySessionreportid(Long sessionreportid);
	  List<RecordingSessions> findByCourseidInAndBatchidIn(List<Long> courseIds,List<Long> batchIds
		);


	  
}
