package com.example.techstore.controller;

import com.example.techstore.dto.request.SignupRequest;
import com.example.techstore.dto.reponse.SignupResponse;
import com.example.techstore.dto.request.SigninRequest;
import com.example.techstore.dto.reponse.SigninResponse;
import com.example.techstore.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public SignupResponse signUp(@RequestBody SignupRequest request) {
        return authService.registerUser(request);
    }
    @PostMapping("/signin")
    public SigninResponse signIn(@RequestBody SigninRequest request) {
        return authService.loginUser(request);
    }
}
