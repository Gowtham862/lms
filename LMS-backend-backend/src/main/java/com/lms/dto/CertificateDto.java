package com.lms.dto;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class CertificateDto {
	private String userid;
	 private List<Map<String, Object>> metadata;
	 public String getUserid() {
		 return userid;
	 }
	 public void setUserid(String userid) {
		 this.userid = userid;
	 }
	 public List<Map<String, Object>> getMetadata() {
		 return metadata;
	 }
	 public void setMetadata(List<Map<String, Object>> metadata) {
		 this.metadata = metadata;
	 }
	 

}
