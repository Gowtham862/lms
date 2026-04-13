package com.lms.repository;


import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import org.springframework.stereotype.Repository;

import com.lms.entity.AddCourse;
import com.lms.entity.status;

@Repository
public interface AddCourseRepository extends MongoRepository<AddCourse, String> {

	@Query(value = "{ 'course_id' : ?0 }", exists = true)
	boolean existsBycourseid(long courseid);

	@Query(value = "{ 'course_id' : ?0 }")
	Optional<AddCourse> findByCourseId(long courseid);

	@Query(value = "{ 'course_id' : ?0 }")
	AddCourse findByCourseI(long courseid);

    List<AddCourse> findByCourseidIn(List<Long> courseIds);

	List<AddCourse> findByStatus(String status);
	
	 AddCourse findByCourseid(long courseid);


	long count();
	   long countByStatus(String status);

//	boolean existsByUserid(long userid);

	   @Aggregation(pipeline = {
			    "{ $match: { course_id: ?0 } }",
			    "{ $unwind: '$Modules' }",
			    "{ $unwind: '$Modules.sessions' }",
			    "{ $group: { _id: null, totalSessions: { $sum: 1 } } }"
			})
			Map<String, Integer> getTotalSessions(long courseId);

	   List<AddCourse> findByCourseidInAndStatus(List<Long> courseIds, status status);





}
