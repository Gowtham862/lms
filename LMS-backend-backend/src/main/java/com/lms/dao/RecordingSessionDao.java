package com.lms.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.lms.entity.RecordingSessions;
import com.lms.repository.RecordingSessionRepository;

@Component
public class RecordingSessionDao {
	
	@Autowired
	RecordingSessionRepository recorrepo;
	
	
	public RecordingSessions saveRecordingsessions(RecordingSessions Sessions) {
		
		Sessions.setRecordingsessionid(System.currentTimeMillis());
		Sessions.setStatus(true);
		return recorrepo.save(Sessions);

	}
	  public RecordingSessions getBySessionId(long sessionId) {
	        return recorrepo.findBySessionreportid(sessionId);
	    }

}
