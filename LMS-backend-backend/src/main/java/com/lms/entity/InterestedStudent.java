package com.lms.entity;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;

@Document(collection = "Interested_Student")
@Data
public class InterestedStudent {
	@Id
	private String id;
	private long interstedid;
	@Field("courseid")
//    @NotBlank(message = "courseid is required")
	private long courseid;
	@Field("userid")
//	@NotBlank(message = "userid is required")
	private long userid;
	@Field("batchid")
//	@NotBlank(message = "batchid is required")
	private long batchid;
	@Field("status")
	private String status;
	@Field("username")
//	@NotBlank(message = "username is required")
	private String username;
	@Field("useremail")
//	@NotBlank(message = "useremail is required")
	private String useremail;
	@Field("coursename")
//	@NotBlank(message = "coursename is required")
	private String coursename;
	@Field("batchstartdate")
//	@NotBlank(message = "batchstartdate is required")
	private String batchstartdate;
	@Field("batchno")
//	@NotBlank(message = "batchno is required")
	private int batchno;
	@Field("complete")
	private boolean complete;
	@Field("currentstatus")
	private String currentstatus;
	@Field("nextstatus")
	private String nextstatus;
	@Field("usercontact")
	@NotBlank(message = "usercontact is required")
	private String usercontact;
	@CreatedDate
	@Field("EnrollDate")
	private Instant enrollDate;

}
