package com.lms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.config.ResponseStructure;
import com.lms.entity.Questions;
import com.lms.service.QuestionsService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/question")
@Slf4j
public class QuestionController {
	
	@Autowired
    QuestionsService service;
	
	@PostMapping("/add")
	public ResponseEntity<ResponseStructure<List<Questions>>> savequestions(@RequestBody List<Questions> question)
	{
		return service.saveuser(question);
	}
	
	@GetMapping("/getallquestion")
	public ResponseEntity<ResponseStructure<List<Questions>>> getllquestions()
	{
		return service.getallquestions();
	}

}
