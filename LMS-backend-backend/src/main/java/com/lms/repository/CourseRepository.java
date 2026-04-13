package com.lms.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.lms.entity.Courses;

@Repository
public interface CourseRepository extends MongoRepository<Courses, String> {

//	find the courses by userid
//	List<Courses> findByOwnerId(String ownerId);
	@Query("{ 'ownerId': ?0		 }")
	List<Courses> findInactiveByOwnerId(String ownerId);

	@Query("{ 'status' : 'active' }")
	List<Courses> findAllActiveCourses();

	@Query("{ 'status' : 'inactive' }")
	List<Courses> findAllinActiveCourses();

	List<Courses> findByOwnerId(String ownerId);
	
	

}
