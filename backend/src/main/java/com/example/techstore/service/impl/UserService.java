package com.example.techstore.service.impl;

import com.example.techstore.dto.UserDto;
import com.example.techstore.entity.User;
import com.example.techstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
                    .createdAt(LocalDate.from(user.getCreatedAt()))
                    .build();

        }).toList();
    }
}

