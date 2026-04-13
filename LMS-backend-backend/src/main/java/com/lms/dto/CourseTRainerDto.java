package com.lms.dto;

import java.util.List;

import lombok.Data;

@Data
public class CourseTRainerDto {
	private CourseDto course;
    private List<BatchDto> batches;
}
