package com.lms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import com.lms.dto.StudentListDto;
import com.lms.entity.UserPurchasedCourse;

public interface PurchasedCourseRepository extends MongoRepository<UserPurchasedCourse, String>{
	
	
	@Query(value = "{ 'purchaseid' : ?0 }")
	UserPurchasedCourse findByPurchaseid(long purchaseid);
	
	
	@Query(value = "{ 'userid' : ?0 }", exists = true)
	boolean existsByUserid(long userid);
	
	 
	 UserPurchasedCourse findByUseridAndCourseid(long userid, long courseid);
	 
	    @Query(value = "{ 'userid': ?0, 'courseid': ?1 }")
	    @Update("{ '$set': { 'complete': true, 'status': 'Completed' } }")
	    void markCourseCompleted(long userid, long courseid);
	    List<UserPurchasedCourse> findByUserid(long userid);
	    UserPurchasedCourse findByUseridAndBatchid(long userid, long batchid);
	    List<UserPurchasedCourse> findByUseridAndCompleteFalse(long userid);
	    List<UserPurchasedCourse> findByUseridAndBatchidAndCompleteFalse(long userid, long batchid);
	    List<UserPurchasedCourse> findByUseridAndCompleteTrue(long userid);
	    List<UserPurchasedCourse> findByCourseidAndCompleteFalse(long courseId);
	    List<UserPurchasedCourse> findByCourseidAndCompleteTrue(long courseId);
	    List<UserPurchasedCourse> findByUseridIn(List<Long> userIds);
	    long countByBatchidIn(List<Long> batchIds);
	    boolean existsByUseridAndBatchid(Long userid, Long batchid);
	    
	    @Aggregation(pipeline = {
	    	    "{ $match: { batchid: ?0 } }",
	    	    "{ $lookup: { from: 'Batch', localField: 'batchid', foreignField: 'Batch_id', as: 'batchDetails' } }",
	    	    "{ $unwind: '$batchDetails' }",
	    	    "{ $project: { " +
	    	            "studentName: '$username', " +
	    	            "enrollmentDate: '$EnrollDate', " +
	    	            "assignedDate: '$batchDetails.assignedDate', " +
	    	            "courseName: '$coursename', " +
	    	            "batchNo: '$batchDetails.batch_no' " +
	    	    "} }"
	    	})
	    	List<StudentListDto> findStudentsByBatchId(Long batchId);
	    long countByBatchidAndStatus(long batchid, boolean status);
	    long countByBatchid(long batched);



   

}
