package com.lms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.lms.entity.AddTrainer;;

@Repository
public interface AddTrainerRepository extends MongoRepository<AddTrainer, String> {

	@Query(value = "{ 'trainerid' : ?0 }", exists = true)
	boolean existsByTrainerid(long trainerid);


	@Query(value = "{ 'loginemail' : ?0 }", exists = true)
	boolean existsByLoginemail(String loginemail);

	@Query("{ 'loginemail': ?0, 'trainerstatus': 'Active' }")
	AddTrainer findActiveByLoginEmail(String email);

	long count();

	long countByTrainerstatus(String trainerstatus);

//	Optional<AddTrainer> findByTrainerid(String trainerid);
	@Query("{'trainerid' : ?0}")
	Optional<AddTrainer> findByTrainerid(long trainerid);
}
