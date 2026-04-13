package com.lms.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Document(collection = "PasswordResetToken")
@Data
public class PasswordResetToken {
	 @Id
	private String id;
	@Field(name = "EMAIL")
	private String email;
	@Field(name = "USED")
	private boolean used;
	@Field(name = "TOKEN")
	private String token;
	@Field(name = "EXPIRY_DATE_TIME")
	 private LocalDateTime ExpiryDateTime;
	
	

}
