package com.example.techstore.service.impl;

import com.example.techstore.dto.UserDetailsDto;
import com.example.techstore.dto.UserDto;
import com.example.techstore.entity.User;
import com.example.techstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@Service
public class UserService {
   @Autowired
    private UserRepository userRepository;


    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            return UserDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .status(user.getIsActive() ? "Active" : "Inactive")
                    .createdAt(user.getCreatedAt() == null? null : LocalDate.from(user.getCreatedAt()))
                    .build();

        }).toList();
    }

    public User updateStatus(Principal principal, boolean isActive) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(() -> new RuntimeException("User doesn't exist"));
        user.setIsActive(isActive);
        return userRepository.save(user);

    }

    public UserDto getUserById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User doesn't exist"));
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getIsActive() ? "Active" : "Inactive")
                .createdAt(user.getCreatedAt() == null? null : LocalDate.from(user.getCreatedAt()))
                .build();
    }
}

