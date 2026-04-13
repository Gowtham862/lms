package com.lms.dto;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

import com.lms.entity.Role;

import lombok.Data;

@Data
@Component
public class AddTrainerDto {
	
	private String adminid;
	private long trainerid;
	private String trainername;
	private String personalemailid;
	private String contactnumber;
	private String dateofbirth;
	private String address;
	private String state;
	private String  city;
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
	private Instant onboarddate;
	
	private AddTrainerDto primaryTrainerDetails;


}
