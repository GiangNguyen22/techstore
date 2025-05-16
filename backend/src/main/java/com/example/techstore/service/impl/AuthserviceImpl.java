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

    @Autowired
    private RoleRepository roleRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public SignupResponse registerUser(SignupRequest request) {
        // Kiểm tra email đã tồn tại chưa
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại: " + request.getEmail());
        }

        // Tạo user mới
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setIsActive(true);
        //user.setRoles(["Alice", "Bob", "Charlie"]);

        // Lưu user vào cơ sở dữ liệu
        userRepository.save(user);

        return new SignupResponse("Đăng ký tài khoản thành công!");
    }
}
