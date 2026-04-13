package com.lms.dto;

import java.util.List;

import com.lms.entity.status;

import lombok.Data;

@Data
public class UpdateCourseDto {
	private String language;
	private int rating;
	private String adminname;
	private String coursename;
	private String coursedesc;
	private status status;
	private String trainingmode;
	private String coursecategory;
	private String courselevel;
	private List<String> recommendedCourseIds;
    private Long price;
    private Long discount;
	private String certificateavalibility;
	private String noofmodule;
	private String moduleCount;
	private String courseduration;
	private List<ModulesDto> modules;

}
