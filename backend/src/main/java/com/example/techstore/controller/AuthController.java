package com.example.techstore.controller;

import com.example.techstore.config.JWTTokenHelper;
import com.example.techstore.dto.UserToken;
import com.example.techstore.dto.request.LoginRequest;
import com.example.techstore.dto.request.RegistrationRequest;
import com.example.techstore.dto.response.RegistrationResponse;
import com.example.techstore.entity.User;
import com.example.techstore.security.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import com.example.techstore.security.service.RefreshTokenService;

import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    RegistrationService registrationService;
    @Autowired
    UserDetailsService userDetailsService;
    @Autowired
    JWTTokenHelper jwtTokenHelper;

    @Autowired
    RefreshTokenService refreshTokenService;  // Thêm service refresh token

    @PostMapping("/login")
    public ResponseEntity<UserToken> login(@RequestBody LoginRequest loginRequest) {
        try {
            // tạo token login chưa được xác thực
            Authentication authentication = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.getEmail(), loginRequest.getPassword());
            // trả về authentication đã xác thực
            Authentication authenticationResponse = this.authenticationManager.authenticate(authentication);

            if (authenticationResponse.isAuthenticated()) {
                User user = (User) authenticationResponse.getPrincipal();
                if (!user.getIsActive()) {
                    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                }
                // generate access token
                String accessToken = jwtTokenHelper.generateToken(user.getEmail(), user.getId());

                // generate refresh token
                String refreshToken = refreshTokenService.createRefreshToken(user).getToken();

                UserToken userToken = UserToken.builder()
                        .token(accessToken)
                        .refreshToken(refreshToken)  // nếu bạn có field này
                        .email(user.getEmail())
                        .role(user.getRole().getName()) // cần role ở FE
                        .build();

                return new ResponseEntity<>(userToken, HttpStatus.OK);
            }

        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@RequestBody RegistrationRequest request) {
        RegistrationResponse response = registrationService.createUser(request);
        return new ResponseEntity<>(response, response.getCode() == 200 ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> map) {
        String email = map.get("email");
        String code = map.get("code");

        User user = (User) userDetailsService.loadUserByUsername(email);
        if (user != null && user.getVerificationCode().equals(code)) {
            registrationService.verifyUser(user);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
//    @PostMapping("/refreshToken")
//    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
//        String token = request.get("refreshToken");
//
//        if (token == null || token.isEmpty()) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Missing refresh token"));
//        }
//
//        return refreshTokenService.findByToken(token)
//                .map(refreshToken -> {
//                    if (refreshTokenService.isTokenExpired(refreshToken)) {
//                        return ResponseEntity.status(401).body(Map.of("error", "Refresh token expired"));
//                    }
//
//                    User user = refreshToken.getUser();
//                    String accessToken = jwtService.generateToken(user.getEmail(), user.getId());
//
//                    return ResponseEntity.ok(Map.of("accessToken", accessToken));
//                })
//                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token")));
//    }

}
