package com.lms.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.lms.utils.JwtFilter;
@Configuration
@EnableWebSecurity
@EnableMongoAuditing(auditorAwareRef = "auditorconfig")
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable).cors(cors -> cors.configure(http))
				.authorizeHttpRequests((requests) -> requests.requestMatchers("/users/**","/images/**").permitAll()
						.requestMatchers("/question/**").permitAll()
						.requestMatchers("/forgotpassword/**").permitAll()
						.requestMatchers("/email/**").permitAll()
						.requestMatchers("/superadmin/**").permitAll()
//                   
						.requestMatchers("/addtrainer/**").permitAll()
						.requestMatchers("/batch/**").permitAll()
						.requestMatchers("/purchase/**").permitAll()
						.requestMatchers("/sessionreport/**").permitAll()
						.requestMatchers("/Recordingsessions/**").permitAll()
						.requestMatchers("/intersted/**").permitAll()
						.requestMatchers("/addnewcourses/**").permitAll()
						.requestMatchers("/certificate/**").permitAll()
						.requestMatchers("/courses/**").permitAll()
						.requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/v3/api-docs.yaml")
						.permitAll()
						.requestMatchers("/uploads/**").permitAll().anyRequest().authenticated()
				).addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
	         	return http.build();
       	}
	     @Bean
	     public PasswordEncoder passwordEncoder()
	     {
	        return new BCryptPasswordEncoder();
	     }
}
