package com.lms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service; 
import com.lms.dto.EmailDto;
import jakarta.mail.internet.MimeMessage;

@Service
public class Mailservice {
	
	
	@Autowired
	private JavaMailSender javamailsender;
	
//	public void sendRegisteraionEmail(String to,String fullname,String email,String password)
//	{
//		System.out.println(to +""+fullname+" "+email+"hi hlo gowtham");
//		SimpleMailMessage message=new SimpleMailMessage();
//		message.setFrom("hrms <no-reply@accounts.google.com>");
//		message.setTo(to);
//		message.setTo(to);
//		message.setSubject("user Registration mail");
//		String loginlink="hhtp://localhost:4200/login";
//		StringBuilder sb=new StringBuilder();
//		sb.append("Hello"+" ").append(fullname).append(",\n\n");
//		sb.append("your password"+" ").append(password);
//		message.setText(sb.toString());
//		javamailsender.send(message);
//	}
	
	public void sendRegistrationEmail(String to, String fullname, String email, String password) {
		System.out.println(email);
	    try {
	        MimeMessage mimeMessage = javamailsender.createMimeMessage();
	        MimeMessageHelper helper =
	                new MimeMessageHelper(mimeMessage, true, "UTF-8");

	        helper.setFrom("LMS <no-reply@accounts.google.com>");
	        helper.setTo(to);
	        helper.setSubject("User Registration Mail");

	        String body = String.format("""
	            <!DOCTYPE html>
	            <html>
	            <body style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;">
	              <div style="max-width:600px; background:#ffffff; padding:20px; margin:auto;">
	                <h2>Hello %s,</h2>

	                <p>Your account has been created successfully.</p>

	                <p><b>Email:</b> %s</p>
	                <p><b>Password:</b> %s</p>

	                <p>
	                  <a href="http://localhost:4200/login"
	                     style="background:#007bff; color:white;
	                            padding:10px 15px; text-decoration:none;">
	                    Login Now
	                  </a>
	                </p>

	                <p>Regards,<br>HRMS Team</p>
	              </div>
	            </body>
	            </html>
	            """,
	            fullname,
	            to,
	            password
	        );

	        helper.setText(body, true); // TRUE = HTML

	        javamailsender.send(mimeMessage);

	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
	
	
	public String trailemail(EmailDto dto)
	{
		String username=dto.getEmail();
		String password=dto.getPassword();
		String to=dto.getTo();
		String email=dto.getEmail();
			try {
				SimpleMailMessage message=new SimpleMailMessage();
				message.setFrom("hrms <no-reply@accounts.google.com>");
				message.setTo(to);
				message.setTo(to);
				message.setSubject("user Registration mail");
				String loginlink="hhtp://localhost:4200/login";
				StringBuilder sb=new StringBuilder();
				sb.append("Hello"+" ").append(username).append(",\n\n");
				sb.append("your password  :"+" ").append(password);
				message.setText(sb.toString());
				javamailsender.send(message);
				System.out.println(to);
			}
			catch(Exception e)
			{
				return "failed to send a email" +e.getMessage();
			}
		return "mail send successfully"; 
	}
	
	
	public void sendSuperAdminCredentials(String to, String loginemail, String password) {

	    try {
	        MimeMessage mimeMessage = javamailsender.createMimeMessage();
	        MimeMessageHelper helper =
	                new MimeMessageHelper(mimeMessage, true, "UTF-8");

	        helper.setFrom("your_real_email@gmail.com"); 
	        helper.setTo(to);
	        helper.setSubject("Admin Account Created");

	        String body = String.format("""
	            <html>
	            <body style="font-family: Arial;">

	                <h2>Admin Account Created</h2>

	                <p><b>loginemail:</b> %s</p>
	                <p><b>Password:</b> %s</p>

	                <p>
	                    <a href="http://localhost:4200/login"
	                       style="background:#007bff;color:white;
	                              padding:10px 15px;text-decoration:none;">
	                        Login Now
	                    </a>
	                </p>

	                

	            </body>
	            </html>
	            """,
	            loginemail,
	            password
	        );

	        helper.setText(body, true);
	        javamailsender.send(mimeMessage);

	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}

}
