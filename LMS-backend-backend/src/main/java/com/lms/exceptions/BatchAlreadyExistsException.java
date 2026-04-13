package com.lms.exceptions;

public class BatchAlreadyExistsException extends RuntimeException {
	 
		/**
		 *
		 */
		private static final long serialVersionUID = 1L;
		private String message;
	 
		public BatchAlreadyExistsException(String message) {
			this.message = message;
		}
	 
		public String getMessage() {
			return message;
		}

}
