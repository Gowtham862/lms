package com.lms.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


import com.lms.entity.SuperAdmin;

public interface SuperAdminRepository extends MongoRepository<SuperAdmin,Long> {

	boolean existsByAdminid(Long adminid);
	 
    
    
	@Query("{ 'loginemail': ?0, 'adminstatus': 'Active' }")
	SuperAdmin findActiveByLoginEmail(String email);
    long count();
    long countByadminstatus(String adminstatus);
    Optional<SuperAdmin> findByAdminid(Long adminid);
}
