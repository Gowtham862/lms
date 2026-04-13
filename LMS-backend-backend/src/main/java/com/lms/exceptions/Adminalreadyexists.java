package com.lms.exceptions;

public class Adminalreadyexists extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;

	public Adminalreadyexists(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}

}
