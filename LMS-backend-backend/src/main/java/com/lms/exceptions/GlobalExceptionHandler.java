package com.lms.exceptions;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.lms.config.ResponseStructure;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(InvalidLoginException.class)
	public ResponseEntity<ResponseStructure<String>> handleInvalidLogin(InvalidLoginException ex) {
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatus(HttpStatus.UNAUTHORIZED.value());
		response.setMessage(ex.getMessage());
		response.setData(null);
		return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
	}
	@ExceptionHandler(BatchAlreadyExistsException.class)
	public ResponseEntity<ResponseStructure<String>> BatchAlreadyExists(BatchAlreadyExistsException ex) {
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatus(HttpStatus.CONFLICT.value());
		response.setMessage(ex.getMessage());
		response.setData(null);
		return new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(UserAlreadyExistsException.class)
	public ResponseEntity<ResponseStructure<String>> handleUserAlreadyExists(UserAlreadyExistsException ex) {
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatus(HttpStatus.CONFLICT.value());
		response.setMessage(ex.getMessage());
		response.setData(null);
		return new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(UserIdnotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handleUserNotFound(UserIdnotFoundException ex) {
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatus(HttpStatus.NOT_FOUND.value());
		response.setMessage(ex.getMessage());
		response.setData(null);
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}

	
	@ExceptionHandler(IdNotFoundException.class)
	public ResponseEntity<ResponseStructure<String>> handleUserNotFound(IdNotFoundException ex) {
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatus(HttpStatus.NOT_FOUND.value());
		response.setMessage(ex.getMessage());
		response.setData(null);
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}


	@ExceptionHandler(FieldcannotbeEmpty.class)
	public ResponseEntity<ResponseStructure<String>> handleFieldEmpty(FieldcannotbeEmpty ex) {
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatus(HttpStatus.BAD_REQUEST.value());
		response.setMessage(ex.getMessage());
		response.setData(null);
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ResponseStructure<String>> handleGenericException(Exception ex) {
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
		response.setMessage("An unexpected error occurred: " + ex.getMessage());
		response.setData(null);
//		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		 return ResponseEntity
		            .status(HttpStatus.INTERNAL_SERVER_ERROR)
		            .header(HttpHeaders.CONTENT_TYPE, "application/json")
		            .body(response);
	}

	@ExceptionHandler(IdAlreadyExistsException.class)
	public ResponseEntity<ResponseStructure<String>> handleIdNotFound(Exception ex) {
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatus(HttpStatus.CONFLICT.value());
		response.setMessage(ex.getMessage());
		response.setData(null);
		return new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}
//	@ExceptionHandler(MethodArgumentNotValidException.class)
//	public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
//			HttpHeaders headers, HttpStatus status, WebRequest request) {
//		
//		List<ObjectError> list = ex.getAllErrors();
//		HashMap<String,String> hashmap = new HashMap<>();
//		for(ObjectError error:list) {
//			String message = error.getDefaultMessage();
//			String fieldName = ((FieldError) error).getField();
//			hashmap.put(fieldName, message);
//		}
//		
//		return new ResponseEntity<Object>(hashmap,HttpStatus.BAD_REQUEST);

	  @ExceptionHandler(MethodArgumentNotValidException.class)
	    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {
		  List<ObjectError> list = ex.getAllErrors();
			HashMap<String,String> hashmap = new HashMap<>();
			for(ObjectError error:list) {
				String message = error.getDefaultMessage();
				String fieldName = ((FieldError) error).getField();
				hashmap.put(fieldName, message);
			}
			
			return new ResponseEntity<Object>(hashmap,HttpStatus.BAD_REQUEST);

	
	    }	

}