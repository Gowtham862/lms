package com.lms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.lms.config.ResponseStructure;
import com.lms.dao.UserDao;
import com.lms.dto.UserDto;
import com.lms.dto.UsersDto;
import com.lms.dto.LoginResponseDto;
import com.lms.dto.TrainerLoginResponseDto;
import com.lms.entity.AddTrainer;
import com.lms.entity.AdminStatus;
import com.lms.entity.LoginUser;
import com.lms.entity.Role;
import com.lms.entity.SuperAdmin;
import com.lms.entity.User;
import com.lms.entity.status;
import com.lms.exceptions.UserAlreadyExistsException;
import com.lms.repository.AddTrainerRepository;
import com.lms.repository.LoginUserRepository;
import com.lms.repository.SuperAdminRepository;
import com.lms.exceptions.InvalidLoginException;
import com.lms.utils.jwtutil;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {

	@Autowired
	private JavaMailSender javamailsender;
	@Autowired
	AddTrainerRepository trainerrepo;
	@Autowired
	private SuperAdminRepository superadminrepo;
	@Autowired
	UserDao userdao;
	@Autowired
	UserDto userdto;
	@Autowired
	UsersDto usersdto;
	@Autowired
	private jwtutil jwt;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private LoginUserRepository loginUserRepo;
	

	public ResponseEntity<ResponseStructure<User>> saveuser(User user) {
		User useremail = userdao.finduserbyemail(user.getEmail());
		if (useremail == null) {
			  if (loginUserRepo.existsByEmail(user.getEmail())) {
					throw new UserAlreadyExistsException("user with this email already exists");
		        }

			user = userdao.saveuser(user);
			usersdto.setFirstname(user.getFirstname());
			usersdto.setLastname(user.getLastname());
			
			usersdto.setEmail(user.getEmail());
			usersdto.setRole(user.getRole());
			usersdto.setStatus(user.getStatus());
			usersdto.setId(user.getId());
			
			LoginUser loginUser = new LoginUser();
			loginUser.setEmail(user.getEmail());
			loginUser.setName(user.getFirstname());
			loginUser.setPassword(user.getPassword()); // already encrypted
			loginUser.setRole(Role.LEARNER);
			loginUser.setRefId(user.getUserid());
			loginUser.setStatus(user.getStatus());
			loginUser.setPhone(user.getPhone());
			// Active

			loginUserRepo.save(loginUser);
			try {
				MimeMessage mimeMessage = javamailsender.createMimeMessage();
				MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

				helper.setFrom("LMS <no-reply@accounts.google.com>");
				helper.setTo(user.getEmail());
				helper.setSubject("User Registration Mail");

				String body = String.format(
						"""
								  <!DOCTYPE html>
								<html>
								<body style="font-family:'Poppins', sans-serif; background-color:#f4f4f4; padding:20px;">
								  <div style="max-width:600px; background:#ffffff; padding:20px; margin:auto; border-radius:8px;">

								    <h2>
								      Welcome to LMS,
								      <span style="color:#007bff; font-weight:bold;">%s</span>!
								    </h2>

								    <p>Thank you for signing up with LMS. Your account has been successfully created.</p>

								    <p><b>Email:</b> %s</p>

								    <p>
								      Click the button below to log in and start learning:
								    </p>

								    <p>
								      <a href="http://localhost:4200/login"
								         style="background:#007bff; color:white; border-radius:6px;
								                padding:10px 18px; text-decoration:none; display:inline-block;">
								        Login to LMS
								      </a>
								    </p>

								    <p style="margin-top:30px;">
								      If you did not create this account, please contact our support team immediately.
								    </p>

								    <p>
								      Regards,<br>
								      <b>LMS Team</b>
								    </p>

								    <hr style="border:none; border-top:1px solid #e0e0e0; margin-top:30px;">

								    <p style="font-size:12px; color:#888888; text-align:center;">
								      © 2026 LMS. All rights reserved.
								    </p>

								  </div>
								</body>
								</html>
								""",
						user.getFirstname(), user.getEmail()
//			            user.getPassword()
				);

				helper.setText(body, true); // TRUE = HTML

				javamailsender.send(mimeMessage);

			} catch (Exception e) {
				e.printStackTrace();
			}
			ResponseStructure<User> responseStructure = new ResponseStructure<User>();
			responseStructure.setMessage("user created successfully");
			responseStructure.setStatus(HttpStatus.CREATED.value());
			responseStructure.setData(usersdto);
			return new ResponseEntity<ResponseStructure<User>>(responseStructure, HttpStatus.CREATED);
		} else {
			throw new UserAlreadyExistsException("user with this email already exists");
		}
	}

//	public ResponseEntity<ResponseStructure<?>> loginuser(String email, String password) {
//        LoginUser user1=loginUserRepo.email(email);
//		if (user1 != null) {
//			String encryptedPasswor = user1.getPassword();
//			if (!passwordEncoder.matches(password, encryptedPasswor)) {
//				ResponseStructure<?> structure = new ResponseStructure<>();
//				structure.setMessage("Invalid admin password");
//				structure.setStatus(HttpStatus.UNAUTHORIZED.value());
//				structure.setData(null);
//				return new ResponseEntity<>(structure, HttpStatus.UNAUTHORIZED);
//			}
//			String token = jwt.generetatoken(email);
//			TrainerLoginResponseDto response = new TrainerLoginResponseDto();
//			response.setToken(token);
//			response.setEmail(user1.getEmail());
//			response.setFirstname(user1.getName());
//			response.setUserid(user1.getRefId());
//			response.setRole(user1.getRole());
//			response.setPhone(user1.getPhone());
////			  You can get this from user entity if you have role field
//			ResponseStructure<?> responseStructure = new ResponseStructure<User>();
//			responseStructure.setMessage("user successfully logined");
//			responseStructure.setStatus(HttpStatus.OK.value());
//			responseStructure.setData(response);
//			return new ResponseEntity<ResponseStructure<?>>(responseStructure, HttpStatus.OK);
//		}
//	else {
//			throw new InvalidLoginException("Invalid username or password");
//		}
//
//	}
	
	public ResponseEntity<ResponseStructure<?>> loginuser(String email, String password) {
	    LoginUser user1 = loginUserRepo.email(email);
	    System.out.println(user1);
 
	    if (user1 != null) {
	        // Check password
	        if (!passwordEncoder.matches(password, user1.getPassword())) {
	            ResponseStructure<?> structure = new ResponseStructure<>();
	            structure.setMessage("Invalid password");
	            structure.setStatus(HttpStatus.UNAUTHORIZED.value());
	            structure.setData(null);
	            return new ResponseEntity<>(structure, HttpStatus.UNAUTHORIZED);
	        }
 
	       
//	        if (user1.getStatus() != null && !user1.getStatus().equals(status.Active)) {
//	            ResponseStructure<?> structure = new ResponseStructure<>();
//	            structure.setMessage("Your account is inactive. Contact admin.");
//	            structure.setStatus(HttpStatus.FORBIDDEN.value());
//	            structure.setData(null);
//	            return new ResponseEntity<>(structure, HttpStatus.FORBIDDEN);
//	        }
// 
	    
	        if (user1.getRole().equals(Role.INSTRUCTOR)) {
	        	
	        	log.info("success");
	            Optional<AddTrainer> trainer = trainerrepo.findByTrainerid(user1.getRefId());
	            System.out.println("RefId from LoginUser: " + user1.getRefId());     System.out.println("Trainer found: " + trainer.isPresent());
                  log.info("failed");
	            if (trainer.isEmpty() || !"Active".equals(trainer.get().getTrainerstatus())) {
	                ResponseStructure<?> structure = new ResponseStructure<>();
	                structure.setMessage("Trainer account is inactive. Contact admin.");
	                structure.setStatus(HttpStatus.FORBIDDEN.value());
	                structure.setData(null);
	                return new ResponseEntity<>(structure, HttpStatus.FORBIDDEN);
	            }
	        }
 
	       
	        if (user1.getRole().equals(Role.LMS_ADMIN)|| user1.getRole().equals(Role.SALES_ADMIN)
	        		 ) {
	            Optional<SuperAdmin> superAdmin = superadminrepo.findByAdminid(user1.getRefId());
 
	            if (superAdmin.isEmpty() || !superAdmin.get().getAdminstatus().equals(AdminStatus.Active)) {
	                ResponseStructure<?> structure = new ResponseStructure<>();
	                structure.setMessage("Admin account is inactive. Contact admin.");
	                structure.setStatus(HttpStatus.FORBIDDEN.value());
	                structure.setData(null);
	                return new ResponseEntity<>(structure, HttpStatus.FORBIDDEN);
	            }
	        }
 
	       
	        String token = jwt.generetatoken(email);
	        TrainerLoginResponseDto response = new TrainerLoginResponseDto();
	        response.setToken(token);
	        response.setEmail(user1.getEmail());
	        response.setFirstname(user1.getName());
	        response.setUserid(user1.getRefId());
	        response.setRole(user1.getRole());
	        response.setPhone(user1.getPhone());
 
	        ResponseStructure<?> responseStructure = new ResponseStructure<>();
	        responseStructure.setMessage("User successfully logged in");
	        responseStructure.setStatus(HttpStatus.OK.value());
	        responseStructure.setData(response);
	        return new ResponseEntity<>(responseStructure, HttpStatus.OK);
 
	    } else {
	        throw new InvalidLoginException("Invalid username or password");
	    }
	}
 

	public ResponseEntity<ResponseStructure<List<User>>> findallusers(int num) {
		List<User> users = userdao.findalluser(num);
		if (users != null && !users.isEmpty()) {
			ResponseStructure<List<User>> structure = new ResponseStructure<>();
			structure.setMessage("Users found");
			structure.setStatus(HttpStatus.OK.value());
			structure.setData(users);
			return new ResponseEntity<ResponseStructure<List<User>>>(structure, HttpStatus.OK);
		}
		ResponseStructure<List<User>> structure = new ResponseStructure<>();
		structure.setData(new ArrayList<>());
		structure.setMessage("No Users found");
		structure.setStatus(HttpStatus.OK.value());
		return new ResponseEntity<ResponseStructure<List<User>>>(structure, HttpStatus.OK);
	}
	
	
	

}
//<p><b>Password:</b> %s</p>