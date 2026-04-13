package com.lms.entity;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Document(collection = "Add_trainer")
@Data
public class AddTrainer {

	private String adminid;
	@Indexed(unique = true)

	private long trainerid;

	private String trainername;

	private String personalemailid;

	private String contactnumber;

	private String dateofbirth;

	private String address;

	private String state;

	private String city;

	private String loginemail;

	private String temporaraypassword;

	private String areoferperience;
	private String yearofexperience;
	private String qualification;
	private List<String> languageknown;
	private String attachresume;
	private String assignedcourse;
	private String assignedcourseid;
	private String courselevel;
	private String trainerstatus;
	private String abouttrainer;
	private List<Map<String, Object>> metadata;
	private Role role;
	private String Status;
	@CreatedDate
	@Field("EnrollDate")
	private Instant onboarddate;

}
