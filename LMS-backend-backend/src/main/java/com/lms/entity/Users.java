package com.lms.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;

@Document(collection = "users")
public class Users {

	@Id
	private String id;
	private String firstname;
	private String role;	
	private String lastname;
	private String Password;
	@Override
	public String toString() {
		return "Users [id=" + id + ", firstname=" + firstname + ", role=" + role + ", lastname=" + lastname
				+ ", Password=" + Password + ", email=" + email + ", CompanyId=" + CompanyId + ", status=" + status
				+ "]";
	}
	public String getId() {
		return id;
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
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getPassword() {
		return Password;
	}
	public void setPassword(String password) {
		Password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCompanyId() {
		return CompanyId;
	}
	public void setCompanyId(String companyId) {
		CompanyId = companyId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	@Email(message = "Email is required")
	private String email;
	private String CompanyId;
	private String status;
     

}

