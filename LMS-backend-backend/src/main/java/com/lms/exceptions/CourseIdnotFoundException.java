package com.lms.exceptions;

public class CourseIdnotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;

	public CourseIdnotFoundException(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}
}
