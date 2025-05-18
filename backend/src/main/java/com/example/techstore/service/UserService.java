package com.example.techstore.service;

import com.example.techstore.dto.request.SignupRequest;
import com.example.techstore.entity.User;

public interface UserService {
    void signUp(SignupRequest request);
}