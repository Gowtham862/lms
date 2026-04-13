package com.lms.dto;

import org.springframework.stereotype.Component;

@Component
public class EmailDto {
	

	public EmailDto() {
		super();
	}
	public EmailDto(String to, String fullname, String email, String password) {
		super();
		this.to = to;
		this.fullname = fullname;
		this.email = email;
		this.password = password;
	}
	public String getTo() {
		return to;
	}
	public void setTo(String to) {
		this.to = to;
	}
	public String getFullname() {
		return fullname;
	}
	public void setFullname(String fullname) {
		this.fullname = fullname;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	private String to;
	private String fullname;
	private String email;
	private String password;

}
