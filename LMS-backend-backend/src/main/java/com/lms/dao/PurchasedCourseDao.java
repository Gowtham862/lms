package com.lms.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.lms.entity.AddCourse;
import com.lms.entity.UserPurchasedCourse;
import com.lms.repository.AddCourseRepository;
import com.lms.repository.PurchasedCourseRepository;

@Component
public class PurchasedCourseDao {
	
	@Autowired
	AddCourseRepository courserepo;
	
	
	@Autowired
	PurchasedCourseRepository purchasedrepo;
//	public List<AddCourse> findbycourseid(String courseid)
//	{
//		return courserepo.findByCourseId(courseid);
//		
//	}
	
	public UserPurchasedCourse savepurchasedcourse(UserPurchasedCourse  courses) {
		courses.setPurchaseid(System.currentTimeMillis());
		courses.setStatus("Active");
		courses.setComplete(false);
		return purchasedrepo.save(courses);

	}
	
	public List<UserPurchasedCourse> findAllPurchasedusers(){
		List<UserPurchasedCourse> userdetails = purchasedrepo.findAll();
		if(!userdetails.isEmpty()) {
			return userdetails;
		}
		return null;
	}

}
