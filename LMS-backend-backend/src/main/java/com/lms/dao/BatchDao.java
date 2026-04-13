package com.lms.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.lms.entity.Batch;
import com.lms.entity.status;
import com.lms.repository.BatchRepository;

@Component
public class BatchDao {
	
	@Autowired
	BatchRepository batchrepo;
	
	public Batch savebatchsedetails(Batch batch) {
		   
		batch.setBatchid(System.currentTimeMillis());
		batch.setStatus(status.InActive);
		
		return batchrepo.save(batch);
	}
	public List<Batch> findallbatch() {
		return batchrepo.findAll();
	}
	
	public List<Batch>findbycourseid(long id)
	{
		return batchrepo.findByCourseId(id);
		
	}
	

	public Batch findbybatchid(long id)
	{
		Optional<Batch> course =batchrepo.findBybatchid(id);
		if(course.isPresent())
		{
			System.out.println("calling........");
			return course.get();
		}
		
		return null;
		
	}

}
