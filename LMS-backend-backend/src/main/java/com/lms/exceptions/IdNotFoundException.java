package com.lms.exceptions;

public class IdNotFoundException extends RuntimeException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;

	public IdNotFoundException(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}

}
