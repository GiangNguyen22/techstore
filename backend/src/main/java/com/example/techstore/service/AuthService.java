package com.example.techstore.service;

import com.example.techstore.dto.reponse.SigninResponse;
import com.example.techstore.dto.reponse.SignupResponse;
import com.example.techstore.dto.request.SigninRequest;
import com.example.techstore.dto.request.SignupRequest;

public interface AuthService {
    SignupResponse registerUser(SignupRequest request);
    SigninResponse loginUser(SigninRequest request);
    
}
