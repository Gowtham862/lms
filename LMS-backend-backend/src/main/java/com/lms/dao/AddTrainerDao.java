package com.lms.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.lms.entity.AddTrainer;
import com.lms.repository.AddTrainerRepository;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AddTrainerDao {

	@Autowired
	AddTrainerRepository trainerrepo;
	

	  @Autowired
	 private  PasswordEncoder passwordEncoder;

	public AddTrainer addnewtarineer(AddTrainer trainer) {
		String encryptedPassword = passwordEncoder.encode(trainer.getTemporaraypassword());
		trainer.setTemporaraypassword(encryptedPassword);
		trainer.setStatus("A");

		trainer.setTrainerid(System.currentTimeMillis());
		return trainerrepo.save(trainer);
	}
	public List<AddTrainer> findalltrainer() {
		return trainerrepo.findAll();
	}
	public AddTrainer finduserbyemail(String email) {
		AddTrainer traineemail = trainerrepo.findActiveByLoginEmail(email);
        log.info(email, traineemail);;
		if (traineemail != null) {
			return traineemail;
		}
		return null;

	}
	
	public AddTrainer findbyid(String id)
	{
		Optional<AddTrainer> trainer =trainerrepo.findById(id);
		if(trainer.isPresent())
		{
			return trainer.get();
		}
		
		return null;
		
	}
	



}
