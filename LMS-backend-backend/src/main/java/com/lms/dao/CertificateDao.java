package com.lms.dao;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.lms.entity.AddCourse;
import com.lms.entity.Certificate;
import com.lms.repository.CertificateRepository;

@Component
public class CertificateDao {
	
	@Autowired
	CertificateRepository certificaterepo;
	public Certificate newcertificate(Certificate  certi) {
		   certi.setCertificateid(System.currentTimeMillis());
		return certificaterepo.save(certi);

	}
	
//	public List<Certificate> findcertificatebyid(String id) {
//		return certificaterepo.findByuserid(id);
//
//	}
	

}
