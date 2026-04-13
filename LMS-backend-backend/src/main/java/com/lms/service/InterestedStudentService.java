package com.lms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.lms.config.ResponseStructure;
import com.lms.dao.InterestedStudentDao;
import com.lms.dto.BatchDto;
import com.lms.dto.InterestedStudentDto;
import com.lms.entity.Batch;
import com.lms.entity.InterestedStudent;
import com.lms.entity.User;
import com.lms.exceptions.IdAlreadyExistsException;
import com.lms.exceptions.IdNotFoundException;
import com.lms.exceptions.UserAlreadyExistsException;
import com.lms.repository.InterestedStudentRepository;
import com.lms.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class InterestedStudentService {
	
	@Autowired
	InterestedStudentDao intersteddao;
	
	@Autowired
	InterestedStudentRepository interrepo;
	
	@Autowired
	private UserRepository userRepository;
	
	public ResponseEntity<ResponseStructure<InterestedStudent>> interstedstudent(InterestedStudent student) {
		log.info("callng...." + student);
		
		  boolean alreadyExists = interrepo.existsByUseridAndBatchidAndCourseid( student.getUserid(),  student.getBatchid(), 
	                student.getCourseid() );
		if (alreadyExists) {
			throw new IdAlreadyExistsException(" already exists for this course");	}
			InterestedStudent student1=intersteddao.saveinterstedstudent(student);
			ResponseStructure<InterestedStudent> responseStructure = new ResponseStructure<>();
			responseStructure.setMessage("Sudent interseted  created successfully");
			responseStructure.setStatus(HttpStatus.CREATED.value());
			responseStructure.setData(student1);
			return new ResponseEntity<ResponseStructure<InterestedStudent>>(responseStructure, HttpStatus.OK);
		
	}
	
	public ResponseEntity<ResponseStructure<List<InterestedStudentDto>>> findallintersestes(int number) {

	    List<InterestedStudent> intersted = intersteddao.findallinterstedstudent( number);

	    if (intersted == null || intersted.isEmpty()) {
	        throw new IdNotFoundException("Not Found");
	    }

	    List<InterestedStudentDto> intersteddto = new ArrayList<>();

	    for (InterestedStudent b : intersted) {

	        InterestedStudentDto dto = new InterestedStudentDto();
	        dto.setInterstedid(b.getInterstedid());
	        dto.setCourseid(b.getCourseid());
	        dto.setUserid(b.getUserid());
	        dto.setBatchid(b.getBatchid());
	        dto.setStatus(b.getStatus());
//	        dto.setUsername(b.getUsername());
	        User user = userRepository.findByUserid(b.getUserid());

	        if (user != null) {
	            dto.setUsername(user.getFirstname());
	        } else {
	            dto.setUsername(null);
	        }

	      
	        dto.setUseremail(b.getUseremail());
	        dto.setCoursename(b.getCoursename());
	        dto.setBatchstartdate(b.getBatchstartdate());
	        dto.setBatchno(b.getBatchno());
	        dto.setComplete(b.isComplete());
	        dto.setCurrentstatus(b.getCurrentstatus());
	        dto.setNextstatus(b.getNextstatus());
	        dto.setUsercontact(b.getUsercontact());
	        dto.setEnrollDate(b.getEnrollDate());
	        

	        intersteddto.add(dto);
	    }

	    ResponseStructure<List<InterestedStudentDto>> responseStructure = new ResponseStructure<>();
	    responseStructure.setData(intersteddto);
	    responseStructure.setMessage("Data found");
	    responseStructure.setStatus(HttpStatus.OK.value());

	    return new ResponseEntity<>(responseStructure, HttpStatus.OK);
	}
	
	
	public ResponseEntity<ResponseStructure<InterestedStudent>> findinterstedstudentid(long id) {
		InterestedStudent batch = intersteddao.findbyintersted(id);

		if (batch != null) {
			ResponseStructure<InterestedStudent> responseStructure = new ResponseStructure<>();
			responseStructure.setData(intersteddao.findbyintersted(id));
			responseStructure.setMessage("data found");
			responseStructure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<InterestedStudent>>(responseStructure, HttpStatus.OK);
		} else {
			throw new IdNotFoundException("id not found");

		}
	}
	
	
	public ResponseEntity<ResponseStructure<String>> updateOtpStatus(long id) {

	    intersteddao.Updateinterstedstudent(id);

	    ResponseStructure<String> response = new ResponseStructure<>();
	    response.setStatus(HttpStatus.OK.value());
	    response.setMessage("Status updated successfully");
	    response.setData("Current status changed to PAID");

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	public ResponseEntity<ResponseStructure<String>> interstedstudentdenied(long id) {

	    intersteddao.Updateinterstedstudentdenied(id);

	    ResponseStructure<String> response = new ResponseStructure<>();
	    response.setStatus(HttpStatus.OK.value());
	    response.setMessage("Status updated successfully");
	    response.setData("Current status changed to UNPAID");

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	public ResponseEntity<ResponseStructure<?>> checkPaymentStatus(long userId ) {

	    boolean isPaid = interrepo.existsByUseridAndCurrentstatus(userId, "paid");

	    ResponseStructure<String> response = new ResponseStructure<>();
	    response.setStatus(HttpStatus.OK.value());

	    if (isPaid) {
	        response.setMessage("Payment status fetched successfully");
	        response.setData(isPaid);
	        response.setStatus(HttpStatus.OK.value());
	    } else {
	        response.setMessage("Payment status fetched successfully");
	        response.setData("Current status is NOT PAID");
	    }

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}






}
