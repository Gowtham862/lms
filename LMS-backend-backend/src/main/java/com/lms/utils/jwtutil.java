package com.lms.utils;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Random;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class jwtutil {
	
	private final String SECRET="gKDJ8buuuuuuuuuuuuuuuuuuuuAMGXFuasvACXJRdardAS";
	private final long EXPIRATION=1000*60*60;
	private final java.security.Key secretKey=Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
	
	@SuppressWarnings("deprecation")
	public String generetatoken(String username)
	{
		return Jwts.builder().setSubject(username).setIssuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() +EXPIRATION))
				.signWith(secretKey,io.jsonwebtoken.SignatureAlgorithm.HS256)
				.compact();
	}
	@SuppressWarnings("deprecation")
	public String extractusername(String tokens)

	{
		return Jwts.parser().setSigningKey(secretKey)
				.build()
				.parseClaimsJws(tokens)
				.getBody()
				.getSubject();
				 	
	}
	public boolean validatejwtToken(String token)
	{
		try {
			extractusername(token);
			return true;
		}
		catch(Exception exception)
		
		{
			return false;	
		}
		
		
		
	}
	public static String generateOtp() {
		Random random = new Random();
		int otp = 10000 + random.nextInt(90000);
		return String.valueOf(otp);
	}
}
