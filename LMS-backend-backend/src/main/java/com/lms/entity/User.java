package com.lms.entity;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.data.annotation.CreatedDate;


@Document(collection = "User")

public class User {

	@Id
	private String id;

	@Field("user_id")
   private long userid;
	@NotBlank(message = "firstname is required")
	private String firstname;
	private Role role;
	private String lastname;
	@NotBlank(message = "Password is required")
	private String password;
	@Email(message = "Email is required")
	@NotBlank(message = "Email is required")
	private String email;
//	@NotNull(message = "Phone is required")
//	private long phone;
	@NotNull(message = "Phone is required")
	@Min(value= 6000000000l, message = " phone number must be valid" )
	@Max(value= 9999999999l, message = " phone number must be valid" )
	private long phone;
//	@NotBlank(message = "status is required")
	private String status;
	@CreatedDate
	private Instant CreatedDate;
	public String getId() {
		return id;
	}

	
	public long getPhone() {
		return phone;
	}
	public void setPhone(long phone) {
		this.phone = phone;
	}
	public Instant getCreatedDate() {
		return CreatedDate;
	}
	public void setCreatedDate(Instant createdDate) {
		CreatedDate = createdDate;
	}

	public void setId(String id) {
		this.id = id;
	}
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getStatus() {
		return status;
	}
	@Override
	public String toString() {
		return "User [id=" + id + ", firstname=" + firstname + ", role=" + role + ", lastname=" + lastname
				+ ", password=" + password + ", email=" + email + ", companyId=" + phone + ", status=" + status
				+ "]";
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public User(String id, String firstname, Role role, String lastname, String password, String email,
			long phone, String status) {
		super();
		this.id = id;
		this.firstname = firstname;
		this.role = role;
		this.lastname = lastname;
		this.password = password;
		this.email = email;
		this.phone = phone;
		this.status = status;
	}


	public long getUserid() {
		return userid;
	}


	public void setUserid(long userid) {
		this.userid = userid;
	}




}