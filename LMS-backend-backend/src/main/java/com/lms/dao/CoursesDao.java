package com.lms.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.lms.entity.Courses;
import com.lms.repository.CourseRepository;

@Component
public class CoursesDao {

	@Autowired
	CourseRepository courserepository;

	public Courses savecoursedetails(Courses courses) {
		return courserepository.save(courses);

	}

	public List<Courses> findallcourses() {
		return courserepository.findAll();

	}

	public List<Courses> findthecoursesbyuserid(String id) {
		List<Courses> coursesforusers = courserepository.findInactiveByOwnerId(id);
		if (coursesforusers != null) {
			return coursesforusers;
		}
		return null;

	}

	public List<Courses> findallactivecourses() {
		List<Courses> activecourses = courserepository.findAllActiveCourses();
		if (activecourses != null) {
			return activecourses;
		}
		return null;
	}

	public List<Courses> findallinactivecourses() {
		return courserepository.findAllinActiveCourses();
	}

	public Courses activatecourse(String id) {

		Optional<Courses> user2 = courserepository.findById(id);
		if (user2.isPresent()) {

			Courses existingstatus = user2.get();
			existingstatus.setStatus("active");
			return courserepository.save(existingstatus);
		}
		return null;
	}

	public Courses rejectcourse(String id) {

		Optional<Courses> user2 = courserepository.findById(id);
		if (user2.isPresent()) {

			Courses existingstatus = user2.get();
			existingstatus.setStatus("reject");
			return courserepository.save(existingstatus);
		}
		return null;
	}

	public List<Courses> findallthecoursesforuser(String id) {
		List<Courses> courses = courserepository.findByOwnerId(id);
		if (courses != null) {
			return courses;
		}
		return courses;

	}
}
