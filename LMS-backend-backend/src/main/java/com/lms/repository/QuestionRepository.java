package com.lms.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.lms.entity.Questions;

@Repository
public interface QuestionRepository extends MongoRepository<Questions, String> {

}
