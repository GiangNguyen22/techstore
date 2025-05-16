package com.example.techstore.service;

import com.example.techstore.dto.reponse.SignupResponse;
import com.example.techstore.dto.request.SignupRequest;

public interface AuthService {
    SignupResponse registerUser(SignupRequest request);
    
}
