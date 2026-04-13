package com.lms.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "companies")
public class Companies {

	@Id
	private String companyId;

	private String companyName;

	private String industry;

	private status status;
	@CreatedDate
	private LocalDateTime createdAt;
	@LastModifiedDate
	private LocalDateTime updatedAt;

	public Companies(String companyId, String companyName, String industry, com.lms.entity.status status,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.companyId = companyId;
		this.companyName = companyName;
		this.industry = industry;
		this.status = status;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		
	}
	public String getCompanyId() {
		return companyId;
	}
	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getIndustry() {
		return industry;
	}
	public void setIndustry(String industry) {
		this.industry = industry;
	}
	public status getStatus() {
		return status;
	}
	public void setStatus(status status) {
		this.status = status;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	
	@Override
	public String toString() {
		return "Companies [companyId=" + companyId + ", companyName=" + companyName + ", industry=" + industry
				+ ", status=" + status + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + ", CreatedBy="
				 + "]";
	}

}
