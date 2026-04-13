package com.lms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;


import com.lms.entity.InterestedStudent;
import com.lms.entity.User;

@Repository
public interface InterestedStudentRepository extends MongoRepository<InterestedStudent, String> {

	boolean existsByUseridAndBatchidAndCourseid(long userid, long batchid, long courseid);

	@Query(value = "{'interstedid' : ?0 }")
	Optional<InterestedStudent> findByinterstedid(long interstedid);
	
	boolean existsByUseridAndCurrentstatus(
	       
	        Long userid,
	    
	        String currentstatus
	);
	long countByCurrentstatus(String currentstatus);
	
	@Query("{}")
    List<InterestedStudent> findAllInterestedStudent(Pageable page);

}
