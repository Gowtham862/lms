package com.lms.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "OTP_DETAILS")
public class SendOtp {

	 public String getOtp() {
		return otp;
	}
	public void setOtp(String otp) {
		this.otp = otp;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public LocalDateTime getOtpCreatedDateTime() {
		return otpCreatedDateTime;
	}
	public void setOtpCreatedDateTime(LocalDateTime otpCreatedDateTime) {
		this.otpCreatedDateTime = otpCreatedDateTime;
	}
	public LocalDateTime getOtpExpiryDateTime() {
		return otpExpiryDateTime;
	}
	public void setOtpExpiryDateTime(LocalDateTime otpExpiryDateTime) {
		this.otpExpiryDateTime = otpExpiryDateTime;
	}
	public String getOtpStatus() {
		return otpStatus;
	}
	public void setOtpStatus(String otpStatus) {
		this.otpStatus = otpStatus;
	}
	
	 @Id
	 private String id;
	 public String getId() {
		return id;
	}
	 public void setId(String id) {
		 this.id = id;
	 }

	 @Override
	public String toString() {
		return "SendOtp [id=" + id + ", otp=" + otp + ", userId=" + userId + ", otpCreatedDateTime="
				+ otpCreatedDateTime + ", otpExpiryDateTime=" + otpExpiryDateTime + ", otpStatus=" + otpStatus + "]";
	}
     
	 @Field("otp")
	 private String otp;
     @Field("user_id")
	 private String userId;
	 @Field(name = "OTP_CREATED_DATE_TIME")
	 private LocalDateTime otpCreatedDateTime;
	 @Field(name = "OTP_EXPIRY_DATE_TIME")
	 private LocalDateTime otpExpiryDateTime;
	 @Field(name = "OTP_STATUS")
	 private String otpStatus;
}
