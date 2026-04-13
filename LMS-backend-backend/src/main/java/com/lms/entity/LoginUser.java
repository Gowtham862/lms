package com.lms.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "login_users")
@Data
public class LoginUser {
	
	

        @Id
        private String id; 
	    private String email;
	    private String name;
	    private String password;
	    private Role role;   // INSTRUCTOR / LMS_ADMIN / LEARNER
	    private Long refId;
	    private long phone;
	    private String status;

}
