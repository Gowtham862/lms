package com.lms.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.lms.config.ResponseStructure;
import com.lms.dao.UpdateOtpStatusDao;
import com.lms.dto.PasswordDto;
import com.lms.entity.LoginUser;
import com.lms.entity.PasswordResetToken;
import com.lms.entity.SendOtp;
import com.lms.entity.User;
import com.lms.repository.AddTrainerRepository;
import com.lms.repository.LoginUserRepository;
import com.lms.repository.PasswordResetTokenRepository;
import com.lms.repository.SendOtpRepository;
import com.lms.repository.UserRepository;
import com.lms.utils.jwtutil;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ForgotPasswordService {

	@Autowired
	private SendOtpRepository sendOtpRepository;
	@Autowired
	UserRepository userrepo;
	@Autowired
	jwtutil jwtutil;
	@Autowired
	private JavaMailSender javamailsender;
	@Autowired
	UpdateOtpStatusDao updateotpstatus;
	@Autowired
	PasswordResetTokenRepository passreset;

	@Autowired
	AddTrainerRepository trainerepo;
	@Autowired
	MongoOperations mongoOperations;

	@Autowired
	LoginUserRepository loginuserepo;

	@Value("${app.reset-password.url}")
	private String resetPasswordUrl;

	BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public ResponseEntity<ResponseStructure<List<SendOtp>>> sendOtp(String mailId) {
		log.info("Sendotp service called");
		System.out.println(mailId);
		try {
			if (mailId != null && !mailId.isBlank()) {
				boolean exists = loginuserepo.existsByEmail(mailId);
				if (exists) {
					String otpCode = jwtutil.generateOtp();
					log.info(otpCode);
					generatemailforchangepassword(mailId);
					System.out.println("generate");
					SendOtp otpEntity = new SendOtp();
					otpEntity.setOtp(otpCode);
					otpEntity.setUserId(mailId);
					otpEntity.setOtpStatus("A");
					LocalDateTime currentDateTime = LocalDateTime.now();
					otpEntity.setOtpCreatedDateTime(currentDateTime);
					otpEntity.setOtpExpiryDateTime(currentDateTime.plusMinutes(5));
					sendOtpRepository.save(otpEntity);
					ResponseStructure<List<SendOtp>> responseStructure = new ResponseStructure<>();
					responseStructure.setMessage("Your OTP has been sent successfully");
					responseStructure.setStatus(HttpStatus.CREATED.value());
					responseStructure.setData(mailId);
					return new ResponseEntity<ResponseStructure<List<SendOtp>>>(responseStructure, HttpStatus.OK);
				}

				else {

					ResponseStructure<List<SendOtp>> responseStructure = new ResponseStructure<>();
					responseStructure.setMessage("No user found");
					responseStructure.setStatus(HttpStatus.CREATED.value());
					responseStructure.setData(mailId);

					return new ResponseEntity<ResponseStructure<List<SendOtp>>>(responseStructure, HttpStatus.OK);
				}
			}
		} catch (Exception e) {
			log.error("Error occurred while encrypting obj {}", e);
			ResponseStructure<List<SendOtp>> responseStructure = new ResponseStructure<>();
			responseStructure.setMessage("Failed to encrypt object");
			responseStructure.setStatus(HttpStatus.CREATED.value());
			responseStructure.setData(mailId);
			return new ResponseEntity<ResponseStructure<List<SendOtp>>>(responseStructure, HttpStatus.OK);
		}
		return null;

	}

	private void generateAndSendOtp(String mailId, String otpCode) {
		log.info("send otp to mail service called");
		try {
			MimeMessage mimeMessage = javamailsender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
			helper.setFrom("LMS <no-reply@accounts.google.com>");
			helper.setTo(mailId);
			helper.setSubject("Password Reset Request");
			String body = String.format("""
					<!DOCTYPE html>
					<html>
					<head>
					<style>
					.container {
					  max-width: 600px;
					  margin: auto;
					  padding: 20px;
					  font-family: 'Poppins', sans-serif;
					  border: 1px solid #e0e0e0;
					  border-radius: 8px;
					  background-color: #f9f9f9;
					}
					.header {
					  text-align: center;
					  padding-bottom: 10px;
					  color: #262A5D;
					  font-size: 24px;
					  font-weight: bold;
					}
					.otp-box {
					  margin: 20px auto;
					  padding: 15px 30px;
					  font-size: 28px;
					  font-weight: bold;
					  color: #ffffff;
					  background-color: #262A5D;
					  width: fit-content;
					  border-radius: 8px;
					  letter-spacing: 8px;
					}
					.message {
					  font-size: 16px;
					  color: #333333;
					  text-align: center;
					}
					.footer {
					  margin-top: 30px;
					  font-size: 12px;
					  color: #888888;
					  text-align: center;
					}
					</style>
					</head>
					<body>
					<div class="container">
					  <div class="header">Your One-Time Password (OTP)</div>
					  <div class="message">
					    Please use the OTP below to verify your identity.
					    This OTP is valid for the next 5 minutes.
					  </div>
					  <div class="otp-box">%s</div>
					  <div class="message">
					    If you did not request this code, please ignore this email or contact support.
					  </div>
					  <div class="footer">© 2026 LMS. All rights reserved.</div>
					</div>
					</body>
					</html>
					""", otpCode

			);
			helper.setText(body, true); // TRUE = HTML
			javamailsender.send(mimeMessage);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void generatemailforchangepassword(String mailId) {
		log.info("send reset password mail service called");

		List<PasswordResetToken> oldTokens = passreset.findByEmailAndUsedFalse(mailId);

		if (!oldTokens.isEmpty()) {
			for (PasswordResetToken t : oldTokens) {
				t.setUsed(true);
			}
			passreset.saveAll(oldTokens);
		}

		try {

			String token = UUID.randomUUID().toString();

			PasswordResetToken resetToken = new PasswordResetToken();
			resetToken.setEmail(mailId);
			resetToken.setToken(token);
			resetToken.setUsed(false);
			resetToken.setExpiryDateTime(LocalDateTime.now().plusMinutes(5));
			passreset.save(resetToken);
//
//			String resetLink = "http://localhost:4200/new-password?token=" + token;
			String resetLink = resetPasswordUrl + "?token=" + token;
			System.err.println(token);

			MimeMessage mimeMessage = javamailsender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setFrom("LMS <no-reply@accounts.google.com>");
			helper.setTo(mailId);
			helper.setSubject("Password Reset Request");

			// 4️⃣ Inject reset link into HTML
			String body = String.format("""
					<!DOCTYPE html>
					<html>
					<head>
					<style>
					.container {
					  max-width: 600px;
					  margin: auto;
					  padding: 20px;
					  font-family: 'Poppins', sans-serif;
					  border: 1px solid #e0e0e0;
					  border-radius: 8px;
					  background-color: #f9f9f9;
					}
					.header {
					  text-align: center;
					  padding-bottom: 10px;
					  color: #262A5D;
					  font-size: 24px;
					  font-weight: bold;
					}
					.reset-box {
					  margin: 20px auto;
					  padding: 15px 30px;
					  font-size: 18px;
					  font-weight: bold;
					  background-color: #262A5D;
					  width: fit-content;
					  border-radius: 8px;
					}
					.reset-box a {
					  color: #ffffff;
					  text-decoration: none;
					}
					.message {
					  font-size: 16px;
					  color: #333333;
					  text-align: center;
					}
					.footer {
					  margin-top: 30px;
					  font-size: 12px;
					  color: #888888;
					  text-align: center;
					}
					</style>
					</head>

					<body>
					<div class="container">
					  <div class="header">Reset Your Password</div>

					  <div class="message">
					    We received a request to reset your password.
					    Click the button below to create a new password.
					  </div>

					  <div class="reset-box">
					    <a href="%s">Reset Password</a>
					  </div>

					  <div class="message">
					    This link is valid for the next <strong>15 minutes</strong>
					    and can be used <strong>only once</strong>.
					  </div>

					  <div class="message">
					    If you did not request this, please ignore this email or contact support.
					  </div>

					  <div class="footer">© 2026 LMS. All rights reserved.</div>
					</div>
					</body>
					</html>
					""", resetLink);

			helper.setText(body, true); // true = HTML
			javamailsender.send(mimeMessage);

		} catch (Exception e) {
			log.error("Error sending reset password mail", e);
		}
	}

	public ResponseEntity<ResponseStructure<List<SendOtp>>> verifyCode(SendOtp userDto) {

		log.info("Verify code service called");
		try {
			if (userDto.getUserId() != null && userDto.getOtp() != null) {
				SendOtp otpEntity = sendOtpRepository.findValidOtp(userDto.getUserId(), userDto.getOtp());
				System.out.println(otpEntity.getId() + "gowtha");
				if (otpEntity.getOtpExpiryDateTime().isAfter(LocalDateTime.now()) && otpEntity != null) {
					updateotpstatus.UpdateOtpStatuDao(otpEntity.getId());
					ResponseStructure<List<SendOtp>> responseStructure = new ResponseStructure<>();
					responseStructure.setMessage("OTP not expired");
					responseStructure.setStatus(HttpStatus.OK.value());
					responseStructure.setData(otpEntity.getUserId());
					return new ResponseEntity<ResponseStructure<List<SendOtp>>>(responseStructure, HttpStatus.OK);
				} else {
					ResponseStructure<List<SendOtp>> responseStructure = new ResponseStructure<>();
					responseStructure.setMessage("OTP  expired");
					responseStructure.setStatus(HttpStatus.GONE.value());
//					responseStructure.setData(mailId);
					return new ResponseEntity<ResponseStructure<List<SendOtp>>>(responseStructure, HttpStatus.OK);
				}
			} else {
				ResponseStructure<List<SendOtp>> responseStructure = new ResponseStructure<>();
				responseStructure.setMessage("Incorrect OTp");
				responseStructure.setStatus(HttpStatus.CREATED.value());
//				responseStructure.setData(mailId);
				return new ResponseEntity<ResponseStructure<List<SendOtp>>>(responseStructure, HttpStatus.OK);
			}
		} catch (Exception e) {
			log.error("Error occurred while verifying OTP {}", e);
			ResponseStructure<List<SendOtp>> responseStructure = new ResponseStructure<>();
			responseStructure.setMessage("Invalid OTP");
			responseStructure.setStatus(HttpStatus.BAD_REQUEST.value());
//			responseStructure.setData(mailId);
			return new ResponseEntity<ResponseStructure<List<SendOtp>>>(responseStructure, HttpStatus.OK);
		}
	}

//	public ResponseEntity<ResponseStructure<List<User>>> changePassword(User userDto) {
//
//		System.err.print(userDto +"mail");
//		try {
//			log.info("Changepassword service method called");
//			if (userDto.getId() != null) {
//
//				 PasswordResetToken tokenEntity =passreset.findByTokenAndUsedFalse(userDto.getLastname());
//				 System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//				 System.out.println(tokenEntity);
//				 System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//				 if(tokenEntity==null)
//				 {
//					 ResponseStructure<List<User>> responseStructure = new ResponseStructure<>();
//						responseStructure.setMessage("Password reset link has expired");
//						responseStructure.setStatus(HttpStatus.GONE.value());
////						responseStructure.setData(mailId);
//						return new ResponseEntity<ResponseStructure<List<User>>>(responseStructure, HttpStatus.OK);
//				 }
//				System.out.println("is this correct");
//				LoginUser usermail = loginuserepo.email(userDto.getId());
//				System.err.println(usermail.getEmail() + "working");
////				PasswordResetToken pass = passreset.email(usermail.getEmail());
//			
//				if (tokenEntity != null&&tokenEntity.getExpiryDateTime().isAfter(LocalDateTime.now()) ) {
//					System.out.println(tokenEntity + "working perfectly");
//				
//					System.out.println(usermail);
//					System.out.println(userDto.getEmail());
//					updateotpstatus.Updatepassword(usermail.getEmail(), userDto.getPassword(),usermail.getRefId());
//					ResponseStructure<List<User>> responseStructure = new ResponseStructure<>();
//					responseStructure.setMessage("Your password has been reset successfully");
//					responseStructure.setStatus(HttpStatus.OK.value());
////						responseStructure.setData(mailId);
//					return new ResponseEntity<ResponseStructure<List<User>>>(responseStructure, HttpStatus.OK);
//				} else {
//					ResponseStructure<List<User>> responseStructure = new ResponseStructure<>();
//					responseStructure.setMessage("Password reset link has expired");
//					responseStructure.setStatus(HttpStatus.GONE.value());
////					responseStructure.setData(mailId);
//					return new ResponseEntity<ResponseStructure<List<User>>>(responseStructure, HttpStatus.OK);
//				}
//			} else {
//				ResponseStructure<List<User>> responseStructure = new ResponseStructure<>();
//				responseStructure.setMessage("mail id is null or empty");
//				responseStructure.setStatus(HttpStatus.OK.value());
////				responseStructure.setData(mailId);
//				return new ResponseEntity<ResponseStructure<List<User>>>(responseStructure, HttpStatus.OK);
//			}
//		} catch (Exception e) {
//			ResponseStructure<List<User>> responseStructure = new ResponseStructure<>();
//			responseStructure.setMessage("mail id is null or empty error");
//			responseStructure.setStatus(HttpStatus.OK.value());
////			responseStructure.setData(mailId);
//			return new ResponseEntity<ResponseStructure<List<User>>>(responseStructure, HttpStatus.OK);
//		}
//	public ResponseEntity<ResponseStructure<List<User>>> changePassword(PasswordDto userDto) {
//		//
//		System.err.print(userDto + "mail");
//		try {
//			log.info("Changepassword service method called"+userDto.getEmail());
//			if (userDto.getEmail() != null) {
//				System.err.println("success 1");
//				System.out.println(userDto.getToken());
//				PasswordResetToken tokenEntity = passreset.findByTokenAndUsedFalse(userDto.getToken());
//				System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//				System.out.println(tokenEntity +"success2");
//				System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//				if (tokenEntity == null) {
//					ResponseStructure<List<User>> responseStructure = new ResponseStructure<>();
//					responseStructure.setMessage("Password reset link has expired");
//					responseStructure.setStatus(HttpStatus.GONE.value());
//					return new ResponseEntity<ResponseStructure<List<User>>>(responseStructure, HttpStatus.OK);
//				}
//				System.out.println("is this correct");
//				LoginUser usermail = loginuserepo.email(userDto.getEmail());
//				System.err.println(usermail.getEmail() + "working");
//				
//
//				if (tokenEntity != null && tokenEntity.getExpiryDateTime().isAfter(LocalDateTime.now())) {
//					System.out.println(tokenEntity + "working perfectly");
//
//					System.out.println(usermail);
//					System.out.println(userDto.getEmail());
//					updateotpstatus.updatePassword(usermail.getEmail(), userDto.getPassword(), userDto.getToken());
//					ResponseStructure<List<User>> responseStructure = new ResponseStructure<>();
//					responseStructure.setMessage("Your password has been reset successfully");
//					responseStructure.setStatus(HttpStatus.OK.value());
////					responseStructure.setData();
//					return new ResponseEntity<ResponseStructure<List<User>>>(responseStructure, HttpStatus.OK);
//				} else {
//					ResponseStructure<List<User>> responseStructure = new ResponseStructure<>();
//					responseStructure.setMessage("Password reset link has expired");
//					responseStructure.setStatus(HttpStatus.GONE.value());
//					responseStructure.setData(null);
//					return new ResponseEntity<ResponseStructure<List<User>>>(responseStructure, HttpStatus.OK);
//				}
//			} else {
//				ResponseStructure<List<User>> responseStructure = new ResponseStructure<>();
//				responseStructure.setMessage("mail id is null or empty");
//				responseStructure.setStatus(HttpStatus.OK.value());
//				responseStructure.setData(null);
//				return new ResponseEntity<ResponseStructure<List<User>>>(responseStructure, HttpStatus.OK);
//			}
//		} catch (Exception e) {
//			ResponseStructure<List<User>> responseStructure = new ResponseStructure<>();
//			responseStructure.setMessage("mail id is null or empty error");
//			responseStructure.setStatus(HttpStatus.OK.value());
//			responseStructure.setData(null);
//			return new ResponseEntity<ResponseStructure<List<User>>>(responseStructure, HttpStatus.OK);
//		}
//
//	}
	public ResponseEntity<ResponseStructure<List<User>>> changePassword(PasswordDto userDto) {

	    try {
	        log.info("Change password service called");

	        // 1️⃣ Find token first
	        PasswordResetToken tokenEntity =
	                passreset.findByTokenAndUsedFalse(userDto.getToken());

	        if (tokenEntity == null) {
	            ResponseStructure<List<User>> response = new ResponseStructure<>();
	            response.setMessage("Password reset link expired or invalid");
	            response.setStatus(HttpStatus.GONE.value());
	            return new ResponseEntity<>(response, HttpStatus.OK);
	        }

	        // 2️⃣ Check expiry
	        if (tokenEntity.getExpiryDateTime().isBefore(LocalDateTime.now())) {
	            ResponseStructure<List<User>> response = new ResponseStructure<>();
	            response.setMessage("Reset link expired");
	            response.setStatus(HttpStatus.GONE.value());
	            return new ResponseEntity<>(response, HttpStatus.OK);
	        }

	        // 3️⃣ Get email FROM TOKEN (important change)
	        String email = tokenEntity.getEmail();

	        // 4️⃣ Find login user using token email
	        LoginUser usermail = loginuserepo.email(email);

	        // 5️⃣ Update password
	        updateotpstatus.updatePassword(email, userDto.getPassword(), userDto.getToken());

	        ResponseStructure<List<User>> response = new ResponseStructure<>();
	        response.setMessage("Password reset successful");
	        response.setStatus(HttpStatus.OK.value());
	        return new ResponseEntity<>(response, HttpStatus.OK);

	    } catch (Exception e) {
	        ResponseStructure<List<User>> response = new ResponseStructure<>();
	        response.setMessage("Error resetting password");
	        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
	        return new ResponseEntity<>(response, HttpStatus.OK);
	    }
	}

}