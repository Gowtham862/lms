package com.lms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.lms.dto.TrainerSummaryDto;
import com.lms.entity.Batch;

@Repository
public interface BatchRepository extends MongoRepository<Batch, String> {

	@Query(value = "{ 'course_id' : ?0 }")
	List<Batch> findByCourseId(long courseid);

	@Query(value = "{ 'Batch_id' : ?0 }")
	Optional<Batch> findBybatchid(long Batch_id);

	@Query(value = "{ 'Batch_id' : ?0 }")
	Batch findBybatchi(long Batch_id);
	@Query(value = "{ 'primarytrainerid': ?0 }")
    List<Batch> findByPrimarytrainerid(long primaryTrainerId);

	void deleteByCourseid(long courseid);

	@Query(value = "{ 'courseid': ?0, 'batchno': ?1 }", exists = true)
	boolean existsByCourseidAndBatchno(long courseid, int batchno);

	List<Batch> findByPrimarytrainerid(Long trainerId);

	List<Batch> findByStatus(String status);

	long count();

	long countByStatus(String status);

	List<Batch> findByPrimarytraineridAndStatus(Long primarytrainerid, String status);

	@Aggregation(pipeline = {
			"{ $group: { " + "   _id: { trainerId: '$primarytrainerid', trainerName: '$primarytrainer' }, "
					+ "   totalBatches: { $sum: 1 }, " + "   uniqueCourses: { $addToSet: '$course_id' } " + "} }",

			"{ $lookup: { " + "   from: 'session_reports', " + "   localField: '_id.trainerId', "
					+ "   foreignField: 'trainerid', " + "   as: 'sessions' " + "} }",
			"{ $project: { " + "   _id: 0, " + "   trainerId: '$_id.trainerId', "
					+ "   trainerName: '$_id.trainerName', " + "   totalBatches: 1, "
					+ "   totalCourses: { $size: '$uniqueCourses' }, " + "   totalSessions: { $size: '$sessions' } "
					+ "} }" })

	List<TrainerSummaryDto> getTrainerSummary();

	long countByPrimarytraineridNot(long trainerId);
	
	 List<Batch> findByCourseid(long courseid);
}
