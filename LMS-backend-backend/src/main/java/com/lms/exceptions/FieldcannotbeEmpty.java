package com.lms.exceptions;

public class FieldcannotbeEmpty extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;

	public String getMessage() {
		return message;
	}

	public FieldcannotbeEmpty(String message) {
		this.message = message;
	}

}
