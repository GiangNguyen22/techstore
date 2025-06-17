package com.example.techstore.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JWTTokenHelper {
    @Value("${jwt.auth.app}")
    private String appName;

    @Value("${jwt.auth.secret_key}")
    private String secretKey;

    @Value("${jwt.auth.expires_in}")
    private int expiresIn;


    public String generateToken(String email, Integer userId){
        return Jwts.builder()
                .issuer(appName)
                .subject(email)
                .issuedAt(new Date())
                .claim("userId", userId)
                .expiration(generateExpirationDate())
                .signWith(getSignKey())
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Date generateExpirationDate() {
        return new Date(new Date().getTime() + expiresIn * 1000L);
    }


    public String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    public String getEmailFromToken(String authToken) {
        String email;

        try{
            Claims claims = this.getAllClaimsFromToken(authToken);
            email = claims.getSubject();
        }catch(Exception e){
            email = null;
        }

        return email;
    }

    public Integer getUserIdFromToken(String authToken) {
        Integer userId;
        try{
            Claims claims = this.getAllClaimsFromToken(authToken);
            userId = claims.get("userId", Integer.class);
        }catch(Exception e){
            userId = null;
        }
        return userId;
    }

    private Claims getAllClaimsFromToken(String authToken) {
        Claims claims;
        try{
            claims = Jwts.parser()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(authToken)
                    .getBody();

        }catch(Exception e){
            claims = null;
        }
        return claims;
    }

    public boolean isTokenExpired(String authToken) {
        Date expireDate = getExpirationDate(authToken);
        return expireDate.before(new Date());
    }

    private Date getExpirationDate(String authToken) {
        Date expireDate;
        try{
            final Claims claims = this.getAllClaimsFromToken(authToken);
            expireDate = claims.getExpiration();
        }catch (Exception e){
            expireDate = null;
        }
        return expireDate;
    }

    public boolean validateToken(String authToken, UserDetails userDetails) {
        final String email = getEmailFromToken(authToken);
        final Integer userId = getUserIdFromToken(authToken);
        System.out.println("Validating token:");
        System.out.println("Email from token: " + email);
        System.out.println("UserId from token: " + userId);
        System.out.println("Username from userDetails: " + userDetails.getUsername());
        System.out.println("Token expired? " + isTokenExpired(authToken));
        return (email != null && userId != null && email.equals(userDetails.getUsername())
                && !isTokenExpired(authToken));
    }
}
