package com.lms.entity;

import java.util.List;

public class Mail {
	
	private String toMail;
	private String subject;
	private String body;
	private List<String> attachments;
	public String getToMail() {
		return toMail;
	}
	public Mail() {
		super();
	}
	@Override
	public String toString() {
		return "Mail [toMail=" + toMail + ", subject=" + subject + ", body=" + body + ", attachments=" + attachments
				+ "]";
	}
	public Mail(String toMail, String subject, String body, List<String> attachments) {
		super();
		this.toMail = toMail;
		this.subject = subject;
		this.body = body;
		this.attachments = attachments;
	}
	public void setToMail(String toMail) {
		this.toMail = toMail;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public List<String> getAttachments() {
		return attachments;
	}
	public void setAttachments(List<String> attachments) {
		this.attachments = attachments;
	}

}
