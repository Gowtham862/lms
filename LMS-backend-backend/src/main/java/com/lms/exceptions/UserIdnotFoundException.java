package com.lms.exceptions;

public class UserIdnotFoundException extends RuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;

	public UserIdnotFoundException(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}

}
