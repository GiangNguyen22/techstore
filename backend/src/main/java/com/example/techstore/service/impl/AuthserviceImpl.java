package com.example.techstore.service.impl;

import com.example.techstore.dto.request.SignupRequest;
import com.example.techstore.dto.reponse.SignupResponse;
import com.example.techstore.entity.Role;
import com.example.techstore.entity.User;
import com.example.techstore.repository.RoleRepository;
import com.example.techstore.repository.UserRepository;
import com.example.techstore.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AuthserviceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;


    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public SignupResponse registerUser(SignupRequest request) {
        // if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        //     throw new RuntimeException("Email đã tồn tại: " + request.getEmail());
        // }
        Role role = new Role(1, "USER");
        // Tạo user mới
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(role);
        user.setIsActive(1);  // Đặt mặc định là true
        userRepository.save(user);
        return new SignupResponse("Đăng ký tài khoản thành công!");
    }
}
