package com.lms.dto;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;


import lombok.Data;

@Data
@Component
public class QuestionDto {
	
	   private String id;
	    private String question;
	    private String descriptions;
	    private List<Map<String, Object>> answers;

}
