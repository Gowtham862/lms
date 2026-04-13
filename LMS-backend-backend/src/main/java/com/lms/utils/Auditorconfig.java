package com.lms.utils;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class Auditorconfig implements AuditorAware<String> {

	@Override
	public Optional<String> getCurrentAuditor() {
		// TODO Auto-generated method stub
		  Authentication authentication =
	                SecurityContextHolder.getContext().getAuthentication();
	 
	        if (authentication == null || !authentication.isAuthenticated()
	                || authentication.getPrincipal().equals("anonymousUser")) {
	            return Optional.empty();
	        }
	 
		  return Optional.of(authentication.getName());
	}

}
