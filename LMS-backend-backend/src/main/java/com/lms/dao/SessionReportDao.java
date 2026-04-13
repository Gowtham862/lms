package com.lms.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import com.lms.entity.SessionReport;
import com.lms.repository.SessionReportRepository;

@Component
public class SessionReportDao {
	
	@Autowired
	SessionReportRepository sessionrepo;
	
	public SessionReport addsessionreport(SessionReport report) {
	  report.setSessionreportid(System.currentTimeMillis());
	  report.setStatus(true);
	return sessionrepo.save(report);

}

}
