package com.lms.exceptions;

public class UserAlreadyExistsException extends RuntimeException{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;

	public String getMessage() {
		return message;
	}


	public UserAlreadyExistsException(String message) {
		this.message = message;
	}

}
