package com.lms.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.lms.entity.LoginUser;
import com.lms.entity.PasswordResetToken;
import com.lms.entity.SendOtp;
import com.lms.entity.User;
import com.lms.repository.LoginUserRepository;
import com.lms.repository.PasswordResetTokenRepository;
import com.lms.repository.SendOtpRepository;
import com.lms.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class UpdateOtpStatusDao {
	
	   @Autowired
	   SendOtpRepository otprepo;
	   
	   @Autowired
	   UserRepository userrepo;
	   
	   
		@Autowired
		LoginUserRepository loginuserepo;
	   
	     @Autowired
		 private  PasswordEncoder passwordEncoder;
	   
	     @Autowired
		 PasswordResetTokenRepository passresetrepo;
	    
	  
	   
	   public void UpdateOtpStatuDao(String id) {
		  log.info("UpdateOtpStatusDao called");
		   Optional<SendOtp> optional = otprepo.findById(id);
		  

		    if (optional.isPresent()) {
		        SendOtp entity = optional.get();
		        entity.setOtpStatus("D");
		        otprepo.save(entity);
		    }
		   
	   }
	   
	   public void updatePassword(String email, String password, String tokenId) {

		    log.info("UpdatepasswordDao called");
              System.out.println(tokenId);
		    String encryptedPassword = passwordEncoder.encode(password);

		    Optional<LoginUser> optional =
		            loginuserepo.findByEmail(email);

		    PasswordResetToken token =
		            passresetrepo.findByTokenAndUsedFalse(tokenId);


		    if (optional.isPresent()) {

		        LoginUser loginUser = optional.get();
		        loginUser.setPassword(encryptedPassword);

		        loginuserepo.save(loginUser);
		        if (token != null) {
		            token.setUsed(true);
		            passresetrepo.save(token);
		        }

		        log.info("Password updated successfully in LoginUser");
		    }
		}


}
