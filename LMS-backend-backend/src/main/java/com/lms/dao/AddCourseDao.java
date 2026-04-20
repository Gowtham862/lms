package com.lms.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.lms.entity.AddCourse;
import com.lms.repository.AddCourseRepository;


@Component
public class AddCourseDao {
	

	@Autowired
	AddCourseRepository courserepository;

	
	
	public AddCourse addnewcourse(AddCourse courses) {
			courses.setCourseid(System.currentTimeMillis());
			System.out.println("failes");
		return courserepository.save(courses);

	}
	
	public List<AddCourse> findallcourses() {
		return courserepository.findAll();

	}
	
	public List<AddCourse> getpublishedCourses() {
	    return courserepository.findByStatus("Published");
	}

	
	
	public AddCourse findbyid(long id)
	{
		Optional<AddCourse> course =courserepository.findByCourseId(id);
		if(course.isPresent())
		{
			return course.get();
		}
		
		return null;
		
	}
	
	public AddCourse deleteCartById(long courseId) {
		Optional<AddCourse> course = courserepository.findByCourseId(courseId);
		if (course.isPresent()) {
			courserepository.delete(course.get());
			return course.get();
		}
		return null;
	}
}
