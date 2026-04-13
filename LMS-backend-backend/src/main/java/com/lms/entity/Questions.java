package com.lms.entity;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "questions")
public class Questions {
	@Override
	public String toString() {
		return "Questions [id=" + id + ", question=" + question + ", answers=" + answers + ", descriptions="
				+ descriptions + "]";
	}
	public Questions(String id, String question, List<Map<String, Object>> answers, String descriptions) {
		super();
		this.id = id;
		this.question = question;
		this.answers = answers;
		this.descriptions = descriptions;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	public List<Map<String, Object>> getAnswers() {
		return answers;
	}
	public void setAnswers(List<Map<String, Object>> answers) {
		this.answers = answers;
	}
	public String getDescriptions() {
		return descriptions;
	}
	public void setDescriptions(String descriptions) {
		this.descriptions = descriptions;
	}
	@Id
    private String id;
    private String question;
    private String descriptions;
    private List<Map<String, Object>> answers;
  
	
}
