package com.lms.entity;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "coursedetails")
public class Courses {
	@Id
	private String id;
	private String courseId;
    private String ownerId;
    private String title;
    private String description;
    private List<String> skills;
    private String category;
    private String level;
    private String language;
    private int durationMinutes;
    private String durationISO8601;
    private List<String> tags;
    private String status;
    private String approvedBy;
    private Instant approvedAt;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private List<Map<String, Object>> metadata;
    public List<Map<String, Object>> getMetadata() {
		return metadata;
	}
	public void setMetadata(List<Map<String, Object>> metadata) {
		this.metadata = metadata;
	}

	private String updatedBy;
   
    @Field("_version")
    private int version;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCourseId() {
		return courseId;
	}
	public void setCourseId(String courseId) {
		this.courseId = courseId;
	}
	public String getOwnerId() {
		return ownerId;
	}
	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<String> getSkills() {
		return skills;
	}
	public void setSkills(List<String> skills) {
		this.skills = skills;
	}
	public String getCategory() {
		return category;
	}
	@Override
	public String toString() {
		return "Courses [id=" + id + ", courseId=" + courseId + ", ownerId=" + ownerId + ", title=" + title
				+ ", description=" + description + ", skills=" + skills + ", category=" + category + ", level=" + level
				+ ", language=" + language + ", durationMinutes=" + durationMinutes + ", durationISO8601="
				+ durationISO8601 + ", tags=" + tags + ", status=" + status + ", approvedBy=" + approvedBy
				+ ", approvedAt=" + approvedAt + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
				+ ", createdBy=" + createdBy + ", metadata=" + metadata + ", updatedBy=" + updatedBy + ", version="
				+ version + "]";
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public int getDurationMinutes() {
		return durationMinutes;
	}
	public void setDurationMinutes(int durationMinutes) {
		this.durationMinutes = durationMinutes;
	}
	public String getDurationISO8601() {
		return durationISO8601;
	}
	public void setDurationISO8601(String durationISO8601) {
		this.durationISO8601 = durationISO8601;
	}
	public List<String> getTags() {
		return tags;
	}
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getApprovedBy() {
		return approvedBy;
	}
	public void setApprovedBy(String approvedBy) {
		this.approvedBy = approvedBy;
	}
	public Instant getApprovedAt() {
		return approvedAt;
	}
	public void setApprovedAt(Instant approvedAt) {
		this.approvedAt = approvedAt;
	}
	public Instant getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}
	public Instant getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public String getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}
	public int getVersion() {
		return version;
	}
	
	public void setVersion(int version) {
		this.version = version;
	}

}
