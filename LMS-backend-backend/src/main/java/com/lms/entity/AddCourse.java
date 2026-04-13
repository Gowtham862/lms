package com.lms.entity;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.lms.dto.ModulesDto;

import lombok.Data;

@Document(collection = "Add_courses")
@Data
public class AddCourse {


	@Id
    private String id;
	@Field("course_id")
	private long courseid;
	@Field("rating")
	private int rating;
	
	 @Field("recommended_course_ids")
	    private List<String> recommendedCourseIds;

	    @Field("price")
	    private long price;

	    @Field("discount")
	    private long discount;
	
	public long getCourseid() {
		return courseid;
	}
	public void setCourseid(long courseid) {
		this.courseid = courseid;
	}
	public int getRating() {
		return rating;
	}
	public void setRating(int rating) {
		this.rating = rating;
	}
	

	@Field("admin_id")
    private String adminId;
	@Field("course_name")



    private String coursename;
	@Field("admin_name")
    private String adminname;
	public String getAdminname() {
		return adminname;
	}
	public void setAdminname(String adminname) {
		this.adminname = adminname;
	}

	@Field("course_desc")
    private String coursedesc;
	@Field("course_category")
    private String coursecategory;
	@Field("course_duration")
    private String courseduration;

	@Field("training_mode")
    private String trainingmode;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public String getAdminId() {
		return adminId;
	}
	public void setAdminId(String adminId) {
		this.adminId = adminId;
	}
	public String getCoursename() {
		return coursename;
	}
	public void setCoursename(String coursename) {
		this.coursename = coursename;
	}
	public String getCoursedesc() {
		return coursedesc;
	}
	public void setCoursedesc(String coursedesc) {
		this.coursedesc = coursedesc;
	}
	public String getCoursecategory() {
		return coursecategory;
	}
	public void setCoursecategory(String coursecategory) {
		this.coursecategory = coursecategory;
	}
	public String getCourseduration() {
		return courseduration;
	}
	public void setCourseduration(String courseduration) {
		this.courseduration = courseduration;
	}
	public String getTrainingmode() {
		return trainingmode;
	}
	public void setTrainingmode(String trainingmode) {
		this.trainingmode = trainingmode;
	}
	public String getCourselevel() {
		return courselevel;
	}
	public void setCourselevel(String courselevel) {
		this.courselevel = courselevel;
	}
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public String getCertificateavalibility() {
		return certificateavalibility;
	}
	public void setCertificateavalibility(String certificateavalibility) {
		this.certificateavalibility = certificateavalibility;
	}
	public String getNoofmodule() {
		return noofmodule;
	}
	public void setNoofmodule(String noofmodule) {
		this.noofmodule = noofmodule;
	}

	@Field("course_level")
    private String courselevel;
	@Field("language")
    private String language;
	@Field("certificate_avalibility")
    private String certificateavalibility;
	@Field("no_ofmodule")
    private String noofmodule;
	public status getStatus() {
		return status;
	}
	public void setStatus(status status) {
		this.status = status;
	}

	@Field("status")
	private status status;
	public String getModuleCount() {
		return moduleCount;
	}
	public void setModuleCount(String moduleCount) {
		this.moduleCount = moduleCount;
	}

	@Field
	private String moduleCount;
	private List<ModulesDto> modules;
	@Field("meta_data")
	  private List<Map<String, Object>> metadata;
	  public List<Map<String, Object>> getMetadata() {
		  return metadata;
	  }
	  public void setMetadata(List<Map<String, Object>> metadata) {
		  this.metadata = metadata;
	  }


}
