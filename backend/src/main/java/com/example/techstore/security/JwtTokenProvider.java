package com.example.techstore.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import com.example.techstore.entity.User;
import com.example.techstore.security.models.CustomUserDetails;
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()),  Jwts.SIG.HS256 )
                .compact();
    }

public String getEmailFromToken(String token) {
    Claims claims = Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
            .build()
            .parseSignedClaims(token)
            .getPayload();

    return claims.getSubject(); // subject chính là email
}

public String getRoleFromToken(String token) {
    Claims claims = Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
            .build()
            .parseSignedClaims(token)
            .getPayload();

    return claims.get("role", String.class);
}

    public boolean validateToken(String token, CustomUserDetails userDetails) {
       try {
        Claims claims = Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String email = claims.getSubject();
        return email.equals(userDetails.getUsername()) && !isTokenExpired(claims);
    } catch (JwtException | IllegalArgumentException e) {
        System.err.println("Invalid JWT: " + e.getMessage());
        return false;
    }
}

private boolean isTokenExpired(Claims claims) {
    return claims.getExpiration().before(new Date());
}

}