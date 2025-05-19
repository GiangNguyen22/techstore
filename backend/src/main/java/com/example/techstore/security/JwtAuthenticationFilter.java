package com.example.techstore.security;

import com.example.techstore.security.models.CustomUserDetails;
import com.example.techstore.security.service.CustemUserDetailsService; 

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final CustemUserDetailsService customUserDetailsService;
    
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, CustemUserDetailsService customUserDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            // 1. Lấy token từ header (Get token from header)
            final String authorizationHeader = request.getHeader("Authorization");
            String username = null;
            String jwt = null;

            // 2. Kiểm tra định dạng token (Check token format)
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                jwt = authorizationHeader.substring(7);
                username = jwtTokenProvider.getEmailFromToken(jwt);
            }

            // 3. Xác thực token và thiết lập Security Context (Validate token and set Security Context)
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                CustomUserDetails customUserDetails = (CustomUserDetails) this.customUserDetailsService.loadUserByUsername(username);

                if (jwtTokenProvider.validateToken(jwt, customUserDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    customUserDetails,
                                    null,
                                    customUserDetails.getAuthorities()
                            );

                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
        } catch (ExpiredJwtException ex) {
            logger.error("JWT token expired: " + ex.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
            return;
        } catch (IllegalArgumentException ex) {
            logger.error("Invalid JWT signature: " + ex.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return;
        } catch (Exception ex) {
            logger.error("Authentication error: " + ex.getMessage());
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Authentication failed");
            return;
        }

        // 4. Chuyển request đến các filter tiếp theo (Pass request to the next filters)
        filterChain.doFilter(request, response);
    }
}