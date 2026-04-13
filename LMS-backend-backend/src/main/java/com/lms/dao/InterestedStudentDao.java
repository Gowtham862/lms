package com.lms.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import com.lms.entity.InterestedStudent;
import com.lms.entity.SendOtp;
import com.lms.exceptions.IdNotFoundException;
import com.lms.repository.InterestedStudentRepository;

@Component
public class InterestedStudentDao {
	
	@Autowired
	InterestedStudentRepository interrepo;
	
	public InterestedStudent saveinterstedstudent(InterestedStudent student) {
		student.setInterstedid(System.currentTimeMillis());
	    return interrepo.save(student);

     }
	
	
	public List<InterestedStudent> findallinterstedstudent(int number) {
		Pageable page = PageRequest.of(number, 5);
//		Pageable page = PageRequest.of(Math.max(number - 1, 0), 5);
		
		
		return interrepo.findAllInterestedStudent(page);
	}
	
	public InterestedStudent findbyintersted(long id)
	{
		Optional<InterestedStudent> course =interrepo.findByinterstedid(id);
		if(course.isPresent())
		{
			System.out.println("calling........");
			return course.get();
		}
		
		return null;
		
	}
	
	  public void Updateinterstedstudent(long id) {
		  
		   Optional<InterestedStudent> optional = interrepo.findByinterstedid(id);
		   if (optional.isEmpty()) {
		        throw new IdNotFoundException("Interested Student not found with id: " + id);
		    }

		    if (optional.isPresent()) {
		    	System.out.println("calling.....");
		    	InterestedStudent entity = optional.get();
		        entity.setCurrentstatus("paid");
		        interrepo.save(entity);
		    }
		   
	   }
	  
	  public void Updateinterstedstudentdenied(long id) {
		  
		   Optional<InterestedStudent> optional = interrepo.findByinterstedid(id);
		   if (optional.isEmpty()) {
		        throw new IdNotFoundException("Interested Student not found with id: " + id);
		    }

		    if (optional.isPresent()) {
		    	System.out.println("calling.....");
		    	InterestedStudent entity = optional.get();
		        entity.setCurrentstatus("Denied");
		        interrepo.save(entity);
		    }
		   
	   }

	
	
	
	
	

}
