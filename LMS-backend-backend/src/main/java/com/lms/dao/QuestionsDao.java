package com.lms.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.lms.entity.Questions;
import com.lms.repository.QuestionRepository;
@Component
public class QuestionsDao {
	@Autowired
	QuestionRepository question;
	
	public List<Questions> savequestions(List<Questions> questions)
	{
		
		if(questions!=null)
		{
			return question.saveAll(questions);
		}
		return null;
		
		
	}
	
	public List<Questions> getallQuestions()
	{
		return question.findAll();
		
	}

}
