package com.example.techstore.service.impl;

import com.example.techstore.dto.request.SigninRequest;
import com.example.techstore.dto.request.SignupRequest;
import com.example.techstore.dto.reponse.SigninResponse;
import com.example.techstore.dto.reponse.SignupResponse;
import com.example.techstore.security.JwtTokenProvider;
import com.example.techstore.entity.Role;
import com.example.techstore.entity.User;
import com.example.techstore.repository.UserRepository;
import com.example.techstore.service.AuthService;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.core.AuthenticationException;

import java.util.Map;

@Service
public class AuthserviceImpl implements AuthService {
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthserviceImpl(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

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

    @Override
    public SigninResponse loginUser(SigninRequest loginRequest){
        // User user = userRepository.findByEmail(loginRequest.getEmail())
        //         .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + loginRequest.getEmail()));
        
        //         //String token = jwtTokenProvider.generateToken(user.getEmail());
        // if (user == null) {
        //     return new SigninResponse("Tài khoản không tồn tại",null,null,null);
        // }
        // if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
        //     return new SigninResponse("Mật khẩu không đúng",null,null,null);
        // }
        // return new SigninResponse("Đăng nhập thành công", user.getName(), user.getRole().getName(),null);
         try {
            // Xác thực từ email và password
            boolean isAuthenticated = passwordEncoder.matches(loginRequest.getPassword(), userRepository.findByEmail(loginRequest.getEmail()).get().getPassword());
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + loginRequest.getEmail()));
            if(user.getIsActive() == 1 && isAuthenticated){
                String jwt = jwtTokenProvider.generateToken(loginRequest.getEmail(), user.getRole().getName());
                return new SigninResponse("Đăng nhập thành công", user.getName(), user.getRole().getName(), jwt);
            }
            else{
                return new SigninResponse("Tài khoản không tồn tại",null,null,null);
            }

        } catch (AuthenticationException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid email or password");
            return new SigninResponse("Đăng nhập không thành công",null,null,null);
        }
    }
}
