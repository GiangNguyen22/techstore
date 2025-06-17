package com.example.techstore.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JWTTokenHelper jwtTokenHelper;

    public JWTAuthenticationFilter(UserDetailsService userDetailsService, JWTTokenHelper jwtTokenHelper) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenHelper = jwtTokenHelper;
    }

//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader == null || !authHeader.startsWith("Bearer")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        try {
//            String authToken = jwtTokenHelper.getToken(request);
//            if (authToken != null) {
//                String email = jwtTokenHelper.getEmailFromToken(authToken);
//                if (email != null) {
//                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
//
//                    if (jwtTokenHelper.validateToken(authToken, userDetails)) {
//                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//                        // Thêm thông tin request vào AuthenticationToken (IP, session,...)
//                        authenticationToken.setDetails(new WebAuthenticationDetails(request));
//                        // Đặt đối tượng Authentication vào SecurityContext (phiên làm việc bảo mật hiện tại)
//                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
//                    }
//                }
//            }
//
//            filterChain.doFilter(request, response);
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }
@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }

    String authToken = authHeader.substring(7);
    try {
        String email = jwtTokenHelper.getEmailFromToken(authToken);
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            if (jwtTokenHelper.validateToken(authToken, userDetails)) {
                UsernamePasswordAuthenticationToken authTokenObj = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authTokenObj.setDetails(new WebAuthenticationDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authTokenObj);
            }
        }
    } catch (Exception e) {
        // Ghi log lỗi token nhưng không throw để tránh làm hỏng multipart request
        System.err.println("JWT error: " + e.getMessage());
    }

    filterChain.doFilter(request, response);
}

}
