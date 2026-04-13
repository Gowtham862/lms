package com.lms.exceptions;

public class IdAlreadyExistsException  extends RuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;
	public IdAlreadyExistsException(String message) {
		super();
		this.message = message;
	}
	public String getMessage() {
		return message;
	}
	

}
