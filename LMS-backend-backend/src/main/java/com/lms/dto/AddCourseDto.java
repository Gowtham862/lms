package com.lms.dto;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.lms.entity.status;

import lombok.Data;

@Component
@Data
public class AddCourseDto {

	private String adminId;

	private long courseid;
	private String adminname;
	private String coursename;
	private String coursecategory;
	private String courselevel;
	private String certificateavalibility;
	private String noofmodule;
	private String courseduration;
	private status status;
	private int rating;
	private List<String> recommendedCourseIds;
    private long price;
    private long discount;
    private String primarytrainer;
	private String coursedesc;
	private List<ModulesDto> modules;
	private List<Map<String, Object>> metadata;
	private String moduleCount;
	private String language;
	private String trainingmode;

}
