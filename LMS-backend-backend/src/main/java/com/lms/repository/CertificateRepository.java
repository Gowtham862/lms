package com.lms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.lms.entity.Certificate;

@Repository
public interface CertificateRepository extends MongoRepository<Certificate, String>{
	
	
//	List<Certificate> findByuserid(String userid);
	@Query(value = "{ 'userid' : ?0 }")
	Certificate findByUserid(long userId);
	
	 @Query("{ 'certificateid' : ?0 }")
	   Certificate findByCertificateId(long certificateId);
	    long count();
	 
//	 Optional<Certificate> findByUseridAndCourseid(Long userid, Long courseid);
	   Optional<Certificate> findByUseridAndCourseid(long userid, long courseid);
	    boolean existsByCourseidAndUserid(long courseid, long userid);
	 
	    long countByCertificateStatus(String certificateStatus);
	 

}
