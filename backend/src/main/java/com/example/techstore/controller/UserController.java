package com.example.techstore.controller;

import com.example.techstore.dto.UserDetailsDto;
import com.example.techstore.dto.request.UpdateProfileRequest;
import com.example.techstore.entity.User;
import com.example.techstore.repository.UserRepository;
import com.example.techstore.security.repository.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("api/user")
@CrossOrigin
public class UserController {
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserDetailRepository userDetailRepository;

    @GetMapping("/profile")
    public ResponseEntity<UserDetailsDto> getUserProfile(Principal principal) {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName()); // getName() là tên đăng nhập chính là email
        if(user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        UserDetailsDto userDetailsDto = UserDetailsDto.builder()
                .name(user.getName())
                .email(user.getEmail())
                .dateOfBirth(user.getDateOfBirth())
                .address(user.getAddress())
                .phone(user.getPhone())
                .id(user.getId())
                .role(user.getRole()).build();
        return new ResponseEntity<>(userDetailsDto, HttpStatus.OK);

    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(Principal principal, @RequestBody UpdateProfileRequest request) {
            User user = (User) userDetailsService.loadUserByUsername(principal.getName());
            if(user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
            user.setName(request.getName());
            user.setDateOfBirth(request.getDateOfBirth());
            user.setAddress(request.getAddress());
            user.setPhone(request.getPhone());

            userDetailRepository.save(user);
            return new ResponseEntity<>("Profile updated successfully", HttpStatus.OK);
    }

}
