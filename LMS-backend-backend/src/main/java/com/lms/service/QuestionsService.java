package com.lms.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.lms.config.ResponseStructure;
import com.lms.dao.QuestionsDao;
import com.lms.dto.QuestionDto;
import com.lms.entity.Questions;
import com.lms.exceptions.UserAlreadyExistsException;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class QuestionsService {
	
	@Autowired
	QuestionsDao questions;
	
	@Autowired
	QuestionDto Questiondto;
	
	public ResponseEntity<ResponseStructure<List<Questions>>> saveuser(List<Questions> question) {
		List<Questions> quizz = questions.savequestions(question);
		if (quizz!= null) {
	         log.info("data"+quizz);
	         ResponseStructure<List<Questions>>responseStructure= new ResponseStructure<>();
			responseStructure.setMessage("Questions created successfully");
			responseStructure.setStatus(HttpStatus.CREATED.value());
			responseStructure.setData(quizz);
			
			return new ResponseEntity<ResponseStructure<List<Questions>>>(responseStructure, HttpStatus.OK);
		} else {
			throw new UserAlreadyExistsException("question can not be empty");
		}
	}
	

	
    public ResponseEntity<ResponseStructure<List<Questions>>>  getallquestions()
    {
    	List<Questions> users = questions.getallQuestions();
		if (users != null && !users.isEmpty()) {
			ResponseStructure<List<Questions>> structure = new ResponseStructure<>();
			structure.setMessage("Questions found");
			structure.setStatus(HttpStatus.OK.value());
			structure.setData(users);
			return new ResponseEntity<ResponseStructure<List<Questions>>>(structure, HttpStatus.OK);
		}
		ResponseStructure<List<Questions>> structure = new ResponseStructure<>();
		structure.setData(new ArrayList<>());
		structure.setMessage("No Questions found");
		structure.setStatus(HttpStatus.OK.value());
		return new ResponseEntity<ResponseStructure<List<Questions>>>(structure, HttpStatus.OK);
    }
	

}
